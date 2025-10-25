"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiPlus, FiX, FiMonitor } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit2, FiSave } from "react-icons/fi";
import LabCreationForm from "./labCreationForm";

interface Lab {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Sidebar({
  labs,
  onNewLab,
}: {
  labs: Lab[];
  onNewLab: () => void;
}) {
  const router = useRouter();
  const [showLabForm, setShowLabForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingLabId, setEditingLabId] = useState<number | null>(null);
  const [editLabName, setEditLabName] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Check screen size and adjust sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  function handleEditName(
    labId: number,
    currentName: string,
    event: React.MouseEvent
  ) {
    event.stopPropagation(); // Prevent navigation to lab page
    setEditingLabId(labId);
    setEditLabName(currentName);
  }

  function handleCancelEdit() {
    setEditingLabId(null);
    setEditLabName("");
  }

  async function handleSaveEdit() {
    if (editLabName.trim() && editingLabId) {
      setIsEditLoading(true);
      try {
        const res = await fetch("/api/secure/updateRoomName", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingLabId,
            name: editLabName.trim(),
          }),
        });

        if (res.status === 401) {
          if (typeof window !== "undefined") window.location.href = "/signin";
          return;
        }

        if (res.ok) {
          toast.success("Lab name updated successfully");
          onNewLab(); // Refresh the lab list
          setEditingLabId(null);
          setEditLabName("");
        } else {
          toast.error("Failed to update lab name");
        }
      } catch (error) {
        console.error("Error in editing lab name:", error);
        toast.error("Error updating lab name");
      } finally {
        setIsEditLoading(false);
      }
    }
  }

  return (
    <>
      <Toaster />
      {/* Open Sidebar Button (Mobile Only) */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:bg-[var(--surface-muted)] transition"
        >
          <FiMenu size={18} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen transition-all duration-300 z-20 border-r border-[var(--border)] bg-[var(--surface)] shadow-md md:shadow-none
        ${
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-16"
            : "translate-x-0 w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold truncate">Spaces</h2>
          )}

          {/* Close Button (mobile only) */}
          {isMobile && !isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-[var(--surface-muted)] transition"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Computer Lab Section */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center px-3 py-2 rounded hover:bg-[var(--surface-muted)] transition">
            {!isCollapsed && (
              <>
                <span className="font-medium text-sm">Computer-Lab</span>
                <button
                  className="p-1 rounded hover:bg-[var(--surface-muted)] cursor-pointer"
                  onClick={() => setShowLabForm(true)}
                >
                  <FiPlus />
                </button>
              </>
            )}
            {isCollapsed && <FiMonitor size={20} className="mx-auto" />}
          </div>

          {/* Lab List */}
          {labs.length > 0 &&
            labs.map((lab, i) => (
              <div key={i} className="space-y-2">
                {/* Edit Input (when in edit mode) */}
                {editingLabId === lab.id && !isCollapsed ? (
                  <div className="px-3 py-2 space-y-2">
                    <input
                      type="text"
                      value={editLabName}
                      onChange={(e) => setEditLabName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit();
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                      className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--surface-muted)]"
                      placeholder="Enter lab name"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-2 rounded text-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleSaveEdit}
                        disabled={isEditLoading}
                      >
                        {isEditLoading ? (
                          <>Updating...</>
                        ) : (
                          <>
                            <FiSave /> Save
                          </>
                        )}
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-2 rounded text-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] transition"
                        onClick={handleCancelEdit}
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal Lab Display */
                  <div
                    onClick={() => router.push(`/computer-lab/${lab.name}`)}
                    className="flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-[var(--surface-muted)] transition"
                  >
                    {!isCollapsed ? (
                      <>
                        <span className="truncate text-sm flex-1">
                          {lab.name}
                        </span>
                        <button
                          onClick={(e) => handleEditName(lab.id, lab.name, e)}
                          className="p-1 rounded hover:bg-[var(--surface-muted)] transition cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                      </>
                    ) : (
                      <span className="mx-auto text-sm font-medium">
                        {lab.name}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>


        
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Lab Creation Form Modal */}
      {showLabForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--surface)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold">Create New Lab</h2>
              <button
                onClick={() => setShowLabForm(false)}
                className="p-2 rounded-lg hover:bg-[var(--surface-muted)] transition cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <LabCreationForm
                onSuccess={() => {
                  setShowLabForm(false);
                  onNewLab();
                  toast.success("Lab created successfully!");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
