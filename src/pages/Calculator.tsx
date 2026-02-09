import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorsaGoIcon } from "@/components/BorsaGoIcon";
import { toast } from "sonner";
import { roundTo3 } from "@/lib/utils";
import { calculate } from "../lib/calculator";
import { saveEntry, type SavedEntry } from "@/lib/storage";

type MarketValueMode = "direct" | "shares";
type FeeMode = "total" | "discrete";

interface FeeItem {
  name: string;
  amount: string;
}

export default function Calculator() {
  const [stockName, setStockName] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [marketValueMode, setMarketValueMode] =
    useState<MarketValueMode>("direct");
  const [marketValue, setMarketValue] = useState("");
  const [numberOfShares, setNumberOfShares] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [feeMode, setFeeMode] = useState<FeeMode>("total");
  const [totalFees, setTotalFees] = useState("");
  const [feeItems, setFeeItems] = useState<FeeItem[]>([
    { name: "", amount: "" },
  ]);
  const [purifyingPercentage, setPurifyingPercentage] = useState("");

  const [result, setResult] = useState<{
    profit: number;
    netProfit: number;
    purifyingAmount: number;
    finalProfit: number;
  } | null>(null);

  const location = useLocation();

  const [editingId, setEditingId] = useState<string | null>(null);

  const totalFeesValue =
    feeMode === "total"
      ? parseFloat(totalFees) || 0
      : feeItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleCalculate = () => {
    const purchase = parseFloat(purchaseValue);
    const market =
      marketValueMode === "direct"
        ? parseFloat(marketValue)
        : parseFloat(numberOfShares) * parseFloat(sharePrice);

    const calcResult = calculate({
      purchaseValue: purchase,
      marketValue: market,
      appFees: totalFeesValue,
      thirdPartyFee: 0,
      purifyingPercentage: parseFloat(purifyingPercentage) || 0,
    });

    setResult(calcResult);
  };

  useEffect(() => {
    const state = location.state as { editEntry?: SavedEntry } | null;
    if (state?.editEntry) {
      const e = state.editEntry;
      setEditingId(e.id);
      setStockName(e.stockName);
      setPurchaseValue(e.purchaseValue.toString());
      setMarketValueMode("direct");
      setMarketValue(e.marketValue.toString());
      setFeeMode("total");
      setTotalFees((e.appFees + (e.thirdPartyFee ?? 0)).toString());
      setPurifyingPercentage(e.purifyingPercentage.toString());

      const calcResult = calculate({
        purchaseValue: e.purchaseValue,
        marketValue: e.marketValue,
        appFees: e.appFees + (e.thirdPartyFee ?? 0),
        thirdPartyFee: 0,
        purifyingPercentage: e.purifyingPercentage,
      });
      setResult(calcResult);
    }
  }, [location.state]);

  const handleSave = () => {
    if (result === null) return;
    const market =
      marketValueMode === "direct"
        ? parseFloat(marketValue)
        : parseFloat(numberOfShares) * parseFloat(sharePrice);
    const feesTotal =
      feeMode === "total"
        ? parseFloat(totalFees) || 0
        : feeItems.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0
          );
    saveEntry({
      id: editingId ?? undefined,
      stockName: stockName.trim() || "Unnamed",
      purchaseValue: parseFloat(purchaseValue),
      marketValue: market,
      appFees: feesTotal,
      thirdPartyFee: 0,
      purifyingPercentage: parseFloat(purifyingPercentage) || 0,
      profit: result.profit,
      netProfit: result.netProfit,
      purifyingAmount: result.purifyingAmount,
      finalProfit: result.finalProfit,
    });
    toast.success("Calculation saved to history");
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Form card - centered with good spacing */}
      <div className="space-y-8 p-4">
        {/* Borsa Go branding at top of form */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <BorsaGoIcon className="h-12 w-12 text-primary sm:h-14 sm:w-14" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Borsa Go
            </h1>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            Percentage & Profit Calculator
          </p>
        </div>

        <div className="form-card rounded-2xl border border-white/15 bg-card/90 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="space-y-2.5">
            <Label
              htmlFor="stockName"
              className="text-sm font-medium sm:text-base"
            >
              Stock Name
            </Label>
            <Input
              id="stockName"
              type="text"
              placeholder="e.g. COMI, CIB"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              className="h-12 text-base sm:h-14 sm:text-lg"
            />
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="purchase"
              className="text-sm font-medium sm:text-base"
            >
              Purchase Value
            </Label>
            <Input
              id="purchase"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={purchaseValue}
              onChange={(e) => setPurchaseValue(e.target.value)}
              className="h-12 text-base sm:h-14 sm:text-lg"
            />
            {result && (
              <div className="mt-2 rounded-md border border-chart-1/40 bg-chart-1/10 px-3 py-2 text-xs font-medium text-chart-1 sm:text-sm">
                <span>Gross Profit: </span>
                <span>
                  {result.profit >= 0 ? "+" : ""}
                  {result.profit.toFixed(3)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-medium sm:text-base">
              Market Value
            </Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={marketValueMode === "direct" ? "default" : "outline"}
                size="sm"
                onClick={() => setMarketValueMode("direct")}
              >
                Direct
              </Button>
              <Button
                type="button"
                variant={marketValueMode === "shares" ? "default" : "outline"}
                size="sm"
                onClick={() => setMarketValueMode("shares")}
              >
                Shares × Price
              </Button>
            </div>
            {marketValueMode === "direct" ? (
              <Input
                id="market"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                value={marketValue}
                onChange={(e) => setMarketValue(e.target.value)}
                className="h-12 text-base sm:h-14 sm:text-lg"
              />
            ) : (
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-[120px] space-y-2">
                  <Label
                    htmlFor="shares"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Number of Shares
                  </Label>
                  <Input
                    id="shares"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0"
                    value={numberOfShares}
                    onChange={(e) => setNumberOfShares(e.target.value)}
                    className="h-12 text-base sm:h-14 sm:text-lg"
                  />
                </div>
                <div className="flex-1 min-w-[120px] space-y-2">
                  <Label
                    htmlFor="sharePrice"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    Share Price
                  </Label>
                  <Input
                    id="sharePrice"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="0.00"
                    value={sharePrice}
                    onChange={(e) => setSharePrice(e.target.value)}
                    className="h-12 text-base sm:h-14 sm:text-lg"
                  />
                </div>
                <div className="flex items-end pb-1 text-primary text-lg font-medium sm:text-xl">
                  ={" "}
                  {roundTo3(
                    parseFloat(numberOfShares) * parseFloat(sharePrice) || 0
                  ).toFixed(3)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-medium sm:text-base">Fees</Label>
            <div className="mb-2 flex gap-2">
              <Button
                type="button"
                variant={feeMode === "total" ? "default" : "outline"}
                size="sm"
                onClick={() => setFeeMode("total")}
              >
                Total Fees
              </Button>
              <Button
                type="button"
                variant={feeMode === "discrete" ? "default" : "outline"}
                size="sm"
                onClick={() => setFeeMode("discrete")}
              >
                Discrete Fees
              </Button>
            </div>

            {feeMode === "total" ? (
              <div className="space-y-2.5">
                <Label
                  htmlFor="totalFees"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Total Fees
                </Label>
                <Input
                  id="totalFees"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="0.00"
                  value={totalFees}
                  onChange={(e) => setTotalFees(e.target.value)}
                  className="h-12 text-base sm:h-14 sm:text-lg"
                />
              </div>
            ) : (
              <div className="space-y-3">
                {feeItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-end gap-2 sm:gap-3"
                  >
                    <div className="min-w-[120px] flex-1 space-y-2">
                      <Label
                        htmlFor={`fee-name-${index}`}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Fee Name
                      </Label>
                      <Input
                        id={`fee-name-${index}`}
                        type="text"
                        placeholder="e.g. Broker, Taxes"
                        value={item.name}
                        onChange={(e) => {
                          const next = [...feeItems];
                          next[index] = {
                            ...next[index],
                            name: e.target.value,
                          };
                          setFeeItems(next);
                        }}
                        className="h-12 text-base sm:h-14 sm:text-lg"
                      />
                    </div>
                    <div className="min-w-[120px] flex-1 space-y-2">
                      <Label
                        htmlFor={`fee-amount-${index}`}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Fee Value
                      </Label>
                      <Input
                        id={`fee-amount-${index}`}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder="0.00"
                        value={item.amount}
                        onChange={(e) => {
                          const next = [...feeItems];
                          next[index] = {
                            ...next[index],
                            amount: e.target.value,
                          };
                          setFeeItems(next);
                        }}
                        className="h-12 text-base sm:h-14 sm:text-lg"
                      />
                    </div>
                    {feeItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setFeeItems((items) =>
                            items.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={feeItems.length >= 10}
                  onClick={() =>
                    setFeeItems((items) =>
                      items.length < 10
                        ? [...items, { name: "", amount: "" }]
                        : items
                    )
                  }
                >
                  Add Fee ({feeItems.length}/10)
                </Button>
              </div>
            )}
            {totalFeesValue > 0 && (
              <div className="mt-2 rounded-md border border-muted/40 bg-muted/15 px-3 py-2 text-xs text-muted-foreground sm:text-sm">
                Total Fees: {totalFeesValue.toFixed(3)}
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="purifying"
              className="text-sm font-medium sm:text-base"
            >
              Purifying Percentage (%)
            </Label>
            <Input
              id="purifying"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="e.g. 2"
              value={purifyingPercentage}
              onChange={(e) => setPurifyingPercentage(e.target.value)}
              className="h-12 text-base sm:h-14 sm:text-lg"
            />
          </div>

          <Button
            onClick={handleCalculate}
            className="h-12 w-full text-base sm:h-14 sm:text-lg"
            size="lg"
          >
            Calculate
          </Button>

          {result !== null && (
            <>
              <Button
                onClick={handleSave}
                variant="secondary"
                className="h-12 w-full text-base sm:h-14 sm:text-lg"
                size="lg"
              >
                Save to History
              </Button>
              <div className="results-card rounded-xl border border-white/15 bg-muted/40 shadow-inner">
                <p className="text-sm font-medium text-muted-foreground">
                  Results
                </p>
                <p
                  className={`text-lg ${
                    result.profit >= 0 ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  Profit: {result.profit >= 0 ? "+" : ""}
                  {result.profit.toFixed(3)}
                </p>
                <p
                  className={`text-lg ${
                    result.netProfit >= 0 ? "text-chart-1" : "text-destructive"
                  }`}
                >
                  Net Profit: {result.netProfit >= 0 ? "+" : ""}
                  {result.netProfit.toFixed(3)}
                </p>
                {result.profit > 0 && (
                  <p className="text-lg text-muted-foreground">
                    Purifying: -{result.purifyingAmount.toFixed(3)}
                  </p>
                )}
                <p
                  className={`text-2xl font-bold sm:text-3xl ${
                    result.finalProfit >= 0
                      ? "text-chart-1"
                      : "text-destructive"
                  }`}
                >
                  Final Profit: {result.finalProfit >= 0 ? "+" : ""}
                  {result.finalProfit.toFixed(3)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
