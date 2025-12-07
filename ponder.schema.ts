import { onchainTable, index } from "ponder";

export const Loan = onchainTable("loan", (t) => ({
  id: t.text().primaryKey(), // nftContract-tokenId
  borrower: t.hex().notNull(),
  nftContract: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  totalBorrowed: t.bigint().notNull(),
  remainingDebt: t.bigint().notNull(),
  isActive: t.boolean().notNull(),
  createdAt: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));

export const YieldEvent = onchainTable("yield_event", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  loanId: t.text().notNull(),
  asset: t.hex().notNull(),
  tokenId: t.bigint().notNull(),
  totalAmount: t.bigint().notNull(),
  repaidDebt: t.bigint().notNull(),
  lenderYield: t.bigint().notNull(),
  protocolFee: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

export const ProtocolMetric = onchainTable("protocol_metric", (t) => ({
  id: t.text().primaryKey(), // "global"
  totalBorrowed: t.bigint().notNull(),
  totalYieldDistributed: t.bigint().notNull(),
  totalProtocolFees: t.bigint().notNull(),
}));

export const LenderPosition = onchainTable("lender_position", (t) => ({
  id: t.text().primaryKey(), // user address
  user: t.hex().notNull(),
  totalDeposited: t.bigint().notNull(),
  totalWithdrawn: t.bigint().notNull(),
  currentBalance: t.bigint().notNull(),
  updatedAt: t.bigint().notNull(),
}));