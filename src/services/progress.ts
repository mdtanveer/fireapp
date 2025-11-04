import { Snapshot, SnapshotPoint } from "../types/progress";

export function toSeries(snapshots: Snapshot[]): SnapshotPoint[] {
  return snapshots
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => {
      // Calculate net worth from all custom columns: assets add to net worth, liabilities subtract from net worth
      let netWorth = 0;
      if (s.customColumns) {
        for (const [key, column] of Object.entries(s.customColumns)) {
          if (column.type === "asset") {
            netWorth += column.value;
          } else if (column.type === "liability") {
            netWorth -= column.value;
          }
        }
      }
      return { date: s.date, netWorth };
    });
}

export function latestSnapshot(snapshots: Snapshot[]): Snapshot | undefined {
  return snapshots.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
}
