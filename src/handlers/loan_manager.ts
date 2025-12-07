import { ponder } from "ponder:registry";
import { Loan, ProtocolMetric } from "../../ponder.schema";

// Handler untuk NFT Deposit
ponder.on("YIFYLoanManagerV2:NFTDeposited", async ({ event, context }) => {
    const loanId = event.args.nftContract.toLowerCase() + "-" + event.args.tokenId.toString();

    await context.db.insert(Loan).values({
        id: loanId,
        borrower: event.args.user,
        nftContract: event.args.nftContract,
        tokenId: event.args.tokenId,
        totalBorrowed: 0n,
        remainingDebt: 0n,
        isActive: true,
        createdAt: event.block.timestamp,
        updatedAt: event.block.timestamp,
    });
});

// Handler untuk Borrow
ponder.on("YIFYLoanManagerV2:Borrowed", async ({ event, context }) => {
    const loanId = event.args.nftContract.toLowerCase() + "-" + event.args.tokenId.toString();

    const loan = await context.db.find(Loan, { id: loanId });
    if (!loan) return;

    await context.db.update(Loan, { id: loanId }).set({
        totalBorrowed: loan.totalBorrowed + event.args.amount,
        remainingDebt: loan.remainingDebt + event.args.amount,
        updatedAt: event.block.timestamp,
    });

    // Update Protocol Metrics
    const metric = await context.db.find(ProtocolMetric, { id: "global" });
    if (!metric) {
        await context.db.insert(ProtocolMetric).values({
            id: "global",
            totalBorrowed: event.args.amount,
            totalYieldDistributed: 0n,
            totalProtocolFees: 0n
        });
    } else {
        await context.db.update(ProtocolMetric, { id: "global" }).set({
            totalBorrowed: metric.totalBorrowed + event.args.amount
        });
    }
});

// Handler untuk Repayment
ponder.on("YIFYLoanManagerV2:Repaid", async ({ event, context }) => {
    const loanId = event.args.nftContract.toLowerCase() + "-" + event.args.tokenId.toString();

    await context.db.update(Loan, { id: loanId }).set({
        remainingDebt: event.args.remainingDebt,
        updatedAt: event.block.timestamp,
    });
});

// Handler untuk NFT Withdrawal
ponder.on("YIFYLoanManagerV2:NFTWithdrawn", async ({ event, context }) => {
    const loanId = event.args.nftContract.toLowerCase() + "-" + event.args.tokenId.toString();

    await context.db.update(Loan, { id: loanId }).set({
        isActive: false,
        updatedAt: event.block.timestamp,
    });
});
