"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ComputerLabPage() {
  const params = useParams();
  const router = useRouter();
  const labno = params.labno as string;

  // Convert URL-friendly names back to display names
  const getDisplayName = (urlName: string) => {
    return urlName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayLab = getDisplayName(labno);

  // State for add item functionality
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showComputerDeskForm, setShowComputerDeskForm] = useState(false);
  const [showSimpleForm, setShowSimpleForm] = useState(false);
  const [simpleForm, setSimpleForm] = useState({
    quantity: "",
    description: "",
    lastUpdated: "",
  });
  const [showDeskDetails, setShowDeskDetails] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [showEditDeskForm, setShowEditDeskForm] = useState(false);
  const [editDeskForm, setEditDeskForm] = useState<Desk | null>(null);

  // Computer desk form state
  const [deskForm, setDeskForm] = useState({
    deskNo: "",
    monitor: { id: "", status: "working" },
    cpu: { id: "", status: "working" },
    processor: "",
    ram: "",
    ssd: "",
    hdd: "",
    keyboard: { id: "", status: "working" },
    mouse: { id: "", status: "working" },
    ups: { id: "", status: "working" },
    message: "",
  });

  // Sample inventory data for computer lab
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: "Desktop Computer",
      status: "In Use",
      location: "Desk 1",
      lastChecked: "2024-01-15",
      type: "cpu",
    },
    {
      id: 2,
      name: 'Monitor 24"',
      status: "Available",
      location: "Storage",
      lastChecked: "2024-01-14",
      type: "monitor",
    },
    {
      id: 3,
      name: "Keyboard",
      status: "In Use",
      location: "Desk 2",
      lastChecked: "2024-01-13",
      type: "keyboard",
    },
    {
      id: 4,
      name: "Mouse",
      status: "Maintenance",
      location: "IT Office",
      lastChecked: "2024-01-12",
      type: "mouse",
    },
    {
      id: 5,
      name: "Printer",
      status: "Available",
      location: "Storage",
      lastChecked: "2024-01-11",
      type: "printer",
    },
    {
      id: 6,
      name: "CPU Tower",
      status: "In Use",
      location: "Desk 3",
      lastChecked: "2024-01-10",
      type: "cpu",
    },
    {
      id: 7,
      name: 'Monitor 27"',
      status: "In Use",
      location: "Desk 1",
      lastChecked: "2024-01-09",
      type: "monitor",
    },
    {
      id: 8,
      name: "Wireless Mouse",
      status: "Available",
      location: "Storage",
      lastChecked: "2024-01-08",
      type: "mouse",
    },
  ]);

  // Desk items data
  const [deskItems, setDeskItems] = useState<Desk[]>([
    {
      id: 1,
      deskNo: "Desk 1",
      monitor: { id: "MON001", status: "working" },
      cpu: { id: "CPU001", status: "working" },
      processor: "Intel i7-12700K",
      ram: "16GB DDR4",
      ssd: "512GB NVMe",
      hdd: "1TB HDD",
      keyboard: { id: "KB001", status: "working" },
      mouse: { id: "MS001", status: "working" },
      ups: { id: "UPS001", status: "working" },
      message: "Primary workstation",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      deskNo: "Desk 2",
      monitor: { id: "MON002", status: "working" },
      cpu: { id: "CPU002", status: "maintenance" },
      processor: "Intel i5-12400",
      ram: "8GB DDR4",
      ssd: "256GB NVMe",
      hdd: "500GB HDD",
      keyboard: { id: "KB002", status: "working" },
      mouse: { id: "MS002", status: "working" },
      ups: { id: "UPS002", status: "working" },
      message: "Student workstation",
      lastUpdated: "2024-01-14",
    },
  ]);

  type DeskComponentStatus = { id?: string; status: string };
  interface Desk {
    id: number;
    deskNo: string;
    monitor: DeskComponentStatus;
    cpu: DeskComponentStatus;
    processor: string;
    ram: string;
    ssd: string;
    hdd: string;
    keyboard: DeskComponentStatus;
    mouse: DeskComponentStatus;
    ups: DeskComponentStatus;
    message: string;
    lastUpdated: string;
  }

  // (removed unused getStatusColor)

  // Item categories for add item
  const itemCategories = [
    "desk",
    "chair",
    "multiplug",
    "switch",
    "router",
    "smartboard",
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === "desk") {
      setShowComputerDeskForm(true);
    } else {
      setShowSimpleForm(true);
    }
  };

  const handleDeskFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new desk item
    const newDeskItem = {
      id: deskItems.length + 1,
      deskNo: deskForm.deskNo,
      monitor: deskForm.monitor,
      cpu: deskForm.cpu,
      processor: deskForm.processor,
      ram: deskForm.ram,
      ssd: deskForm.ssd,
      hdd: deskForm.hdd,
      keyboard: deskForm.keyboard,
      mouse: deskForm.mouse,
      ups: deskForm.ups,
      message: deskForm.message,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // Add to desk items
    setDeskItems([...deskItems, newDeskItem]);

    // Add individual components to inventory items
    const newInventoryItems = [
      ...inventoryItems,
      {
        id: inventoryItems.length + 1,
        name: `Monitor ${deskForm.monitor.id}`,
        status:
          deskForm.monitor.status === "working" ? "In Use" : "Maintenance",
        location: deskForm.deskNo,
        lastChecked: new Date().toISOString().split("T")[0],
        type: "monitor",
      },
      {
        id: inventoryItems.length + 2,
        name: `CPU ${deskForm.cpu.id}`,
        status: deskForm.cpu.status === "working" ? "In Use" : "Maintenance",
        location: deskForm.deskNo,
        lastChecked: new Date().toISOString().split("T")[0],
        type: "cpu",
      },
      {
        id: inventoryItems.length + 3,
        name: `Keyboard ${deskForm.keyboard.id}`,
        status:
          deskForm.keyboard.status === "working" ? "In Use" : "Maintenance",
        location: deskForm.deskNo,
        lastChecked: new Date().toISOString().split("T")[0],
        type: "keyboard",
      },
    ];
    setInventoryItems(newInventoryItems);

    console.log("Desk form submitted:", newDeskItem);

    // Reset form and close modal
    setDeskForm({
      deskNo: "",
      monitor: { id: "", status: "working" },
      cpu: { id: "", status: "working" },
      processor: "",
      ram: "",
      ssd: "",
      hdd: "",
      keyboard: { id: "", status: "working" },
      mouse: { id: "", status: "working" },
      ups: { id: "", status: "working" },
      message: "",
    });
    setShowComputerDeskForm(false);
    setShowAddItem(false);
    setSelectedCategory(null);
  };

  const handleSimpleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new inventory item
    const newItem = {
      id: inventoryItems.length + 1,
      name: simpleForm.description,
      status: "Available",
      location: displayLab,
      lastChecked: simpleForm.lastUpdated,
      type: selectedCategory || "other",
    };

    // Add to inventory items
    setInventoryItems([...inventoryItems, newItem]);

    console.log("Simple form submitted:", {
      category: selectedCategory,
      ...simpleForm,
    });

    // Reset form
    setSimpleForm({
      quantity: "",
      description: "",
      lastUpdated: "",
    });
    // Close modal
    setShowSimpleForm(false);
    setSelectedCategory(null);
  };

  const handleDeskClick = (desk: Desk) => {
    setSelectedDesk(desk);
    setShowDeskDetails(true);
  };

  const handleEditDesk = () => {
    if (!selectedDesk) return;
    setEditDeskForm(selectedDesk);
    setShowEditDeskForm(true);
  };

  const handleEditDeskFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDeskForm) return;
    setDeskItems((prev) =>
      prev.map((desk) =>
        desk.id === editDeskForm.id ? { ...editDeskForm } : desk
      )
    );
    setSelectedDesk(editDeskForm);
    setShowEditDeskForm(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
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
          <span className="hidden" />
        </div>

        <h1 className="text-3xl font-bold text-neutral-100 mb-6">
          Computer-lab
        </h1>
      </div>

      {/* Computed lab stats */}
      {(() => {
        const total = deskItems.length;
        const good = deskItems.filter(
          (d) =>
            (d.monitor?.status ?? "working") === "working" &&
            (d.cpu?.status ?? "working") === "working" &&
            (d.keyboard?.status ?? "working") === "working" &&
            (d.mouse?.status ?? "working") === "working"
        ).length;
        const cpuIssue = deskItems.filter(
          (d) => (d.cpu?.status ?? "working") !== "working"
        ).length;
        const monitorIssue = deskItems.filter(
          (d) => (d.monitor?.status ?? "working") !== "working"
        ).length;

        function PCDeskIcon() {
          return (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="12" rx="2" />
              <path d="M8 20h8M12 16v4" />
            </svg>
          );
        }

        const getDeskStatus = (d: Desk) => {
          const monitorOk = (d.monitor?.status ?? "working") === "working";
          const cpuOk = (d.cpu?.status ?? "working") === "working";
          const keyboardOk = (d.keyboard?.status ?? "working") === "working";
          const mouseOk = (d.mouse?.status ?? "working") === "working";
          if (monitorOk && cpuOk && keyboardOk && mouseOk) return "good";
          if (!cpuOk) return "cpu";
          if (!monitorOk) return "monitor";
          if (!keyboardOk || !mouseOk) return "peripheral";
          return "unknown";
        };

        return (
          <>
            {/* Summary box */}
            <div className="mx-auto w-full max-w-md mb-8 rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 shadow-sm">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-neutral-100 font-medium">{good}</span>
                  <span className="text-neutral-400">desk are good</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-neutral-100 font-medium">
                    {cpuIssue}
                  </span>
                  <span className="text-neutral-400">have CPU issue</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-neutral-100 font-medium">
                    {monitorIssue}
                  </span>
                  <span className="text-neutral-400">have Monitor issue</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-neutral-400" />
                  <span className="text-neutral-100 font-medium">{total}</span>
                  <span className="text-neutral-400">total desks</span>
                </li>
              </ul>
            </div>

            {/* Desk grid */}
            <div className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-6">
              {(() => {
                const columns = 3;
                const rows = 7; // pairs per column
                const pairWidth = 2; // two desks side by side
                const totalSlots = columns * rows * pairWidth; // 42
                const slots = Array.from(
                  { length: totalSlots },
                  (_, i) => deskItems[i] ?? null
                );

                const makeDummy = (idx: number) =>
                  ({
                    id: -1000 - idx,
                    deskNo: `Dummy ${idx + 1}`,
                    monitor: { status: "Missing" },
                    cpu: { status: "Missing" },
                    keyboard: { status: "Missing" },
                    mouse: { status: "Missing" },
                    ups: { status: "Missing" },
                    processor: "",
                    ram: "",
                    ssd: "",
                    hdd: "",
                    message: "",
                    lastUpdated: "",
                  } as const);

                const renderTile = (
                  desk: Desk | null,
                  key: string,
                  slotIndex: number
                ) => {
                  const displayName = `Desk ${slotIndex + 1}`;
                  const isDummy = !desk || desk.id < 0;
                  const effectiveDesk: Desk = isDummy
                    ? {
                        id: -1000 - slotIndex,
                        deskNo: displayName,
                        monitor: { id: "", status: "Missing" },
                        cpu: { id: "", status: "Missing" },
                        keyboard: { id: "", status: "Missing" },
                        mouse: { id: "", status: "Missing" },
                        ups: { id: "", status: "Missing" },
                        processor: "",
                        ram: "",
                        ssd: "",
                        hdd: "",
                        message: "",
                        lastUpdated: "",
                      }
                    : { ...desk, deskNo: desk.deskNo || displayName };
                  const status = isDummy
                    ? "dummy"
                    : getDeskStatus(effectiveDesk);
                  const border =
                    status === "good"
                      ? "border-green-500/60"
                      : status === "cpu"
                      ? "border-amber-400/70"
                      : status === "monitor"
                      ? "border-red-500/70"
                      : status === "dummy"
                      ? "border-neutral-800/60 border-dashed"
                      : "border-neutral-800/60";
                  const hoverBg = isDummy ? "" : "hover:bg-neutral-800/40";
                  const content = (
                    <div
                      className={`group relative h-16 w-16 rounded-md border ${border} bg-neutral-900/20 ${hoverBg} flex items-center justify-center transition-colors`}
                      title={effectiveDesk.deskNo}
                    >
                      <PCDeskIcon />
                      {!isDummy && status !== "good" ? (
                        <span
                          className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                            status === "cpu"
                              ? "bg-amber-400"
                              : status === "monitor"
                              ? "bg-red-500"
                              : "bg-neutral-400"
                          } border border-neutral-900`}
                        />
                      ) : null}
                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-neutral-400">
                        {effectiveDesk.deskNo}
                      </span>
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:flex">
                        <div className="rounded-md border border-neutral-800 bg-neutral-900/90 backdrop-blur px-3 py-2 text-[11px] text-neutral-200 shadow-lg min-w-[160px]">
                          <div className="font-medium text-neutral-100 mb-1">
                            {effectiveDesk.deskNo}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Monitor</span>
                              <span className="text-neutral-100">
                                {effectiveDesk.monitor?.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">CPU</span>
                              <span className="text-neutral-100">
                                {effectiveDesk.cpu?.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Keyboard</span>
                              <span className="text-neutral-100">
                                {effectiveDesk.keyboard?.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Mouse</span>
                              <span className="text-neutral-100">
                                {effectiveDesk.mouse?.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  return (
                    <button
                      key={key}
                      onClick={() => handleDeskClick(effectiveDesk)}
                      aria-label={`Open ${effectiveDesk.deskNo}`}
                    >
                      {content}
                    </button>
                  );
                };

                return (
                  <div className="flex justify-around gap-10">
                    {Array.from({ length: columns }, (_, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-8">
                        {Array.from({ length: rows }, (_, rowIdx) => {
                          const base =
                            colIdx * rows * pairWidth + rowIdx * pairWidth;
                          const a = slots[base] ?? makeDummy(base);
                          const b = slots[base + 1] ?? makeDummy(base + 1);
                          return (
                            <div
                              key={`${colIdx}-${rowIdx}`}
                              className="flex gap-6"
                            >
                              {renderTile(a, `${base}`, base)}
                              {renderTile(b, `${base + 1}`, base + 1)}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </>
        );
      })()}

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-100">
                Select Category
              </h3>
              <button
                onClick={() => setShowAddItem(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {itemCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left p-3 rounded-lg border border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50 text-neutral-300 hover:text-neutral-100 transition-colors flex items-center gap-3"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-neutral-400"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Computer Desk Form Modal */}
      {showComputerDeskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-neutral-100">
                Computer Desk Form
              </h3>
              <button
                onClick={() => setShowComputerDeskForm(false)}
                className="text-neutral-400 hover:text-neutral-200 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleDeskFormSubmit} className="space-y-6">
              {/* Desk No */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Desk No
                </label>
                <input
                  type="text"
                  value={deskForm.deskNo}
                  onChange={(e) =>
                    setDeskForm({ ...deskForm, deskNo: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  placeholder="Enter desk number"
                />
              </div>

              {/* Monitor */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Monitor
                </label>
                <input
                  type="text"
                  value={deskForm.monitor.id}
                  onChange={(e) =>
                    setDeskForm({
                      ...deskForm,
                      monitor: { ...deskForm.monitor, id: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600 mb-2"
                  placeholder="Monitor ID/Model"
                />
                <div className="flex gap-4">
                  {["working", "Not working", "Missing"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 text-neutral-300"
                    >
                      <input
                        type="radio"
                        name="monitor-status"
                        value={status}
                        checked={deskForm.monitor.status === status}
                        onChange={(e) =>
                          setDeskForm({
                            ...deskForm,
                            monitor: {
                              ...deskForm.monitor,
                              status: e.target.value,
                            },
                          })
                        }
                        className="text-blue-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              {/* CPU */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  CPU
                </label>
                <div className="flex gap-4">
                  {["working", "Not working", "Missing"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 text-neutral-300"
                    >
                      <input
                        type="radio"
                        name="cpu-status"
                        value={status}
                        checked={deskForm.cpu.status === status}
                        onChange={(e) =>
                          setDeskForm({
                            ...deskForm,
                            cpu: {
                              id: deskForm.cpu.id,
                              status: e.target.value,
                            },
                          })
                        }
                        className="text-blue-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              {/* Component Specifications */}
              <div className="border border-neutral-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-300 mb-4">
                  Component Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Processor
                    </label>
                    <input
                      type="text"
                      value={deskForm.processor}
                      onChange={(e) =>
                        setDeskForm({ ...deskForm, processor: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., Intel i5-12400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      RAM
                    </label>
                    <input
                      type="text"
                      value={deskForm.ram}
                      onChange={(e) =>
                        setDeskForm({ ...deskForm, ram: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., 16GB DDR4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      SSD
                    </label>
                    <input
                      type="text"
                      value={deskForm.ssd}
                      onChange={(e) =>
                        setDeskForm({ ...deskForm, ssd: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., 512GB NVMe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      HDD
                    </label>
                    <input
                      type="text"
                      value={deskForm.hdd}
                      onChange={(e) =>
                        setDeskForm({ ...deskForm, hdd: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., 1TB SATA"
                    />
                  </div>
                </div>
              </div>

              {/* Peripherals */}
              <div className="space-y-4">
                {/* Keyboard */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Keyboard
                  </label>
                  <div className="flex gap-4">
                    {["working", "Not working", "Missing"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-neutral-300"
                      >
                        <input
                          type="radio"
                          name="keyboard-status"
                          value={status}
                          checked={deskForm.keyboard.status === status}
                          onChange={(e) =>
                            setDeskForm({
                              ...deskForm,
                              keyboard: {
                                id: deskForm.keyboard.id,
                                status: e.target.value,
                              },
                            })
                          }
                          className="text-blue-500"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mouse */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Mouse
                  </label>
                  <div className="flex gap-4">
                    {["working", "Not working", "Missing"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-neutral-300"
                      >
                        <input
                          type="radio"
                          name="mouse-status"
                          value={status}
                          checked={deskForm.mouse.status === status}
                          onChange={(e) =>
                            setDeskForm({
                              ...deskForm,
                              mouse: {
                                id: deskForm.mouse.id,
                                status: e.target.value,
                              },
                            })
                          }
                          className="text-blue-500"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                {/* UPS */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    UPS
                  </label>
                  <div className="flex gap-4">
                    {["working", "Not working", "Missing"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-neutral-300"
                      >
                        <input
                          type="radio"
                          name="ups-status"
                          value={status}
                          checked={deskForm.ups.status === status}
                          onChange={(e) =>
                            setDeskForm({
                              ...deskForm,
                              ups: {
                                id: deskForm.ups.id,
                                status: e.target.value,
                              },
                            })
                          }
                          className="text-blue-500"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Last Checked */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Last Checked
                </label>
                <div className="text-neutral-400">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  value={deskForm.message}
                  onChange={(e) =>
                    setDeskForm({ ...deskForm, message: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  placeholder="Additional notes or comments"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Simple Form Modal */}
      {showSimpleForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-neutral-100">
                Add {selectedCategory?.charAt(0).toUpperCase()}
                {selectedCategory?.slice(1)}
              </h3>
              <button
                onClick={() => {
                  setShowSimpleForm(false);
                  setSelectedCategory(null);
                }}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSimpleFormSubmit} className="space-y-4">
              {/* Quantity Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={simpleForm.quantity}
                  onChange={(e) =>
                    setSimpleForm({ ...simpleForm, quantity: e.target.value })
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  placeholder="Enter quantity"
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={simpleForm.description}
                  onChange={(e) =>
                    setSimpleForm({
                      ...simpleForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  placeholder="Enter description"
                  required
                />
              </div>

              {/* Last Updated Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Last Updated
                </label>
                <input
                  type="date"
                  value={simpleForm.lastUpdated}
                  onChange={(e) =>
                    setSimpleForm({
                      ...simpleForm,
                      lastUpdated: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Desk Details Modal */}
      {showDeskDetails && selectedDesk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-neutral-100">
                {selectedDesk.deskNo} - Detailed Information
              </h3>
              <button
                onClick={() => {
                  setShowDeskDetails(false);
                  setSelectedDesk(null);
                }}
                className="text-neutral-400 hover:text-neutral-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4">
                <h4 className="text-lg font-semibold text-neutral-100 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-400">Desk Number:</span>
                    <p className="text-neutral-200 font-medium">
                      {selectedDesk.deskNo}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Last Updated:</span>
                    <p className="text-neutral-200 font-medium">
                      {selectedDesk.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hardware Components */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4">
                <h4 className="text-lg font-semibold text-neutral-100 mb-3">
                  Hardware Components
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Monitor:</span>
                      <div className="text-right">
                        <p className="text-neutral-200 font-medium">
                          {selectedDesk.monitor.id}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            selectedDesk.monitor.status === "working"
                              ? "text-green-400 bg-green-400/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {selectedDesk.monitor.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">CPU:</span>
                      <div className="text-right">
                        <p className="text-neutral-200 font-medium">
                          {selectedDesk.cpu.id}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            selectedDesk.cpu.status === "working"
                              ? "text-green-400 bg-green-400/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {selectedDesk.cpu.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Keyboard:</span>
                      <div className="text-right">
                        <p className="text-neutral-200 font-medium">
                          {selectedDesk.keyboard.id}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            selectedDesk.keyboard.status === "working"
                              ? "text-green-400 bg-green-400/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {selectedDesk.keyboard.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Mouse:</span>
                      <div className="text-right">
                        <p className="text-neutral-200 font-medium">
                          {selectedDesk.mouse.id}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            selectedDesk.mouse.status === "working"
                              ? "text-green-400 bg-green-400/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {selectedDesk.mouse.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">UPS:</span>
                      <div className="text-right">
                        <p className="text-neutral-200 font-medium">
                          {selectedDesk.ups.id}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            selectedDesk.ups.status === "working"
                              ? "text-green-400 bg-green-400/10"
                              : "text-red-400 bg-red-400/10"
                          }`}
                        >
                          {selectedDesk.ups.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Specifications */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4">
                <h4 className="text-lg font-semibold text-neutral-100 mb-3">
                  System Specifications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-neutral-400">Processor:</span>
                      <p className="text-neutral-200 font-medium">
                        {selectedDesk.processor}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-400">RAM:</span>
                      <p className="text-neutral-200 font-medium">
                        {selectedDesk.ram}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-neutral-400">SSD:</span>
                      <p className="text-neutral-200 font-medium">
                        {selectedDesk.ssd}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-400">HDD:</span>
                      <p className="text-neutral-200 font-medium">
                        {selectedDesk.hdd}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedDesk.message && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4">
                  <h4 className="text-lg font-semibold text-neutral-100 mb-3">
                    Notes
                  </h4>
                  <p className="text-neutral-300 text-sm">
                    {selectedDesk.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleEditDesk}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Desk Form Modal */}
      {showEditDeskForm && editDeskForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-neutral-100">
                Edit Desk Information
              </h3>
              <button
                onClick={() => setShowEditDeskForm(false)}
                className="text-neutral-400 hover:text-neutral-200 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditDeskFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Desk No
                </label>
                <input
                  type="text"
                  value={editDeskForm.deskNo}
                  onChange={(e) =>
                    setEditDeskForm((prev) =>
                      prev ? { ...prev, deskNo: e.target.value } : prev
                    )
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  placeholder="Enter desk number"
                />
              </div>

              {/* Monitor */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Monitor
                </label>
                <input
                  type="text"
                  value={editDeskForm.monitor.id}
                  onChange={(e) =>
                    setEditDeskForm((prev) =>
                      prev
                        ? {
                            ...prev,
                            monitor: { ...prev.monitor, id: e.target.value },
                          }
                        : prev
                    )
                  }
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600 mb-2"
                  placeholder="Monitor ID/Model"
                />
                <div className="flex gap-4">
                  {["working", "Not working", "Missing"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 text-neutral-300"
                    >
                      <input
                        type="radio"
                        name="monitor-status"
                        value={status}
                        checked={editDeskForm.monitor.status === status}
                        onChange={(e) =>
                          setEditDeskForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  monitor: {
                                    ...prev.monitor,
                                    status: e.target.value,
                                  },
                                }
                              : prev
                          )
                        }
                        className="text-blue-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              {/* CPU */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  CPU
                </label>
                <div className="flex gap-4">
                  {["working", "Not working", "Missing"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-2 text-neutral-300"
                    >
                      <input
                        type="radio"
                        name="cpu-status"
                        value={status}
                        checked={editDeskForm.cpu.status === status}
                        onChange={(e) =>
                          setEditDeskForm((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cpu: {
                                    id: prev.cpu.id,
                                    status: e.target.value,
                                  },
                                }
                              : prev
                          )
                        }
                        className="text-blue-500"
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              {/* Component Specifications */}
              <div className="border border-neutral-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-300 mb-4">
                  Component Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Processor
                    </label>
                    <input
                      type="text"
                      value={editDeskForm.processor}
                      onChange={(e) =>
                        setEditDeskForm((prev) =>
                          prev ? { ...prev, processor: e.target.value } : prev
                        )
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., Intel i5-12400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      RAM
                    </label>
                    <input
                      type="text"
                      value={editDeskForm.ram}
                      onChange={(e) =>
                        setEditDeskForm((prev) =>
                          prev ? { ...prev, ram: e.target.value } : prev
                        )
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., 16GB DDR4"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      SSD
                    </label>
                    <input
                      type="text"
                      value={editDeskForm.ssd}
                      onChange={(e) =>
                        setEditDeskForm((prev) =>
                          prev ? { ...prev, ssd: e.target.value } : prev
                        )
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., 512GB NVMe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      HDD
                    </label>
                    <input
                      type="text"
                      value={editDeskForm.hdd}
                      onChange={(e) =>
                        setEditDeskForm((prev) =>
                          prev ? { ...prev, hdd: e.target.value } : prev
                        )
                      }
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                      placeholder="e.g., 1TB SATA"
                    />
                  </div>
                </div>
              </div>

              {/* Peripherals */}
              <div className="space-y-4">
                {/* Keyboard */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Keyboard
                  </label>
                  <div className="flex gap-4">
                    {["working", "Not working", "Missing"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-neutral-300"
                      >
                        <input
                          type="radio"
                          name="keyboard-status"
                          value={status}
                          checked={editDeskForm.keyboard.status === status}
                          onChange={(e) =>
                            setEditDeskForm((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    keyboard: {
                                      id: prev.keyboard.id,
                                      status: e.target.value,
                                    },
                                  }
                                : prev
                            )
                          }
                          className="text-blue-500"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mouse */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Mouse
                  </label>
                  <div className="flex gap-4">
                    {["working", "Not working", "Missing"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-neutral-300"
                      >
                        <input
                          type="radio"
                          name="mouse-status"
                          value={status}
                          checked={editDeskForm.mouse.status === status}
                          onChange={(e) =>
                            setEditDeskForm((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    mouse: {
                                      id: prev.mouse.id,
                                      status: e.target.value,
                                    },
                                  }
                                : prev
                            )
                          }
                          className="text-blue-500"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                {/* UPS */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    UPS
                  </label>
                  <div className="flex gap-4">
                    {["working", "Not working", "Missing"].map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 text-neutral-300"
                      >
                        <input
                          type="radio"
                          name="ups-status"
                          value={status}
                          checked={editDeskForm.ups.status === status}
                          onChange={(e) =>
                            setEditDeskForm((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    ups: {
                                      id: prev.ups.id,
                                      status: e.target.value,
                                    },
                                  }
                                : prev
                            )
                          }
                          className="text-blue-500"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Last Checked */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Last Checked
                </label>
                <div className="text-neutral-400">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  value={editDeskForm.message}
                  onChange={(e) =>
                    setEditDeskForm((prev) =>
                      prev ? { ...prev, message: e.target.value } : prev
                    )
                  }
                  rows={3}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-800/50 px-3 py-2 text-neutral-200 focus:outline-none focus:border-neutral-600"
                  placeholder="Additional notes or comments"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
