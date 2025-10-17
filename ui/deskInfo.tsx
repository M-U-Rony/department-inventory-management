"use client";

import { useState } from "react";
import { Desk } from "../types/desk";
import { IoMdClose } from "react-icons/io";
import LoadingSpinner from "../components/loadingSpinner";

interface DeskInfoProps {
  desk?: Desk;
  handleCloseModal: () => void;
  onChanged?: () => void;
}

interface Item {
  id: number;
  name: string;
}

export default function DeskInfo({ desk, handleCloseModal, onChanged }: DeskInfoProps) {
  const [unassignedItems, setUnassignedItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItemType, setCurrentItemType] = useState("");
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState("");
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [optimisticWithdraw, setOptimisticWithdraw] = useState<"monitor" | "cpu" | "">("");
  const [withdrawErrorItem, setWithdrawErrorItem] = useState<"" | "monitor" | "cpu">("");
  const [withdrawErrorMessage, setWithdrawErrorMessage] = useState<string>("");

  // console.log("Desk info:", desk);

  const handleAssign = async (item: string) => {
    try {
      setLoading(true);
      setCurrentItemType(item);
      const data = await fetch(`/api/getUnassignedItems?item=${item}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const items = await data.json();
      setUnassignedItems(items);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching unassigned items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemWithdraw = async (itemId: number, item: string) => {
    try {
      setWithdrawErrorItem("");
      setWithdrawErrorMessage("");
      setWithdrawLoading(item);
      if (item === "monitor" || item === "cpu") setOptimisticWithdraw(item as "monitor" | "cpu");
      const response = await fetch(
        `/api/withdrawItem?item=${item}&id=${itemId}&deskId=${desk?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to withdraw item");
      }
      console.log(`Withdraw ${itemId} to desk ${desk?.id}`);
      handleCloseModal();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      onChanged?.();
    } catch (error) {
      console.error("Error withdrawing item:", error);
      setOptimisticWithdraw("");
      setWithdrawErrorItem((item === "monitor" || item === "cpu") ? (item as "monitor" | "cpu") : "");
      setWithdrawErrorMessage("Failed to withdraw item. Please try again.");
    } finally {
      setWithdrawLoading("");
      setOptimisticWithdraw("");
    }
  };

  const handleItemAssignment = async (itemId: number) => {
    try {
      setAssigningId(itemId);
      const response = await fetch(
        `/api/assignItem?item=${currentItemType}&id=${itemId}&deskId=${desk?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign item");
      }
      console.log(`Assigning ${itemId} to desk ${desk?.id}`);
      setShowModal(false);
      handleCloseModal();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      onChanged?.();
    } catch (error) {
      console.error("Error assigning item:", error);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="text-primary">
      {/* Modal for Unassigned Items */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card-surface w-full max-w-lg md:max-w-xl rounded-xl shadow-lg border border-base-300 p-5 md:p-6">
            <div className="relative flex items-center justify-between mb-3 md:mb-4">
              <h3 className="absolute left-1/2 -translate-x-1/2 text-base md:text-lg font-semibold text-primary text-center p-4 my-2 md:my-3">
                Available items
              </h3>
              <button
                aria-label="Close"
                onClick={() => setShowModal(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                <IoMdClose size={20} />
              </button>
              {withdrawErrorItem === "monitor" && withdrawErrorMessage ? (
              <p className="mt-2 text-sm text-red-500">{withdrawErrorMessage}</p>
            ) : null}
          </div>
            <div className="mt-3 md:mt-4 max-h-[60vh] overflow-y-auto">
              {unassignedItems.length > 0 ? (
                <div className="flex flex-col">
                  {unassignedItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemAssignment(item.id)}
                      disabled={assigningId !== null || Boolean(withdrawLoading)}
                      aria-busy={assigningId === item.id}
                      className="text-left w-full px-3 py-2 rounded-md hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 muted-surface"
                    >
                      {assigningId === item.id ? (
                        <div className="flex items-center justify-center"><LoadingSpinner /></div>
                      ) : (
                        item.name
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-secondary">No items available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Information */}

      {/* Monitor */}
      <div className="mb-8">
        <h3 className="text-2xl text-center font-mono mb-4">Monitor</h3>
        {desk?.monitorId == null || optimisticWithdraw === "monitor" ? (
          <div className="text-center">
            <p className=" mb-4">This desk doesn't contain any monitor</p>
            {withdrawLoading === "monitor" ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <LoadingSpinner />
                <span className="text-sm text-secondary">Withdrawing monitor...</span>
              </div>
            ) : (
              <button
                onClick={() => handleAssign("monitor")}
                className="px-5 py-2.5 text-sm font-medium rounded-md bg-[var(--btn-bg)] text-[var(--btn-text)] transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading || Boolean(withdrawLoading)}
              >
                {loading && currentItemType === "monitor" ? (
                  <LoadingSpinner />
                ) : (
                  "Assign"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col mt-1 gap-y-2">
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">Name: {desk.monitor?.name}</span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">Brand: {desk.monitor?.brand}</span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">
              Condition:
              <span
                className={`ml-2 inline-block rounded px-2 py-0.5 text-xs font-semibold text-white ${desk.monitor?.status === "working"
                  ? "bg-green-500"
                  : "bg-red-500"}`}
              >
                {desk.monitor?.status}
              </span>
            </span>
            <button
              onClick={() =>
                desk.monitorId &&
                handleItemWithdraw(desk.monitorId, "monitor")
              }
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md  text-red-400 hover:bg-neutral-900 bg-[var(--btn-bg)] transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-800 dark:border-neutral-200"
              disabled={Boolean(withdrawLoading) || assigningId !== null || loading}
            >
              {withdrawLoading === "monitor" ? (
                <LoadingSpinner />
              ) : (
                "Withdraw"
              )}
            </button>
          </div>
        )}
      </div>

      {/* CPU */}
      <div>
        <h3 className="text-2xl text-center font-mono mb-4">CPU</h3>
        {desk?.cpuId == null || optimisticWithdraw === "cpu" ? (
          <div className="text-center">
            <p className="text-secondary mb-4">This desk doesn't contain any CPU</p>
            {withdrawLoading === "cpu" ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <LoadingSpinner />
                <span className="text-sm text-secondary">Withdrawing CPU...</span>
              </div>
            ) : (
              <button
                onClick={() => handleAssign("cpu")}
                className="px-5 py-2.5 text-sm font-medium rounded-md bg-[var(--btn-bg)] text-[var(--btn-text)] transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading || Boolean(withdrawLoading)}
              >
                {loading && currentItemType === "cpu" ? (
                  <LoadingSpinner />
                ) : (
                  "Assign"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col mt-1 gap-y-2">
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">Name: {desk.cpu?.name}</span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">Brand: {desk.cpu?.brand}</span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">
              Processor: {desk.cpu?.processor}
            </span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">Ram: {desk.cpu?.ram}</span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">SSD: {desk.cpu?.ssd}</span>
            {desk.cpu?.hdd ? (
              <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">HDD: {desk.cpu.hdd}</span>
            ) : null}
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">GPU: {desk.cpu?.gpu}</span>
            <span className="px-2 py-0.5 text-sm font-medium leading-6 tracking-tight">
              Condition:
              <span
                className={`ml-2 inline-block rounded px-2 py-0.5 text-xs font-semibold text-white ${desk.cpu?.status === "working"
                  ? "bg-green-500"
                  : "bg-red-500"}`}
              >
                {desk.cpu?.status}
              </span>
            </span>
            <button
              onClick={() =>
                desk.cpuId && handleItemWithdraw(desk.cpuId, "cpu")
              }
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md text-red-400 hover:bg-neutral-900 bg-[var(--btn-bg)] transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-800 cursor-pointer"
              disabled={Boolean(withdrawLoading) || assigningId !== null || loading}
            >
              {withdrawLoading === "cpu" ? <LoadingSpinner /> : "Withdraw"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
