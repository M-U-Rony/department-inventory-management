"use client";

import { useState } from "react";
import {
  FiCpu,
  FiMonitor,
  FiPrinter,
  FiBox,
  FiBook,
  FiArchive,
  FiCheckCircle,
  FiMinusCircle,
} from "react-icons/fi";

export default function Room() {
  const [items, setItems] = useState<string[]>([]);
  const [selected, setSelected] = useState("cpu");
  const [detail, setDetail] = useState<{ name: string; assigned: boolean } | null>(null);

  const suggestions = [
    "cpu",
    "monitor",
    "printer",
    "ups",
    "Bookshelf",
    "Almari",
  ];

  const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    cpu: FiCpu,
    monitor: FiMonitor,
    printer: FiPrinter,
    ups: FiBox,
    Bookshelf: FiBook,
    Almari: FiArchive,
  };

  function addItem(label?: string) {
    const value = (label ?? selected).trim();
    if (!value) return;
    setItems((prev) => [...prev, value]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const DetailIcon = detail ? (iconMap[detail.name] ?? FiBox) : FiBox;

  return (
    <main className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <FiArchive className="opacity-80" /> Room Inventory
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <div className="rounded-xl border border-[color:var(--border)] p-4 sm:p-6 card-surface">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {suggestions.map((name) => {
                const assigned = items.includes(name);
                const Icon = iconMap[name] ?? FiBox;
                return (
                  <div
                    key={name}
                    className={`relative rounded-lg border border-[color:var(--border)] aspect-square flex items-center justify-center cursor-pointer ${assigned ? "bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface)]" : "bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)]"}`}
                    onClick={() => setDetail({ name, assigned })}
                  >
                    <div className="flex flex-col items-center gap-2 text-center px-2">
                      <Icon size={28} className={assigned ? "opacity-90" : "opacity-60"} />
                      <div className="text-sm sm:text-base font-medium">{name}</div>
                    </div>
                  
                    <span className={`absolute bottom-2 left-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${assigned ? "bg-green-600 text-white" : "bg-gray-300 text-gray-800"}`}>
                      {assigned ? <FiCheckCircle size={12} /> : <FiMinusCircle size={12} />}
                      {assigned ? "Assigned" : "Empty"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="lg:col-span-1">
          <div className="rounded-xl border border-[color:var(--border)] p-4 sm:p-6 card-surface space-y-3">
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Item</label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--border)]/50"
              >
                {suggestions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => addItem()}
              className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--surface-muted)] cursor-pointer"
            >
              Add Item
            </button>
          </div>
        </section>
      </div>
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="card-surface w-full max-w-sm rounded-xl border border-[color:var(--border)] p-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <DetailIcon size={16} />
                Item details
              </h3>
              <button
                onClick={() => setDetail(null)}
                className="p-1 rounded hover:bg-[color:var(--surface-muted)] cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-sm flex items-center gap-2"><span className="text-gray-500">Name:</span> {detail.name}</div>
              <div className="text-xs text-gray-500">Status: {detail.assigned ? "Assigned" : "Empty"}</div>
              <div className="flex gap-2 pt-2">
                {!detail.assigned ? (
                  <button
                    onClick={() => { setItems((prev) => prev.includes(detail.name) ? prev : [...prev, detail.name]); setDetail(null); }}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--btn-bg)] text-[var(--btn-text)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    Assign
                  </button>
                ) : (
                  <button
                    onClick={() => { setItems((prev) => prev.filter((n) => n !== detail.name)); setDetail(null); }}
                    className="px-4 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-neutral-900 bg-[var(--btn-bg)] focus:outline-none focus:ring-2 focus:ring-red-400 border border-neutral-800 cursor-pointer"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
