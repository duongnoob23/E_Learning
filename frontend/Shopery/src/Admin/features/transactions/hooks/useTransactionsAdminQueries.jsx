import { useQuery } from "@tanstack/react-query";
import { transactionsAdminApi } from "../api/transactionsAdminApi";

// Query keys scoped to admin transactions
export const adminTransactionsKeys = {
  all: ["admin", "transactions"],
  transactions: () => [...adminTransactionsKeys.all, "list"],
  transactionList: (filters) => [...adminTransactionsKeys.transactions(), filters],
  transactionDetail: (id) => [...adminTransactionsKeys.all, "detail", id],
  stats: () => [...adminTransactionsKeys.all, "stats"],
  revenue: (params) => [...adminTransactionsKeys.all, "revenue", params],
};

// ==================== TRANSACTIONS QUERIES ==================== //

// Lấy danh sách giao dịch (có pagination và filters)
export const useAdminTransactions = (filters = {}, enabled = true) =>
  useQuery({
    queryKey: adminTransactionsKeys.transactionList(filters),
    queryFn: () => transactionsAdminApi.getTransactions(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

// Lấy chi tiết giao dịch
export const useAdminTransactionDetail = (orderId, enabled = true) =>
  useQuery({
    queryKey: adminTransactionsKeys.transactionDetail(orderId),
    queryFn: () => transactionsAdminApi.getTransactionDetail(orderId),
    enabled: enabled && !!orderId,
    staleTime: 5 * 60 * 1000,
  });

// ==================== STATS QUERIES ==================== //

// Thống kê giao dịch tổng quan
export const useAdminTransactionStats = (enabled = true) =>
  useQuery({
    queryKey: adminTransactionsKeys.stats(),
    queryFn: () => transactionsAdminApi.getTransactionStats(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

// Thống kê doanh thu theo thời gian
export const useAdminRevenueByPeriod = (params = {}, enabled = true) =>
  useQuery({
    queryKey: adminTransactionsKeys.revenue(params),
    queryFn: () => transactionsAdminApi.getRevenueByPeriod(params),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

