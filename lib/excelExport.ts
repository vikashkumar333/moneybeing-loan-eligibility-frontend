import ExcelJS from "exceljs";
import { LeadListItem } from "@/types/lead";
import { DashboardFilters } from "@/components/dashboard/DashboardFilterToolbar";

export interface ExportSummaryStats {
  total: number;
  eligible: number;
  notEligible: number;
  avgCreditScore: string;
  totalLoanAmount: number;
}

export const generateLeadsExcel = async (
  leads: LeadListItem[],
  filters: DashboardFilters
): Promise<Blob> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "MoneyBeing Loan Portal";
  workbook.lastModifiedBy = "Admin";
  workbook.created = new Date();
  workbook.modified = new Date();

  // ==========================================
  // SHEET 1: LEADS DATA
  // ==========================================
  const leadsSheet = workbook.addWorksheet("Leads", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: "FF2563EB" } },
  });

  leadsSheet.columns = [
    { header: "Application ID", key: "id", width: 16 },
    { header: "Customer Name", key: "full_name", width: 26 },
    { header: "Mobile Number", key: "mobile", width: 18 },
    { header: "Email Address", key: "email", width: 28 },
    { header: "Loan Type", key: "loan_type", width: 22 },
    { header: "Loan Amount (₹)", key: "loan_amount", width: 20 },
    { header: "Property Value (₹)", key: "property_value", width: 20 },
    { header: "Employment Type", key: "employment_type", width: 20 },
    { header: "Monthly Income (₹)", key: "monthly_income", width: 22 },
    { header: "Credit Score", key: "credit_score", width: 16 },
    { header: "BRE Decision", key: "bre_status", width: 18 },
    { header: "Rejection Reasons", key: "rejection_reasons", width: 36 },
    { header: "Application Date", key: "created_at", width: 22 },
  ];

  // Header Row Formatting
  const headerRow = leadsSheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10.5, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" }, // Navy blue
    };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FF0F172A" } },
      left: { style: "thin", color: { argb: "FF334155" } },
      bottom: { style: "medium", color: { argb: "FF0F172A" } },
      right: { style: "thin", color: { argb: "FF334155" } },
    };
  });

  // Enable AutoFilter on header row
  leadsSheet.autoFilter = "A1:M1";

  // Populate Data Rows
  leads.forEach((lead, index) => {
    const isEligible = lead.bre_status?.toLowerCase() === "eligible";
    const row = leadsSheet.addRow({
      id: `#${lead.id}`,
      full_name: lead.full_name,
      mobile: String(lead.mobile), // String preserves leading zeros / exact phone
      email: lead.email || "—",
      loan_type: lead.loan_type,
      loan_amount: Number(lead.loan_amount || 0),
      property_value: Number(lead.property_value || 0),
      employment_type: lead.employment_type,
      monthly_income: Number(lead.monthly_income || 0),
      credit_score: lead.credit_score !== null && lead.credit_score !== undefined ? Number(lead.credit_score) : "—",
      bre_status: lead.bre_status,
      rejection_reasons: lead.rejection_reasons && lead.rejection_reasons.length > 0
        ? lead.rejection_reasons.join("; ")
        : "None",
      created_at: new Date(lead.created_at).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    row.height = 22;
    const isEven = index % 2 === 1;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Segoe UI", size: 10, color: { argb: "FF1E293B" } };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };

      if (isEven) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAFC" },
        };
      }

      // Column-specific alignments and formats
      if ([1, 3, 10, 13].includes(colNumber)) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      } else if ([6, 7, 9].includes(colNumber)) {
        cell.alignment = { vertical: "middle", horizontal: "right" };
        cell.numFmt = "₹#,##0";
      } else if (colNumber === 11) {
        // BRE Decision column
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = {
          name: "Segoe UI",
          size: 10,
          bold: true,
          color: { argb: isEligible ? "FF047857" : "FFBE123C" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isEligible ? "FFECFDF5" : "FFFFF1F2" },
        };
      } else if (colNumber === 12) {
        // Rejection reasons column
        cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      }
    });
  });

  // ==========================================
  // SHEET 2: EXPORT SUMMARY & AUDIT
  // ==========================================
  const summarySheet = workbook.addWorksheet("Export Summary", {
    properties: { tabColor: { argb: "FF10B981" } },
  });

  summarySheet.columns = [
    { key: "label", width: 28 },
    { key: "value", width: 34 },
  ];

  // Title Banner
  summarySheet.mergeCells("A1:B1");
  const titleCell = summarySheet.getCell("A1");
  titleCell.value = "MoneyBeing — Lead Export Summary Report";
  titleCell.font = { name: "Segoe UI", size: 13, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E3A8A" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  summarySheet.getRow(1).height = 32;

  summarySheet.addRow([]);

  // Report Metadata Section
  const nowStr = new Date().toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "medium",
  });

  const metadataRows = [
    ["Report Generated At", nowStr],
    ["Generated By", "Admin User"],
    ["Total Records Exported", leads.length],
  ];

  metadataRows.forEach(([lbl, val]) => {
    const r = summarySheet.addRow([lbl, val]);
    r.height = 20;
    r.getCell(1).font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF334155" } };
    r.getCell(2).font = { name: "Segoe UI", size: 10, color: { argb: "FF0F172A" } };
    r.getCell(1).border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
    r.getCell(2).border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
  });

  summarySheet.addRow([]);

  // Applied Filters Section
  summarySheet.mergeCells("A6:B6");
  const filterHeader = summarySheet.getCell("A6");
  filterHeader.value = "Applied Search & Filter Parameters";
  filterHeader.font = { name: "Segoe UI", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
  filterHeader.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2563EB" },
  };
  filterHeader.alignment = { vertical: "middle", horizontal: "left" };
  summarySheet.getRow(6).height = 24;

  const filterRows = [
    ["Search Keyword", filters.search ? `"${filters.search}"` : "None (All Applications)"],
    ["BRE Eligibility Status", filters.bre_status || "All Statuses"],
    ["Loan Type", filters.loan_type || "All Loan Types"],
    ["Employment Type", filters.employment_type || "All Employment Types"],
    ["Start Date (From)", filters.date_from || "All Historical"],
    ["End Date (To)", filters.date_to || "Present Date"],
  ];

  filterRows.forEach(([lbl, val]) => {
    const r = summarySheet.addRow([lbl, val]);
    r.height = 20;
    r.getCell(1).font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF334155" } };
    r.getCell(2).font = { name: "Segoe UI", size: 10, color: { argb: "FF0F172A" } };
    r.getCell(1).border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
    r.getCell(2).border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
  });

  summarySheet.addRow([]);

  // Summary Analytics Section
  const eligibleCount = leads.filter((l) => l.bre_status?.toLowerCase() === "eligible").length;
  const notEligibleCount = leads.length - eligibleCount;
  const validScores = leads.filter((l) => l.credit_score !== null && l.credit_score !== undefined);
  const avgCredit = validScores.length > 0
    ? (validScores.reduce((s, l) => s + Number(l.credit_score || 0), 0) / validScores.length).toFixed(1)
    : "N/A";
  const totalLoanVol = leads.reduce((s, l) => s + Number(l.loan_amount || 0), 0);

  summarySheet.mergeCells("A14:B14");
  const statsHeader = summarySheet.getCell("A14");
  statsHeader.value = "Dataset Summary Statistics";
  statsHeader.font = { name: "Segoe UI", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
  statsHeader.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF059669" },
  };
  statsHeader.alignment = { vertical: "middle", horizontal: "left" };
  summarySheet.getRow(14).height = 24;

  const statsRows = [
    ["Total Applications Exported", `${leads.length}`],
    ["Eligible Applications", `${eligibleCount} (${leads.length > 0 ? Math.round((eligibleCount / leads.length) * 100) : 0}%)`],
    ["Not Eligible Applications", `${notEligibleCount} (${leads.length > 0 ? Math.round((notEligibleCount / leads.length) * 100) : 0}%)`],
    ["Average Credit Score", `${avgCredit}`],
    ["Total Loan Volume Requested", `₹${totalLoanVol.toLocaleString("en-IN")}`],
  ];

  statsRows.forEach(([lbl, val]) => {
    const r = summarySheet.addRow([lbl, val]);
    r.height = 20;
    r.getCell(1).font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF334155" } };
    r.getCell(2).font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF047857" } };
    r.getCell(1).border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
    r.getCell(2).border = { bottom: { style: "thin", color: { argb: "FFE2E8F0" } } };
  });

  // Generate Excel buffer and return Blob
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};

export const buildExportFileName = (filters: DashboardFilters): string => {
  const parts = ["MoneyBeing", "Leads"];

  if (filters.bre_status) {
    parts.push(filters.bre_status.replace(/[^a-zA-Z0-9]/g, ""));
  }
  if (filters.loan_type) {
    parts.push(filters.loan_type.replace(/[^a-zA-Z0-9]/g, ""));
  }
  if (filters.employment_type) {
    parts.push(filters.employment_type.replace(/[^a-zA-Z0-9]/g, ""));
  }

  const dateStr = new Date().toISOString().split("T")[0];
  parts.push(dateStr);

  return `${parts.join("_")}.xlsx`;
};
