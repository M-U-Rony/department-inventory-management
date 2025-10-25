"use client";

import LoadingSpinner from "../components/loadingSpinner";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface AddItemsFormProps {
  onClose?: () => void;
  title: string;
  mode?: "add" | "edit";
  itemId?: string;
  initial?: Partial<FormState>;
}

interface FormState {
  name: string;
  brand: string;
  processor?: string;
  ram?: string;
  hdd?: string;
  ssd?: string;
  gpu?: string;
  status: string;
  note: string;
}

export default function AddItemsForm({ onClose, title, mode = "add", itemId, initial }: AddItemsFormProps) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    brand: initial?.brand ?? "",
    processor: initial?.processor,
    ram: initial?.ram,
    hdd: initial?.hdd,
    ssd: initial?.ssd,
    gpu: initial?.gpu,
    status: initial?.status ?? "working",
    note: initial?.note ?? "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const isEdit = mode === "edit" && itemId;
      const url = isEdit
        ? `/api/secure/updateitem?item=${title}&id=${itemId}`
        : `/api/secure/additem?item=${title}`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        if (typeof window !== "undefined") window.location.href = "/signin";
        return;
      }

      if (!res.ok) {
        toast.error(isEdit ? "Failed to update item" : "Failed to add item");
      }

      toast.success(isEdit ? "Item updated successfully!" : "Item added successfully!");

      window.location.reload();

      if (onClose) onClose();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">
      <div className="card-surface rounded-xl p-4 sm:p-6 shadow-sm">
        <Toaster />
        <div className="flex items-center justify-end mb-4 sm:mb-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer pr-2"
          >
            <b>X</b>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm muted-text w-40 sm:w-48">ID</label>
            <div className="flex-1">
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder=""
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              />
            </div>
          </div>

          { (title === "cpu" || title === "monitor" || title == "printer") && (
            
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm muted-text w-40 sm:w-48">
              Brand Name
            </label>
            <div className="flex-1">
              <input
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
                placeholder=""
                list="brandOptions"
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              />
              <datalist id="brandOptions">
                <option value="HP" />
                <option value="ASUS" />
                <option value="Dell" />
              </datalist>
            </div>
          </div>
          )
          }

          {title === "cpu" ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm muted-text w-40 sm:w-48">
                  Processor
                </label>
                <div className="flex-1">
                  <select
                    value={form.processor}
                    onChange={(e) => update("processor", e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
                  >
                    <option value="">Select Processor</option>
                    <option value="Intel i3">Intel i3</option>
                    <option value="Intel i5">Intel i5</option>
                    <option value="Intel i7">Intel i7</option>
                    <option value="Intel i9">Intel i9</option>
                    <option value="Ryzen 3">Ryzen 3</option>
                    <option value="Ryzen 5">Ryzen 5</option>
                    <option value="Ryzen 7">Ryzen 7</option>
                    <option value="Ryzen 9">Ryzen 9</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm muted-text w-40 sm:w-48">ram</label>
                <div className="flex-1">
                  <select
                    value={form.ram}
                    onChange={(e) => update("ram", e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
                  >
                    <option value="">Select RAM</option>
                    <option value="4 GB">4 GB</option>
                    <option value="8 GB">8 GB</option>
                    <option value="16 GB">16 GB</option>
                    <option value="32 GB">32 GB</option>
                    <option value="64 GB">64 GB</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm muted-text w-40 sm:w-48">hdd</label>
                <div className="flex-1">
                  <select
                    value={form.hdd}
                    onChange={(e) => update("hdd", e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
                  >
                    <option value="">Select HDD</option>
                    <option value="256 GB">256 GB</option>
                    <option value="512 GB">512 GB</option>
                    <option value="1 TB">1 TB</option>
                    <option value="2 TB">2 TB</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm muted-text w-40 sm:w-48">ssd</label>
                <div className="flex-1">
                  <select
                    value={form.ssd}
                    onChange={(e) => update("ssd", e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
                  >
                    <option value="">Select SSD</option>
                    <option value="128 GB">128 GB</option>
                    <option value="256 GB">256 GB</option>
                    <option value="512 GB">512 GB</option>
                    <option value="1 TB">1 TB</option>
                    <option value="2 TB">2 TB</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <label className="text-sm muted-text w-40 sm:w-48">gpu</label>
                <div className="flex-1">
                  <input
                    value={form.gpu}
                    onChange={(e) => update("gpu", e.target.value)}
                    placeholder="Integrated / GTX 1050"
                    list="gpuOptions"
                    className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
                  />
                  <datalist id="gpuOptions">
                    <option value="Integrated" />
                  </datalist>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm muted-text w-40 sm:w-48">status</label>
            <div className="flex-1">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              >
                <option value="working">Working</option>
                <option value="not working">Not Working</option>
                <option value="maintenance">Maintenance</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            <label className="text-sm muted-text w-40 sm:w-48">Note</label>
            <div className="flex-1">
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                placeholder="Any additional information..."
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[color:var(--border)] px-3 py-2 text-sm font-medium hover:bg-[color:var(--surface-muted)] cursor-pointer min-w-24"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
