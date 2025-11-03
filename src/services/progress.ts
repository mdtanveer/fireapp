import { Snapshot, SnapshotPoint } from '../types/progress';

export function toSeries(snapshots: Snapshot[]): SnapshotPoint[] {
  return snapshots
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({ date: s.date, netWorth: s.assets - s.liabilities }));
}

export function latestSnapshot(snapshots: Snapshot[]): Snapshot | undefined {
  return snapshots.slice().sort((a, b) => b.date.localeCompare(a.date))[0];
}


