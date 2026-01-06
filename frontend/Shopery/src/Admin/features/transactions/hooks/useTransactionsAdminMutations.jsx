import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { transactionsAdminApi } from "../api/transactionsAdminApi";
import { adminTransactionsKeys } from "./useTransactionsAdminQueries";

// Helpers
const isOk = (data) => (data?.EC ?? data?.data?.EC) === "0";
const em = (data, fallback) => data?.EM || data?.data?.EM || fallback;

// ==================== EXPORT MUTATIONS ==================== //

// Xuất báo cáo giao dịch
export const useExportTransactions = () => {
  return useMutation({
    mutationFn: (params) => transactionsAdminApi.exportTransactions(params),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xuất báo cáo thành công"));
        // Handle download logic here if needed
        if (data.DT && data.DT.length > 0) {
          // Convert to CSV and download
          const csvContent = convertToCSV(data.DT);
          downloadCSV(csvContent, `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
        }
      } else {
        toast.error(em(data, "Xuất báo cáo thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xuất báo cáo"),
  });
};

// Helper: Convert array to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      }).join(",")
    ),
  ];
  
  return csvRows.join("\n");
};

// Helper: Download CSV file
const downloadCSV = (content, filename) => {
  const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

