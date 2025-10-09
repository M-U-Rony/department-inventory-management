"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMenu, FiPlus, FiSave, FiX, FiMonitor } from "react-icons/fi";

interface Lab {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Sidebar({ labs }: { labs: Lab[] }) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [labName, setLabName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  function handleSave() {
    if (labName.trim()) {
      async function saveLab() {
        setShowInput(false);
        setLabName("");
        try {
          await fetch("/api/createRoom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: labName }),
          });
        } catch (error) {
          console.error("Error creating lab:", error);
        }
      }
      saveLab();
    }
  }

  return (
    <>
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
        ${isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-64"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          {!isCollapsed && <h2 className="text-sm font-semibold truncate">Spaces</h2>}

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
                  className="p-1 rounded hover:bg-[var(--surface-muted)]"
                  onClick={() => setShowInput(true)}
                >
                  <FiPlus />
                </button>
              </>
            )}
            {isCollapsed && <FiMonitor size={20} className="mx-auto" />}
          </div>

          {/* Input for New Lab */}
          {showInput && !isCollapsed && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--surface-muted)]"
                placeholder="Enter lab name"
              />
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded text-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] transition"
                  onClick={handleSave}
                >
                  <FiSave /> Save
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded text-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] transition"
                  onClick={() => {
                    setShowInput(false);
                    setLabName("");
                  }}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Lab List */}
          {labs.length > 0 &&
            labs.map((lab, i) => (
              <div
                key={i}
                onClick={() => router.push(`/computer-lab/${lab.name}`)}
                className="flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-[var(--surface-muted)] transition"
              >
                {!isCollapsed ? (
                  <span className="truncate text-sm">{lab.name}</span>
                ) : (
                  <span className="mx-auto text-sm font-medium">
                    {lab.name.charAt(0).toUpperCase()}
                  </span>
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
    </>
  );
}
