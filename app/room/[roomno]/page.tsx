"use client";

import { useParams } from "next/navigation";
import BackButton from "../../../components/backButton";
import LoadingSpinner from "../../../components/loadingSpinner";
import DeskInfo from "../../../ui/deskInfo";
import { Desk } from "../../../types/desk";
import {
  Printer,
  Almari,
  Bookshelf,
  BaseRoomItem,
} from "../../../types/roomItems";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HashLoader } from "react-spinners";

import {
  FiPrinter,
  FiBox,
  FiBook,
  FiArchive,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import { HiComputerDesktop } from "react-icons/hi2";

export default function Room() {
  const params = useParams();
  const [roomId, setRoomId] = useState<number | undefined>(undefined);
  const [desks, setDesks] = useState<Desk[]>([]);
  const [almaris, setAlmaris] = useState<Almari[]>([]);
  const [bookshelf, setBookshelf] = useState<Bookshelf[]>([]);
  const [printer, setPrinter] = useState<Printer[]>([]);
  const [loading, setloading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [selectedRoomItem, setSelectedRoomItem] = useState<null | {
    type: "printer" | "almari" | "bookshelf";
    item: Printer | Almari | Bookshelf | null;
  }>(null);
  const [roomItemPickerOpen, setRoomItemPickerOpen] = useState(false);
  const [roomItemLoading, setRoomItemLoading] = useState(false);
  const [roomUnassigned, setRoomUnassigned] = useState<BaseRoomItem[]>([]);
  const [headerAssign, setHeaderAssign] = useState(false);
  const [assigningRoomItemId, setAssigningRoomItemId] = useState<number | null>(
    null
  );

  useEffect(() => {
    async function fetchRoom() {
      setloading(true);

      try {
        const res = await fetch(`/api/getRoom?name=${params.roomno}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.log("Error in fetching room items");
        }

        const data = await res.json();

        const nextDesks: Desk[] = data.room.desks ?? [];
        setDesks(nextDesks);
        setAlmaris(data.room.almari);
        setPrinter(data.room.printers);
        setBookshelf(data.room.bookshelf);
        // Keep the open DeskInfo modal in sync with latest data
        if (selectedDesk) {
          const refreshed = nextDesks.find((d) => d.id === selectedDesk.id);
          if (refreshed) setSelectedDesk(refreshed);
        }
        // Keep the open RoomItem modal in sync as well
        if (selectedRoomItem && selectedRoomItem.item) {
          if (selectedRoomItem.type === "printer") {
            const refreshed = ((data.room.printers as Printer[]) ?? []).find(
              (x: Printer) => x.id === selectedRoomItem.item!.id
            );
            if (refreshed)
              setSelectedRoomItem({ type: "printer", item: refreshed });
          } else if (selectedRoomItem.type === "almari") {
            const refreshed = ((data.room.almari as Almari[]) ?? []).find(
              (x: Almari) => x.id === selectedRoomItem.item!.id
            );
            if (refreshed)
              setSelectedRoomItem({ type: "almari", item: refreshed });
          } else if (selectedRoomItem.type === "bookshelf") {
            const refreshed = ((data.room.bookshelf as Bookshelf[]) ?? []).find(
              (x: Bookshelf) => x.id === selectedRoomItem.item!.id
            );
            if (refreshed)
              setSelectedRoomItem({ type: "bookshelf", item: refreshed });
          }
        }
        setRoomId(data.room.id);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    }

    fetchRoom();
  }, [refetch]);

  const suggestions = ["desk", "printer", "bookshelf", "almari"];

  const iconMap: Record<
    string,
    React.ComponentType<{ size?: number; className?: string }>
  > = {
    printer: FiPrinter,
    ups: FiBox,
    Bookshelf: FiBook,
    Almari: FiArchive,
    desk: HiComputerDesktop,
  };

  async function addItem(label: "desk") {
    if (!roomId) {
      toast.error("Room is not ready yet. Please wait and try again.");
      return;
    }
    const value = label;
    const res = await fetch("/api/secure/assignItemInRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: value, roomId }),
    });

    if (res.status === 401) {
      if (typeof window !== "undefined") window.location.href = "/signin";
      return;
    }

    if (res.ok) {
      toast.success("Added");
      setRefetch(!refetch);
    } else {
      toast.error("Failed");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <HashLoader size={60} color="currentColor" />
      </div>
    );
  }

  return (
    <main className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Toaster />
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold mb-6">{`${params.roomno}`}</h1>
      </div>

      <div className="w-full flex justify-center">
        <section className="w-full max-w-4xl">
          <div className="rounded-xl border border-[color:var(--border)] p-4 sm:p-6 card-surface">
            <div className="flex items-center justify-between mb-3 border-b border-[color:var(--border)] pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Desks</h3>
                <span className="px-2 py-0.5 text-xs rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)]">
                  {desks.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {desks.length > 0
                ? desks.map((desk) => {
                    const label = "PC";
                    const assigned = Boolean(
                      desk.cpuId || desk.monitorId || desk.upsId
                    );
                    const Icon = iconMap["desk"] ?? FiBox;
                    return (
                      <div
                        key={desk.id}
                        className={`relative rounded-lg border border-[color:var(--border)] aspect-square flex items-center justify-center cursor-pointer shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] ${
                          assigned
                            ? "bg-[color:var(--surface-muted)] hover:bg-[color:var(--surface)]"
                            : "bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)]"
                        }`}
                        onClick={() => setSelectedDesk(desk)}
                      >
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              const res = await fetch(
                                `/api/secure/deleteDesk?id=${desk.id}`,
                                { method: "DELETE" }
                              );

                              if (res.status === 401) {
                                if (typeof window !== "undefined")
                                  window.location.href = "/signin";
                                return;
                              }

                              if (!res.ok) {
                                toast.error("Failed to remove desk");
                              } else {
                                toast.success("Desk removed");
                                setRefetch((p) => !p);
                              }
                            } catch (err) {
                              toast.error("Failed to remove desk");
                            }
                          }}
                          className="absolute top-2 right-2 p-1 rounded border border-[color:var(--border)] hover:bg-[color:var(--surface-muted)] cursor-pointer"
                          aria-label="Remove desk"
                          title="Remove desk"
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <div className="flex flex-col items-center gap-2 text-center px-2">
                          <div className="rounded-full p-2 bg-[color:var(--surface)]/60">
                            <Icon
                              size={28}
                              className={assigned ? "opacity-90" : "opacity-60"}
                            />
                          </div>
                          <div className="text-sm sm:text-base font-medium">
                            {label}
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
              <div
                className="relative rounded-lg border border-[color:var(--border)] border-dashed aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] hover:border-primary/50"
                onClick={() => addItem("desk")}
                title="Add desk"
                aria-label="Add desk"
              >
                <div className="flex flex-col items-center gap-2 text-center px-2">
                  <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                    <FiPlus size={28} className="opacity-80" />
                  </div>
                  <div className="text-sm sm:text-base font-medium">
                    Add New
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 border-b border-[color:var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">Printers</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)]">
                    {printer.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {printer.length > 0
                  ? printer.map((p: Printer) => {
                      const label = p?.name || `Printer ${p?.id}`;
                      const Icon = iconMap["printer"] ?? FiPrinter;
                      return (
                        <div
                          key={p?.id}
                          className="relative rounded-lg border border-[color:var(--border)] aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
                          onClick={() =>
                            setSelectedRoomItem({ type: "printer", item: p })
                          }
                        >
                          <div className="flex flex-col items-center gap-2 text-center px-2">
                            <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                              <Icon size={28} className="opacity-80" />
                            </div>
                            <div className="text-sm sm:text-base font-medium">
                              {label}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div
                  className="relative rounded-lg border border-[color:var(--border)] border-dashed aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] hover:border-primary/50"
                  onClick={async () => {
                    setSelectedRoomItem({ type: "printer", item: null });
                    setHeaderAssign(true);
                    setRoomItemPickerOpen(false);
                    setRoomItemLoading(true);
                    try {
                      const res = await fetch(
                        `/api/secure/getUnassignedItems?item=printer`
                      );

                      if (res.status === 401) {
                        if (typeof window !== "undefined")
                          window.location.href = "/signin";
                        return;
                      }

                      const items = await res.json();
                      setRoomUnassigned(items);
                      setRoomItemPickerOpen(true);
                    } finally {
                      setRoomItemLoading(false);
                    }
                  }}
                  title="Assign printer"
                  aria-label="Assign printer"
                >
                  <div className="flex flex-col items-center gap-2 text-center px-2">
                    <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                      {roomItemLoading &&
                      selectedRoomItem?.type === "printer" ? (
                        <LoadingSpinner />
                      ) : (
                        <FiPlus size={28} className="opacity-80" />
                      )}
                    </div>
                    <div className="text-sm sm:text-base font-medium">
                      Add New
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 border-b border-[color:var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">Almirah</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)]">
                    {almaris.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {almaris.length > 0
                  ? almaris.map((a: Almari) => {
                      const label = a?.name || `Almari ${a?.id}`;
                      const Icon = iconMap["Almari"] ?? FiArchive;
                      return (
                        <div
                          key={a?.id}
                          className="relative rounded-lg border border-[color:var(--border)] aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
                          onClick={() =>
                            setSelectedRoomItem({ type: "almari", item: a })
                          }
                        >
                          <div className="flex flex-col items-center gap-2 text-center px-2">
                            <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                              <Icon size={28} className="opacity-80" />
                            </div>
                            <div className="text-sm sm:text-base font-medium">
                              {label}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div
                  className="relative rounded-lg border border-[color:var(--border)] border-dashed aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] hover:border-primary/50"
                  onClick={async () => {
                    setSelectedRoomItem({ type: "almari", item: null });
                    setHeaderAssign(true);
                    setRoomItemPickerOpen(false);
                    setRoomItemLoading(true);
                    try {
                      const res = await fetch(
                        `/api/secure/getUnassignedItems?item=almari`
                      );

                      if (res.status === 401) {
                        if (typeof window !== "undefined")
                          window.location.href = "/signin";
                        return;
                      }

                      const items = await res.json();
                      setRoomUnassigned(items);
                      setRoomItemPickerOpen(true);
                    } finally {
                      setRoomItemLoading(false);
                    }
                  }}
                  title="Assign almari"
                  aria-label="Assign almari"
                >
                  <div className="flex flex-col items-center gap-2 text-center px-2">
                    <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                      {roomItemLoading &&
                      selectedRoomItem?.type === "almari" ? (
                        <LoadingSpinner />
                      ) : (
                        <FiPlus size={28} className="opacity-80" />
                      )}
                    </div>
                    <div className="text-sm sm:text-base font-medium">
                      Add New
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 border-b border-[color:var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">Bookshelf</h3>
                  <span className="px-2 py-0.5 text-xs rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)]">
                    {bookshelf.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {bookshelf.length > 0
                  ? bookshelf.map((b: Bookshelf) => {
                      const label = b?.name || `Bookshelf ${b?.id}`;
                      const Icon = iconMap["Bookshelf"] ?? FiBook;
                      return (
                        <div
                          key={b?.id}
                          className="relative rounded-lg border border-[color:var(--border)] aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
                          onClick={() =>
                            setSelectedRoomItem({ type: "bookshelf", item: b })
                          }
                        >
                          <div className="flex flex-col items-center gap-2 text-center px-2">
                            <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                              <Icon size={28} className="opacity-80" />
                            </div>
                            <div className="text-sm sm:text-base font-medium">
                              {label}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div
                  className="relative rounded-lg border border-[color:var(--border)] border-dashed aspect-square flex items-center justify-center cursor-pointer bg-[color:var(--surface)] hover:bg-[color:var(--surface-muted)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] hover:border-primary/50"
                  onClick={async () => {
                    setSelectedRoomItem({ type: "bookshelf", item: null });
                    setHeaderAssign(true);
                    setRoomItemPickerOpen(false);
                    setRoomItemLoading(true);
                    try {
                      const res = await fetch(
                        `/api/secure/getUnassignedItems?item=bookshelf`
                      );

                      if (res.status === 401) {
                        if (typeof window !== "undefined")
                          window.location.href = "/signin";
                        return;
                      }

                      const items = await res.json();
                      setRoomUnassigned(items);
                      setRoomItemPickerOpen(true);
                    } finally {
                      setRoomItemLoading(false);
                    }
                  }}
                  title="Assign bookshelf"
                  aria-label="Assign bookshelf"
                >
                  <div className="flex flex-col items-center gap-2 text-center px-2">
                    <div className="rounded-full p-2 bg-[color:var(--surface-muted)]">
                      {roomItemLoading &&
                      selectedRoomItem?.type === "bookshelf" ? (
                        <LoadingSpinner />
                      ) : (
                        <FiPlus size={28} className="opacity-80" />
                      )}
                    </div>
                    <div className="text-sm sm:text-base font-medium">
                      Add New
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {selectedDesk && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedDesk(null)}
        >
          <div
            className="card-surface w-full max-w-2xl rounded-xl border border-[color:var(--border)] p-5 relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold">PC Details</h3>
              <button
                className="p-1 rounded hover:bg-[color:var(--surface-muted)] cursor-pointer"
                onClick={() => setSelectedDesk(null)}
              >
                ×
              </button>
            </div>
            <DeskInfo
              desk={selectedDesk}
              handleCloseModal={() => setSelectedDesk(null)}
              onAssignOrWithdraw={setRefetch}
            />
          </div>
        </div>
      )}
      {selectedRoomItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setSelectedRoomItem(null);
            setRoomItemPickerOpen(false);
            setRoomUnassigned([]);
            setHeaderAssign(false);
          }}
        >
          <div
            className="card-surface w-full max-w-2xl rounded-xl border border-[color:var(--border)] p-5 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold capitalize">
                {headerAssign
                  ? `Select ${selectedRoomItem.type}`
                  : `${selectedRoomItem.type} details`}
              </h3>
              <button
                onClick={() => {
                  setSelectedRoomItem(null);
                  setRoomItemPickerOpen(false);
                  setRoomUnassigned([]);
                  setHeaderAssign(false);
                }}
                className="p-1 rounded hover:bg-[color:var(--surface-muted)] cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              {!headerAssign && selectedRoomItem.item && (
                <>
                  <div className="text-sm">
                    Name:{" "}
                    {selectedRoomItem.item.name || `${selectedRoomItem.type}`}
                  </div>
                  <div className="text-sm flex items-center gap-2">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold text-white ${
                        selectedRoomItem.item.status === "working"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {selectedRoomItem.item.status || "unknown"}
                    </span>
                  </div>
                  {selectedRoomItem.type === "printer" && (
                    <div className="text-sm flex items-center gap-2">
                      <span className="text-gray-500">Brand:</span>
                      <span>
                        {(selectedRoomItem.item as Printer).brand || "—"}
                      </span>
                    </div>
                  )}
                  {selectedRoomItem.item.Note ? (
                    <div className="text-sm flex items-center gap-2">
                      <span className="text-gray-500">Note:</span>
                      <span>{selectedRoomItem.item.note}</span>
                    </div>
                  ) : null}

                  <div className="flex gap-2 pt-2">
                    {selectedRoomItem.item.roomId ? (
                      <button
                        onClick={async () => {
                          setRoomItemLoading(true);
                          const res = await fetch(
                            `/api/secure/withdrawRoomItem?item=${
                              selectedRoomItem.type
                            }&id=${selectedRoomItem.item!.id}`
                          );

                          if (res.status === 401) {
                            if (typeof window !== "undefined")
                              window.location.href = "/signin";
                            return;
                          }

                          setRoomItemLoading(false);
                          setSelectedRoomItem(null);
                          setRefetch((p) => !p);
                        }}
                        disabled={roomItemLoading}
                        className="px-4 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-neutral-900 bg-[var(--btn-bg)] focus:outline-none focus:ring-2 focus:ring-red-400 border border-neutral-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {roomItemLoading ? <LoadingSpinner /> : "Withdraw"}
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          try {
                            setRoomItemLoading(true);
                            const res = await fetch(
                              `/api/secure/getUnassignedItems?item=${selectedRoomItem.type}`
                            );

                            if (res.status === 401) {
                              if (typeof window !== "undefined")
                                window.location.href = "/signin";
                              return;
                            }

                            const items = await res.json();
                            setRoomUnassigned(items);
                            setRoomItemPickerOpen(true);
                          } finally {
                            setRoomItemLoading(false);
                          }
                        }}
                        disabled={roomItemLoading}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--btn-bg)] text-[var(--btn-text)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {roomItemLoading ? <LoadingSpinner /> : "Assign"}
                      </button>
                    )}
                  </div>
                </>
              )}
              {roomItemPickerOpen && (
                <div className="mt-4 border-t border-[color:var(--border)] pt-3">
                  <div className="text-sm mb-2">
                    Select {selectedRoomItem.type} to assign
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-auto">
                    {roomUnassigned.length > 0 ? (
                      roomUnassigned.map((u) => (
                        <button
                          key={u.id}
                          onClick={async () => {
                            setAssigningRoomItemId(u.id);
                            setRoomItemLoading(true);
                            const res = await fetch(
                              `/api/secure/assignRoomItem?item=${selectedRoomItem.type}&id=${u.id}&roomId=${roomId}`
                            );

                            if (res.status === 401) {
                              if (typeof window !== "undefined")
                                window.location.href = "/signin";
                              return;
                            }

                            setRoomItemLoading(false);
                            setRoomItemPickerOpen(false);
                            setHeaderAssign(false);
                            setSelectedRoomItem(null);
                            setAssigningRoomItemId(null);
                            setRefetch((p) => !p);
                          }}
                          className="w-full text-left px-3 py-2 rounded hover:bg-[color:var(--surface-muted)] cursor-pointer"
                          disabled={roomItemLoading}
                        >
                          {assigningRoomItemId === u.id && roomItemLoading ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner />
                              <span>Assigning...</span>
                            </div>
                          ) : (
                            u.name || `${selectedRoomItem.type} ${u.id}`
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        No unassigned {selectedRoomItem.type}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
