"use client";

import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface AddItemsFormProps {
  onClose?: () => void;
  title: string;
}

interface FormState {
  name: string;
  processor?: string; // Marked as optional
  ram?: string;
  hdd?: string;
  ssd?: string;
  gpu?: string;
  status: string;
  note: string;
}

export default function AddItemsForm({ onClose,title }: AddItemsFormProps) {

  const [form, setForm] = useState<FormState>({
    name: "",
    processor: undefined,
    ram: undefined,
    hdd: undefined,
    ssd: undefined,
    gpu: undefined,
    status: "working",
    note: "",
  });


  const [loading, setLoading] = useState(false);


  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/additem?item=${title}`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      window.location.reload();

      if (onClose) onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">
      <div className="card-surface rounded-xl p-4 sm:p-6 shadow-sm">
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
            <label className="text-sm muted-text w-40 sm:w-48">Name</label>
            <div className="flex-1">
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder=""
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              />
            </div>
          </div>

          {title === 'cpu' ? 
          <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm muted-text w-40 sm:w-48">Processor</label>
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
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] placeholder:text-[color:var(--text-muted)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              />
            </div>
          </div>
          </>: null }


          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <label className="text-sm muted-text w-40 sm:w-48">status</label>
            <div className="flex-1">
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[color:var(--surface-muted)]/60 focus:bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[color:var(--accent)] text-sm"
              >
                <option value="working">working</option>
                <option value="maintenance">Not Working</option>
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
              className="w-full sm:w-auto h-11 sm:h-10 rounded-lg accent-bg cursor-pointer border font-medium px-5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <AiOutlineLoading3Quarters />
              ) : (
                "save"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
