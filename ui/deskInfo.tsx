"use client";

import { useState } from "react";
import { Desk } from "../types/desk";
import { IoMdClose } from "react-icons/io";
import LoadingSpinner from "../components/loadingSpinner";

interface DeskInfoProps {
  desk?: Desk;
  handleCloseModal: () => void;
}

interface Item {
  id: number;
  name: string;
}

export default function DeskInfo({ desk, handleCloseModal }: DeskInfoProps) {
  const [unassignedItems, setUnassignedItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItemType, setCurrentItemType] = useState("");
  const [loading, setLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState("");

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
      setWithdrawLoading(item);
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
    } catch (error) {
      console.error("Error withdrawing item:", error);
    } finally {
      setWithdrawLoading("");
    }
  };

  const handleItemAssignment = async (itemId: number) => {
    try {
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
    } catch (error) {
      console.error("Error assigning item:", error);
    }
  };

  return (
    <div className="text-primary">
      {/* Modal for Unassigned Items */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="card-surface p-6 rounded-md w-3xl h-96 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-center font-semibold text-primary">
                Available items
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-secondary hover:text-primary"
              >
                x
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {unassignedItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {unassignedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-base-200 p-3 rounded cursor-pointer hover:bg-base-300"
                      onClick={() => handleItemAssignment(item.id)}
                    >
                      {item.name}
                    </div>
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
        {desk?.monitorId == null ? (
          <div className="text-center">
            <p className=" mb-4">This desk doesn't contain any monitor</p>
            <button
              onClick={() => handleAssign("monitor")}
              className="px-6 py-2 cursor-pointer bg-[var(--btn-bg)] text-[var(--btn-text)] rounded-md"
              disabled={loading}
            >
              {loading && currentItemType === "monitor" ? (
                <LoadingSpinner />
              ) : (
                "Assign"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col mt-1 gap-y-2">
            <span className="px-2 py-0.5">Name: {desk.monitor?.name}</span>
            <span className="px-2 py-0.5">Name: {desk.monitor?.brand}</span>
            <span className="px-2 py-0.5">
              Condition: {desk.monitor?.status}
            </span>
            <button
              onClick={() =>
                desk.monitorId &&
                handleItemWithdraw(desk.monitorId, "monitor")
              }
              className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              disabled={withdrawLoading === "monitor"}
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
        <h3 className="text-xl text-center mb-4">CPU</h3>
        {desk?.cpuId == null ? (
          <div className="text-center">
            <p className="text-secondary mb-4">This desk doesn't contain any CPU</p>
            <button
              onClick={() => handleAssign("cpu")}
              className="px-6 py-2 cursor-pointer bg-primary text-primary-content rounded-md transition-colors"
              disabled={loading}
            >
              {loading && currentItemType === "cpu" ? (
                <LoadingSpinner />
              ) : (
                "Assign"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col mt-1 gap-y-2">
            <span className="px-2 py-0.5">Name: {desk.cpu?.name}</span>
            <span className="px-2 py-0.5">Brand: {desk.cpu?.brand}</span>
            <span className="px-2 py-0.5">
              Processor: {desk.cpu?.processor}
            </span>
            <span className="px-2 py-0.5">Ram: {desk.cpu?.ram}</span>
            <span className="px-2 py-0.5">SSD: {desk.cpu?.ssd}</span>
            {desk.cpu?.hdd ? (
              <span className="px-2 py-0.5">HDD: {desk.cpu.hdd}</span>
            ) : null}
            <span className="px-2 py-0.5">GPU: {desk.cpu?.gpu}</span>
            <span className="px-2 py-0.5">
              Condition: {desk.cpu?.status}
            </span>
            <button
              onClick={() =>
                desk.cpuId && handleItemWithdraw(desk.cpuId, "cpu")
              }
              className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              disabled={withdrawLoading === "cpu"}
            >
              {withdrawLoading === "cpu" ? <LoadingSpinner /> : "Withdraw"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
