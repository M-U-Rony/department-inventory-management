"use client";

import { useParams } from "next/navigation";
import { MdDelete } from "react-icons/md";
import About from "./about";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../components/loadingSpinner";
import { Item } from "../types/item";

interface ItemsDashboardProps {
  onAdd?: () => void;
  items: Item[];
}

export default function ItemsDashboard({ onAdd, items }: ItemsDashboardProps) {
  const params = useParams<{ manage: string }>();
  const [showInformation, setshowInformation] = useState(false);
  // Initialize showItem with null and provide the type
  const [showItem, setshowItem] = useState<Item | null>(null);

  const [loading, setLoading] = useState<string | null>(null);

  const showDetails = (item: Item) => {
    setshowInformation(true);
    setshowItem(item);
  };

  const handleClose = () => {
    setshowInformation(false);
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation();
    setLoading(id);

    try {
      const res = await fetch(
        `/api/secure/deleteitem?item=${params.manage}&id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        if (typeof window !== "undefined") window.location.href = "/signin";
        return;
      }

      if (!res.ok) {
        toast.error("Failed to delete item");
      }

      toast.success("Item deleted successfully!");
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  };

  return (
    <section className="w-full">
      <Toaster />

      {showInformation && showItem ? (
        <About data={showItem} onClose={handleClose} />
      ) : null}
      <div className="card-surface rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--surface-muted)] cursor-pointer"
          >
            Add New
          </button>
        </div>

        <div className="mt-4 sm:mt-6 space-y-3">
          {items.map((item) => (
            <div
              onClick={() => showDetails(item)}
              key={item.id}
              className="flex items-center flex-nowrap cursor-pointer gap-2 sm:gap-4 rounded-lg bg-[color:var(--surface-muted)]/60 border border-[color:var(--border)] px-3 sm:px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm sm:text-base">{item.name}</p>
                {item.location && (
                  <p className="truncate text-xs text-gray-500 mt-1">
                    {item.location}
                  </p>
                )}
              </div>

              <div className="flex-1 text-center">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs sm:text-sm border border-[color:var(--border)] bg-[color:var(--surface)] ${
                    item.status === "working"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  disabled={loading === item.id}
                  className="inline-flex h-8 items-center cursor-pointer justify-center gap-2 rounded-md border border-[color:var(--border)] hover:bg-[color:var(--surface-muted)] px-3"
                >
                  {loading === item.id ? (
                    <>
                      <LoadingSpinner />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <MdDelete />
                  )}
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[color:var(--border)] p-6 text-center muted-text text-sm">
              No items yet. Click &quot;Add New&quot; to create one.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
