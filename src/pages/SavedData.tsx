import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSavedEntries, deleteEntry, type SavedEntry } from "@/lib/storage";

export default function SavedData() {
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setEntries(getSavedEntries());
  }, []);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setEntries(getSavedEntries());
    toast.success("Item deleted");
  };

  const handleEdit = (entry: SavedEntry) => {
    navigate("/", { state: { editEntry: entry } });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString();
  };

  const handleExport = () => {
    if (entries.length === 0) {
      toast.info("No data to export");
      return;
    }

    const headers = [
      "Stock",
      "Purchase",
      "Market",
      "Gross Profit",
      "Purifying %",
      "Purifying Value",
      "Total Fees",
      "Net Profit (Purified)",
      "Saved At",
    ];

    const rows = entries.map((entry) => [
      entry.stockName,
      entry.purchaseValue.toFixed(3),
      entry.marketValue.toFixed(3),
      entry.profit.toFixed(3),
      entry.purifyingPercentage.toFixed(3),
      entry.purifyingAmount.toFixed(3),
      (entry.appFees + (entry.thirdPartyFee ?? 0)).toFixed(3),
      entry.finalProfit.toFixed(3),
      formatDate(entry.savedAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "borsa-go-saved-calculations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Saved Calculations
          </h1>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleExport}
            >
              Export to Excel
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/">New Calculation</Link>
            </Button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-white/15 bg-card/90 p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No saved calculations yet. Calculate and save from the calculator
              page.
            </p>
            <Button asChild>
              <Link to="/">Go to Calculator</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-card/90">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/15 bg-muted/30">
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Purchase
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Market
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Gross Profit
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Purifying %
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Purifying Value
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Total Fees
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Net Profit (Purified)
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Saved
                  </th>
                  <th className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/10 last:border-0 hover:bg-muted/20"
                  >
                    <td className="px-4 py-3 font-medium sm:px-6 sm:py-4">
                      {entry.stockName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">
                      {entry.purchaseValue.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">
                      {entry.marketValue.toFixed(3)}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium sm:px-6 sm:py-4 ${
                        entry.profit >= 0 ? "text-chart-1" : "text-destructive"
                      }`}
                    >
                      {entry.profit >= 0 ? "+" : ""}
                      {entry.profit.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">
                      {entry.purifyingPercentage.toFixed(3)}%
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">
                      {entry.purifyingAmount.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground sm:px-6 sm:py-4">
                      {(entry.appFees + (entry.thirdPartyFee ?? 0)).toFixed(3)}
                    </td>
                    <td
                      className={`px-4 py-3 font-medium sm:px-6 sm:py-4 ${
                        entry.finalProfit >= 0
                          ? "text-chart-1"
                          : "text-destructive"
                      }`}
                    >
                      {entry.finalProfit >= 0 ? "+" : ""}
                      {entry.finalProfit.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm sm:px-6 sm:py-4">
                      {formatDate(entry.savedAt)}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(entry)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/20 hover:text-destructive"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
