import { ponder } from "ponder:registry";
import { LenderPosition, DepositWithdrawEvent } from "../../ponder.schema";

// Handler untuk Deposit (Lender menyetor USDC)
ponder.on("YIFYLendingPoolV2:Deposit", async ({ event, context }) => {
    try {
        const userId = event.args.user.toLowerCase();
        const logIndex = typeof event.log.logIndex === 'number' && isFinite(event.log.logIndex) 
            ? event.log.logIndex 
            : String(event.log.logIndex ?? 0);
        const eventId = `${event.transaction.hash}-${logIndex}`;

        const position = await context.db.find(LenderPosition, { id: userId });

        // Store user address in lowercase for consistent querying
        const userAddress = event.args.user.toLowerCase() as `0x${string}`;

        if (!position) {
            await context.db.insert(LenderPosition).values({
                id: userId,
                user: userAddress,
                totalDeposited: event.args.assets,
                totalWithdrawn: 0n,
                currentBalance: event.args.assets,
                updatedAt: event.block.timestamp,
            });
        } else {
            await context.db.update(LenderPosition, { id: userId }).set({
                totalDeposited: position.totalDeposited + event.args.assets,
                currentBalance: position.currentBalance + event.args.assets,
                updatedAt: event.block.timestamp,
            });
        }

        // Record individual deposit event
        await context.db.insert(DepositWithdrawEvent).values({
            id: eventId,
            user: userAddress,
            type: "deposit",
            assets: event.args.assets,
            shares: event.args.shares,
            timestamp: event.block.timestamp,
            txHash: event.transaction.hash,
            blockNumber: event.block.number,
        });
    } catch (error) {
        console.error("Error in Deposit handler:", error);
        throw error;
    }
});

// Handler untuk Withdraw (Lender menarik USDC)
ponder.on("YIFYLendingPoolV2:Withdraw", async ({ event, context }) => {
    try {
        const userId = event.args.user.toLowerCase();
        const logIndex = typeof event.log.logIndex === 'number' && isFinite(event.log.logIndex) 
            ? event.log.logIndex 
            : String(event.log.logIndex ?? 0);
        const eventId = `${event.transaction.hash}-${logIndex}`;

        const position = await context.db.find(LenderPosition, { id: userId });
        if (!position) return;

        // Store user address in lowercase for consistent querying
        const userAddress = event.args.user.toLowerCase() as `0x${string}`;

        await context.db.update(LenderPosition, { id: userId }).set({
            totalWithdrawn: position.totalWithdrawn + event.args.assets,
            currentBalance: position.currentBalance - event.args.assets,
            updatedAt: event.block.timestamp,
        });

        // Record individual withdraw event
        await context.db.insert(DepositWithdrawEvent).values({
            id: eventId,
            user: userAddress,
            type: "withdraw",
            assets: event.args.assets,
            shares: event.args.shares,
            timestamp: event.block.timestamp,
            txHash: event.transaction.hash,
            blockNumber: event.block.number,
        });
    } catch (error) {
        console.error("Error in Withdraw handler:", error);
        throw error;
    }
});

// Handler untuk PrincipalRepaid (Repayment dari yield atau user)
ponder.on("YIFYLendingPoolV2:PrincipalRepaid", async ({ event, context }) => {
    // Track repayment events untuk analytics
    // Note: LenderPosition tidak perlu update karena:
    // - Repayment tidak mengubah lender balance
    // - Hanya mengurangi totalBorrowed di pool
    // - currentBalance tetap sama (dari convertToAssets)
    
    // Event ini berguna untuk:
    // - Track repayment history
    // - Calculate repayment rate
    // - Analytics dan monitoring
    
    // Optional: Bisa ditambahkan ke table baru jika diperlukan untuk tracking detail
    // Untuk sekarang, event sudah tercatat di blockchain dan bisa di-query via GraphQL
});
