import { ponder } from "ponder:registry";
import { LenderPosition } from "../../ponder.schema";

// Handler untuk Deposit (Lender menyetor USDC)
ponder.on("YIFYLendingPoolV2:Deposit", async ({ event, context }) => {
    const userId = event.args.user.toLowerCase();

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
});

// Handler untuk Withdraw (Lender menarik USDC)
ponder.on("YIFYLendingPoolV2:Withdraw", async ({ event, context }) => {
    const userId = event.args.user.toLowerCase();

    const position = await context.db.find(LenderPosition, { id: userId });
    if (!position) return;

    await context.db.update(LenderPosition, { id: userId }).set({
        totalWithdrawn: position.totalWithdrawn + event.args.assets,
        currentBalance: position.currentBalance - event.args.assets,
        updatedAt: event.block.timestamp,
    });
});
