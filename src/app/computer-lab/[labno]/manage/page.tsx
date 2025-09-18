"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  type: "cpu" | "monitor";
  status: "good" | "issue" | "maintenance";
  model?: string;
  location?: string;
  notes?: string;
  // CPU-specific fields
  processor?: string;
  ram?: string;
  ssd?: string;
  hdd?: string;
  gpu?: string;
  lastUpdated?: string;
};

export default function ManageLabPage() {
  const router = useRouter();
  const params = useParams();
  const labno = params.labno as string;

  // Sample registered items. In a real app, fetch by lab.
  const [items, setItems] = useState<Item[]>([
    {
      id: "CPU-001",
      type: "cpu",
      status: "good",
      model: "i5-12400",
      location: "Desk 1",
      processor: "Intel i5-12400",
      ram: "16GB DDR4",
      ssd: "512GB NVMe",
      hdd: "1TB HDD",
      gpu: "Integrated UHD",
      lastUpdated: "2024-01-15",
    },
    {
      id: "CPU-002",
      type: "cpu",
      status: "issue",
      model: "i7-9700",
      location: "Desk 2",
      notes: "Fan noise",
      processor: "Intel i7-9700",
      ram: "8GB DDR4",
      ssd: "256GB NVMe",
      hdd: "—",
      gpu: "GTX 1050",
      lastUpdated: "2024-01-14",
    },
    {
      id: "CPU-003",
      type: "cpu",
      status: "good",
      model: "Ryzen 5 5600",
      location: "Desk 3",
      processor: "Ryzen 5 5600",
      ram: "16GB DDR4",
      ssd: "512GB NVMe",
      hdd: "—",
      gpu: "RX 6600",
      lastUpdated: "2024-01-13",
    },
    {
      id: "MON-001",
      type: "monitor",
      status: "good",
      model: 'Dell 24"',
      location: "Desk 1",
    },
    {
      id: "MON-002",
      type: "monitor",
      status: "issue",
      model: 'LG 27"',
      location: "Desk 2",
      notes: "Dead pixel",
    },
    {
      id: "MON-003",
      type: "monitor",
      status: "good",
      model: 'Samsung 24"',
      location: "Desk 3",
    },
  ]);

  const [active, setActive] = useState<"cpu" | "monitor">("cpu");
  const [selected, setSelected] = useState<Item | null>(null);
  const [form, setForm] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filtered = useMemo(
    () => items.filter((i) => i.type === active),
    [items, active]
  );

  useEffect(() => {
    if (selected) {
      setForm({ ...selected });
      setIsEditing(false);
    } else {
      setForm(null);
      setIsEditing(false);
    }
  }, [selected]);

  const updateForm = (key: keyof Item, value: string) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const handleSave = () => {
    if (!form) return;
    const toSave: Item = {
      ...form,
      lastUpdated:
        form.type === "cpu"
          ? new Date().toISOString().slice(0, 10)
          : form.lastUpdated,
    };
    setItems((prev) => prev.map((it) => (it.id === toSave.id ? toSave : it)));
    setSelected(toSave);
    setIsEditing(false);
  };

  const genId = (kind: "cpu" | "monitor") => {
    const prefix = kind === "cpu" ? "CPU-" : "MON-";
    const nums = items
      .filter((i) => i.type === kind)
      .map((i) => parseInt(i.id.replace(/[^0-9]/g, ""), 10))
      .filter((n) => !Number.isNaN(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}${String(next).padStart(3, "0")}`;
  };

  const handleAdd = (kind: "cpu" | "monitor") => {
    const newItem: Item =
      kind === "cpu"
        ? {
            id: genId("cpu"),
            type: "cpu",
            status: "good",
            model: "",
            location: "",
            notes: "",
            processor: "",
            ram: "",
            ssd: "",
            hdd: "",
            gpu: "",
            lastUpdated: new Date().toISOString().slice(0, 10),
          }
        : {
            id: genId("monitor"),
            type: "monitor",
            status: "good",
            model: "",
            location: "",
            notes: "",
          };
    setItems((prev) => [newItem, ...prev]);
    setActive(kind);
    setSelected(newItem);
    setForm({ ...newItem });
    setIsEditing(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActive("cpu");
                setSelected(null);
              }}
              className={`px-4 py-2 rounded-lg border ${
                active === "cpu"
                  ? "border-neutral-700 bg-neutral-800/60 text-neutral-100"
                  : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              CPU
            </button>
            <button
              onClick={() => {
                setActive("monitor");
                setSelected(null);
              }}
              className={`px-4 py-2 rounded-lg border ${
                active === "monitor"
                  ? "border-neutral-700 bg-neutral-800/60 text-neutral-100"
                  : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              Monitor
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">Total</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-800 px-2 py-1 text-xs text-neutral-300">
              {active === "cpu" ? "CPU" : "Monitor"}: {filtered.length}
            </span>
            <div className="ml-3 flex gap-2">
              <button
                onClick={() => handleAdd("cpu")}
                className="px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 text-xs"
              >
                + Add CPU
              </button>
              <button
                onClick={() => handleAdd("monitor")}
                className="px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 text-xs"
              >
                + Add Monitor
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {filtered.map((it) => (
                <button
                  key={it.id}
                  onClick={() => setSelected(it)}
                  className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                    selected?.id === it.id
                      ? "border-neutral-700 bg-neutral-800/60"
                      : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-neutral-700 text-[10px] text-neutral-300">
                      {active === "cpu" ? "CPU" : "MON"}
                    </span>
                    <span className="font-mono text-neutral-100">{it.id}</span>
                  </div>
                  <span
                    className={`text-xs rounded-full px-2 py-1 border ${
                      it.status === "good"
                        ? "text-green-400 border-green-500/30"
                        : it.status === "issue"
                        ? "text-red-400 border-red-500/30"
                        : "text-amber-400 border-amber-400/30"
                    }`}
                  >
                    {it.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                <div className="text-lg font-semibold text-neutral-100 mb-4">
                  {selected.id}
                </div>
                {selected.type === "cpu" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Processor
                      </label>
                      <input
                        readOnly={!isEditing}
                        value={form?.processor || ""}
                        onChange={(e) =>
                          updateForm("processor", e.target.value)
                        }
                        className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Ram
                        </label>
                        <input
                          readOnly={!isEditing}
                          value={form?.ram || ""}
                          onChange={(e) => updateForm("ram", e.target.value)}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          SSD
                        </label>
                        <input
                          readOnly={!isEditing}
                          value={form?.ssd || ""}
                          onChange={(e) => updateForm("ssd", e.target.value)}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        HDD
                      </label>
                      <input
                        readOnly={!isEditing}
                        value={form?.hdd || ""}
                        onChange={(e) => updateForm("hdd", e.target.value)}
                        className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Graphics Card
                      </label>
                      <input
                        readOnly={!isEditing}
                        value={form?.gpu || ""}
                        onChange={(e) => updateForm("gpu", e.target.value)}
                        className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Status
                        </label>
                        {isEditing ? (
                          <select
                            value={form?.status || "good"}
                            onChange={(e) =>
                              updateForm("status", e.target.value)
                            }
                            className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                          >
                            <option value="good">good</option>
                            <option value="issue">issue</option>
                            <option value="maintenance">maintenance</option>
                          </select>
                        ) : (
                          <input
                            readOnly
                            value={form?.status || ""}
                            className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Location
                        </label>
                        <input
                          readOnly={!isEditing}
                          value={form?.location || ""}
                          onChange={(e) =>
                            updateForm("location", e.target.value)
                          }
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Last updated
                        </label>
                        <input
                          readOnly
                          value={form?.lastUpdated || ""}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Notes
                      </label>
                      <textarea
                        readOnly={!isEditing}
                        value={form?.notes || ""}
                        onChange={(e) => updateForm("notes", e.target.value)}
                        className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none min-h-[80px]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setForm(selected);
                              setIsEditing(false);
                            }}
                            className="px-4 py-2 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-md border border-green-600/30 bg-green-700/20 text-green-300 hover:bg-green-700/30"
                          >
                            Save
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Model
                        </label>
                        <input
                          readOnly={!isEditing}
                          value={form?.model || ""}
                          onChange={(e) => updateForm("model", e.target.value)}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                          Location
                        </label>
                        <input
                          readOnly={!isEditing}
                          value={form?.location || ""}
                          onChange={(e) =>
                            updateForm("location", e.target.value)
                          }
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={form?.status || "good"}
                          onChange={(e) => updateForm("status", e.target.value)}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        >
                          <option value="good">good</option>
                          <option value="issue">issue</option>
                          <option value="maintenance">maintenance</option>
                        </select>
                      ) : (
                        <input
                          readOnly
                          value={form?.status || ""}
                          className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Notes
                      </label>
                      <textarea
                        readOnly={!isEditing}
                        value={form?.notes || ""}
                        onChange={(e) => updateForm("notes", e.target.value)}
                        className="w-full rounded-md border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 outline-none min-h-[80px]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setForm(selected);
                              setIsEditing(false);
                            }}
                            className="px-4 py-2 rounded-md border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-md border border-green-600/30 bg-green-700/20 text-green-300 hover:bg-green-700/30"
                          >
                            Save
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-neutral-400 text-sm">
                Select an item to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
