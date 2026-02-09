import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorsaGoIcon } from "@/components/BorsaGoIcon";
import { toast } from "sonner";
import { roundTo3 } from "@/lib/utils";
import { saveEntry } from "@/lib/storage";

type MarketValueMode = "direct" | "shares";

export default function Calculator() {
  const [stockName, setStockName] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");
  const [marketValueMode, setMarketValueMode] =
    useState<MarketValueMode>("direct");
  const [marketValue, setMarketValue] = useState("");
  const [numberOfShares, setNumberOfShares] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [appFees, setAppFees] = useState("");
  const [thirdPartyFee, setThirdPartyFee] = useState("");
  const [purifyingPercentage, setPurifyingPercentage] = useState("");

  const [result, setResult] = useState<{
    profit: number;
    netProfit: number;
    purifyingAmount: number;
    finalProfit: number;
  } | null>(null);

  const handleCalculate = () => {
    const purchase = parseFloat(purchaseValue);
    const market =
      marketValueMode === "direct"
        ? parseFloat(marketValue)
        : parseFloat(numberOfShares) * parseFloat(sharePrice);
    const fees = parseFloat(appFees) || 0;
    const thirdParty = parseFloat(thirdPartyFee) || 0;
    const purifying = parseFloat(purifyingPercentage) || 0;

    if (isNaN(purchase) || isNaN(market)) {
      setResult(null);
      return;
    }

    const profit = roundTo3(market - purchase);
    const netProfit = roundTo3(profit - fees - thirdParty);
    const purifyingAmount = roundTo3(
      profit > 0 ? profit * (purifying / 100) : 0
    );
    const finalProfit = roundTo3(netProfit - purifyingAmount);

    setResult({ profit, netProfit, purifyingAmount, finalProfit });
  };

  const handleSave = () => {
    if (result === null) return;
    const market =
      marketValueMode === "direct"
        ? parseFloat(marketValue)
        : parseFloat(numberOfShares) * parseFloat(sharePrice);
    saveEntry({
      stockName: stockName.trim() || "Unnamed",
      purchaseValue: parseFloat(purchaseValue),
      marketValue: market,
      appFees: parseFloat(appFees) || 0,
      thirdPartyFee: parseFloat(thirdPartyFee) || 0,
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
            <Label htmlFor="fees" className="text-sm font-medium sm:text-base">
              App Fees
            </Label>
            <Input
              id="fees"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={appFees}
              onChange={(e) => setAppFees(e.target.value)}
              className="h-12 text-base sm:h-14 sm:text-lg"
            />
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="thirdParty"
              className="text-sm font-medium sm:text-base"
            >
              Third Party Fee
            </Label>
            <Input
              id="thirdParty"
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="0.00"
              value={thirdPartyFee}
              onChange={(e) => setThirdPartyFee(e.target.value)}
              className="h-12 text-base sm:h-14 sm:text-lg"
            />
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
