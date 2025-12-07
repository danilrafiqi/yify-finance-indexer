import { ponder } from "ponder:registry";
import { YieldEvent, ProtocolMetric } from "../../ponder.schema";

// Handler untuk Yield Distribution
ponder.on("YIFYYieldDistributorV2:YieldDistributed", async ({ event, context }) => {
    const loanId = event.args.asset.toLowerCase() + "-" + event.args.tokenId.toString();

    // Insert yield event record
    await context.db.insert(YieldEvent).values({
        id: event.transaction.hash + "-" + event.log.logIndex,
        loanId: loanId,
        asset: event.args.asset,
        tokenId: event.args.tokenId,
        totalAmount: event.args.totalAmount,
        repaidDebt: event.args.repaidDebt,
        lenderYield: event.args.lenderYield,
        protocolFee: event.args.protocolFee,
        timestamp: event.block.timestamp,
    });

    // Update Protocol Metrics
    const metric = await context.db.find(ProtocolMetric, { id: "global" });
    if (!metric) {
        await context.db.insert(ProtocolMetric).values({
            id: "global",
            totalBorrowed: 0n,
            totalYieldDistributed: event.args.totalAmount,
            totalProtocolFees: event.args.protocolFee
        });
    } else {
        await context.db.update(ProtocolMetric, { id: "global" }).set({
            totalYieldDistributed: metric.totalYieldDistributed + event.args.totalAmount,
            totalProtocolFees: metric.totalProtocolFees + event.args.protocolFee
        });
    }
});
