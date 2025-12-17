import { ponder } from "ponder:registry";
import { YieldEvent } from "../../ponder.schema";

ponder.on("UniversalYieldGenerator:YieldGenerated", async ({ event, context }) => {
    try {
        const loanId = event.args.asset.toLowerCase() + "-" + event.args.tokenId.toString();
        const simulationId = `${loanId}-${event.args.amount.toString()}-simulation`;

        await context.db.insert(YieldEvent).values({
            id: simulationId,
            loanId,
            asset: event.args.asset,
            tokenId: event.args.tokenId,
            totalAmount: event.args.amount,
            repaidDebt: 0n,
            lenderYield: 0n,
            protocolFee: 0n,
            timestamp: event.block.timestamp,
        });
    } catch (error) {
        console.error("Error in YieldGenerated handler:", error);
        throw error;
    }
});
