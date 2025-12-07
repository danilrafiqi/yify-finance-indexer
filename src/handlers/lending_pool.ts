import { ponder } from "ponder:registry";
import { LenderPosition, DepositWithdrawEvent } from "../../ponder.schema";

// Handler untuk Deposit (Lender menyetor USDC)
ponder.on("YIFYLendingPoolV2:Deposit", async ({ event, context }) => {
    const userId = event.args.user.toLowerCase();
    const eventId = `${event.transaction.hash}-${event.log.logIndex}`;

    const position = await context.db.find(LenderPosition, { id: userId });

    if (!position) {
        await context.db.insert(LenderPosition).values({
            id: userId,
            user: event.args.user,
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
        user: event.args.user,
        type: "deposit",
        assets: event.args.assets,
        shares: event.args.shares,
        timestamp: event.block.timestamp,
        txHash: event.transaction.hash,
        blockNumber: BigInt(event.block.number),
    });
});

// Handler untuk Withdraw (Lender menarik USDC)
ponder.on("YIFYLendingPoolV2:Withdraw", async ({ event, context }) => {
    const userId = event.args.user.toLowerCase();
    const eventId = `${event.transaction.hash}-${event.log.logIndex}`;

    const position = await context.db.find(LenderPosition, { id: userId });
    if (!position) return;

    await context.db.update(LenderPosition, { id: userId }).set({
        totalWithdrawn: position.totalWithdrawn + event.args.assets,
        currentBalance: position.currentBalance - event.args.assets,
        updatedAt: event.block.timestamp,
    });

    // Record individual withdraw event
    await context.db.insert(DepositWithdrawEvent).values({
        id: eventId,
        user: event.args.user,
        type: "withdraw",
        assets: event.args.assets,
        shares: event.args.shares,
        timestamp: event.block.timestamp,
        txHash: event.transaction.hash,
        blockNumber: BigInt(event.block.number),
    });
});
