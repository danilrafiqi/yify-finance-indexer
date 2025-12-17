import { ponder } from "ponder:registry";
import { YieldEvent, ProtocolMetric } from "../../ponder.schema";

// Handler untuk Yield Distribution
ponder.on("YIFYYieldDistributorV2:YieldDistributed", async ({ event, context }) => {
    try {
        const loanId = event.args.asset.toLowerCase() + "-" + event.args.tokenId.toString();

        const pendingSimulationId = `${loanId}-${event.args.totalAmount.toString()}-simulation`;
        const pendingSimulation = await context.db.find(YieldEvent, { id: pendingSimulationId });

        const logIndex = typeof event.log.logIndex === 'number' && isFinite(event.log.logIndex) 
            ? event.log.logIndex 
            : String(event.log.logIndex ?? 0);

        if (pendingSimulation) {
            await context.db.update(YieldEvent, { id: pendingSimulationId }).set({
                repaidDebt: event.args.repaidDebt,
                lenderYield: event.args.lenderYield,
                protocolFee: event.args.protocolFee,
                timestamp: event.block.timestamp,
                totalAmount: event.args.totalAmount,
            });
            // skip inserting duplicate record
        } else {
            await context.db.insert(YieldEvent).values({
                id: event.transaction.hash + "-" + logIndex,
                loanId: loanId,
                asset: event.args.asset,
                tokenId: event.args.tokenId,
                totalAmount: event.args.totalAmount,
                repaidDebt: event.args.repaidDebt,
                lenderYield: event.args.lenderYield,
                protocolFee: event.args.protocolFee,
                timestamp: event.block.timestamp,
            });
        }

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
    } catch (error) {
        console.error("Error in YieldDistributed handler:", error);
        throw error;
    }
});
