const STORAGE_KEY = "borsa_go_saved_entries";

export interface SavedEntry {
  id: string;
  savedAt: string;
  stockName: string;
  purchaseValue: number;
  marketValue: number;
  appFees: number;
  thirdPartyFee: number;
  purifyingPercentage: number;
  profit: number;
  netProfit: number;
  purifyingAmount: number;
  finalProfit: number;
}

export function getSavedEntries(): SavedEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const entries = data ? JSON.parse(data) : [];
    return entries.map((e: SavedEntry) => ({
      ...e,
      thirdPartyFee: e.thirdPartyFee ?? 0,
    }));
  } catch {
    return [];
  }
}

export function saveEntry(entry: Omit<SavedEntry, "id" | "savedAt">): void {
  const entries = getSavedEntries();
  const newEntry: SavedEntry = {
    ...entry,
    thirdPartyFee: entry.thirdPartyFee ?? 0,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getSavedEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
