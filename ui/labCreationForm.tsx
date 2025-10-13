"use client";

import { useState } from "react";
import { HiComputerDesktop } from "react-icons/hi2";
import LoadingSpinner from "../components/loadingSpinner";

interface LabCreationFormProps {
  onSuccess?: () => void;
}

export default function LabCreationForm({ onSuccess }: LabCreationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    layout: "",
    rowsPerColumn: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleLayoutChange = (layout: string) => {
    setFormData((prev) => ({
      ...prev,
      layout,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Lab name is required");
      return;
    }
    if (!formData.layout) {
      setError("Please select a lab layout");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/createRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          layout: formData.layout,
          rows: formData.rowsPerColumn,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create lab");
      }

      const result = await response.json();
      console.log("Lab created successfully:", result);

      // Reset form
      setFormData({
        name: "",
        layout: "",
        rowsPerColumn: "",
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lab");
    } finally {
      setLoading(false);
    }
  };

  const LayoutOption = ({
    layout,
    title,
    deskCount,
    isSelected,
    onClick,
  }: {
    layout: string;
    title: string;
    deskCount: number;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? "border-blue-500 " : "border-gray-300"
      }`}
      onClick={onClick}
    >
      <input
        type="radio"
        name="layout"
        value={layout}
        checked={isSelected}
        onChange={() => onClick()}
        className="w-4 h-4 focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="text-sm font-medium mb-2">{title}</div>
        <div className="rounded-lg p-3 borde">
          <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
            {Array.from({ length: deskCount }).map((_, index) => (
              <>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded border border-gray-400 flex items-center justify-center bg-gray-50">
                    <HiComputerDesktop className="w-3 h-3" />
                  </div>
                  <span className="text-xs">Desk {index + 1}</span>
                </div>
                {deskCount === 7 && (index === 1 || index === 4) && (
                  <>
                    {/* Spacer for tablet/desktop */}
                    <div aria-hidden className="hidden sm:block w-4" />
                    {/* Force line break on mobile */}
                    <div
                      aria-hidden
                      className="block sm:hidden basis-full h-0"
                    />
                  </>
                )}
                {deskCount === 6 && (index === 1 || index === 3) && (
                  <>
                    <div aria-hidden className="hidden sm:block w-4" />
                    <div
                      aria-hidden
                      className="block sm:hidden basis-full h-0"
                    />
                  </>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="card-surface rounded-xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter lab name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              disabled={loading}
            />
          </div>

          {/* Lab Layout Selection */}
          <div>
            <label className="block text-sm font-medium mb-4">
              Select lab layout
            </label>
            <div className="space-y-4">
              <LayoutOption
                layout="1"
                title="7-Desk Layout"
                deskCount={7}
                isSelected={formData.layout === "1"}
                onClick={() => handleLayoutChange("1")}
              />
              <LayoutOption
                layout="2"
                title="6-Desk Layout"
                deskCount={6}
                isSelected={formData.layout === "2"}
                onClick={() => handleLayoutChange("2")}
              />
            </div>
          </div>

          {/* Rows per Column Input */}
          <div>
            <label
              htmlFor="rowsPerColumn"
              className="block text-sm font-medium mb-2"
            >
              How many rows in each column?
            </label>
            <input
              type="number"
              id="rowsPerColumn"
              name="rowsPerColumn"
              min={1}
              value={formData.rowsPerColumn}
              onChange={handleInputChange}
              placeholder="Enter number of rows"
              className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 sm:h-10 rounded-lg font-medium disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2`}
              style={{
                backgroundColor: "var(--btn-bg)",
                color: "var(--btn-text)",
              }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Creating...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
