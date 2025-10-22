"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useParams } from "next/navigation";
import { Item, ItemKey, ItemValue } from "../types/item";
import LoadingSpinner from "../components/loadingSpinner";
import AddItemsForm from "./addItemsForm";

export default function About({
  data,
  onClose,
}: {
  data: Item;
  onClose: () => void;
}) {
  const params = useParams<{ manage: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  // Helper functions for type-safe data access
  const getItemValue = (item: Item, key: string): ItemValue => {
    return item[key as ItemKey];
  };

  const getEditedValue = (key: string): string => {
    return (editedData[key as ItemKey] as string) || "";
  };

  const getDisplayValue = (key: string): string => {
    const value = getItemValue(data, key);

    if (key === "createdAt" || key === "updatedAt") {
      return new Date(value as string).toLocaleDateString();
    }

    if (key === "location") {
      return (value as string) || "Not assigned";
    }

    return String(value || "");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name as ItemKey]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/secure/updateitem?item=${params.manage}&id=${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });
      if (res.status === 401) {
        if (typeof window !== "undefined") window.location.href = "/signin";
        return;
      }
      setIsEditing(false);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to update item:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center min-h-screen w-full px-4 z-40 bg-black/20">
      <div className="w-full max-w-3xl card-surface shadow-lg rounded-xl p-6 bg-white max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-6 text-center">Details</h2>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center cursor-pointer justify-center rounded-md border border-[color:var(--border)] hover:bg-[color:var(--surface-muted)]"
          >
            <IoMdClose />
          </button>
        </div>

        {isEditing ? (
          <AddItemsForm
            onClose={onClose}
            title={String(params.manage)}
            mode="edit"
            itemId={data.id}
            initial={{
              name: data.name,
              brand: data.brand || "",
              processor: data.processor,
              ram: data.ram,
              hdd: data.hdd,
              ssd: data.ssd,
              gpu: data.gpu,
              status: data.status,
              note: data.note || "",
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(data).map((key) => {
                if (key === "id" || key === "desk") return null;

                const isEditableField =
                  key !== "createdAt" && key !== "updatedAt" && key !== "location";

                return (
                  <div className="flex flex-col" key={key}>
                    <label className="muted-text text-sm">
                      {key === "note"
                        ? "Note"
                        : key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <div className="rounded-md p-3 bg-[color:var(--surface)] text-[color:var(--text)] border border-[color:var(--border)]">
                      {getDisplayValue(key)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--surface-muted)] cursor-pointer"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
