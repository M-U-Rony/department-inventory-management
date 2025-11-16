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

interface Room {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function Sidebar({
  labs,
  rooms,
  onNewLab,
}: {
  labs: Lab[];
  rooms: Room[];
  onNewLab: () => void;
}) {
  const router = useRouter();
  const [showLabForm, setShowLabForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [category, setCategory] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [isRoomCreating, setIsRoomCreating] = useState(false);

  // Check screen size and adjust sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1230;
      setIsMobile(mobile);
      setIsCollapsed(mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  function handleEditName(
    Id: number,
    currentName: string,
    event: React.MouseEvent,
    category: string
  ) {
    event.stopPropagation();
    setEditingId(Id);
    setEditName(currentName);
    setCategory(category);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditName("");
    setCategory("");
  }

  async function handleSaveEdit() {
    if (editName.trim() && editingId) {
      setIsEditLoading(true);

      try {
        const res = await fetch("/api/secure/updateLabOrRoomName", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: editName.trim(),
            category: category,
          }),
        });

        if (res.status === 401) {
          if (typeof window !== "undefined") window.location.href = "/signin";
          return;
        }

        if (res.ok) {
          toast.success("Lab name updated successfully");
          onNewLab(); // Refresh the lab list
          setEditingId(null);
          setEditName("");
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

  function handleCreateRoom() {
    setShowRoomForm(true);
  }

  async function handleSubmitRoom() {
    if (!newRoomName.trim()) return;
    setIsRoomCreating(true);
    try {
      const res = await fetch("/api/secure/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newRoomName.trim() }),
      });

      if (res.status === 401) {
        if (typeof window !== "undefined") window.location.href = "/signin";
        return;
      }

      if (res.ok) {
        toast.success("Room created successfully");
        setShowRoomForm(false);
        setNewRoomName("");
        onNewLab();
      } else {
        toast.error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Error creating room");
    } finally {
      setIsRoomCreating(false);
    }
  }

  return (
    <>
      <Toaster />
      {/* Open Sidebar Button (Mobile Only) */}
      {isMobile && isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:bg-[var(--surface-muted)] transition"
        >
          <FiMenu size={18} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile ? "fixed" : "md:relative"
        } top-0 left-0 h-screen transition-all duration-300 z-20 border-r border-[var(--border)] bg-[var(--surface)] shadow-md overflow-x-hidden shrink-0
        ${
          isCollapsed
            ? isMobile
              ? "-translate-x-full"
              : "md:translate-x-0 md:w-16 md:min-w-[4rem] md:max-w-[4rem]"
            : "translate-x-0 w-64 min-w-[16rem] max-w-[16rem]"
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
                {editingId === lab.id && category === "lab" && !isCollapsed ? (
                  <div className="px-3 py-2 space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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
                    className="flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-[var(--surface-muted)] transition overflow-hidden"
                  >
                    {!isCollapsed ? (
                      <>
                        <span className="truncate text-sm flex-1">
                          {lab.name}
                        </span>
                        <button
                          onClick={(e) =>
                            handleEditName(lab.id, lab.name, e, "lab")
                          }
                          className="p-1 rounded hover:bg-[var(--surface-muted)] transition cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                      </>
                    ) : (
                      <FiMonitor size={20} className="mx-auto" />
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Teacher's Room Section */}

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center px-3 py-2 rounded hover:bg-[var(--surface-muted)] transition">
            {!isCollapsed && (
              <>
                <span className="font-medium text-sm">Teacher's Room</span>
                <button
                  className="p-1 rounded hover:bg-[var(--surface-muted)] cursor-pointer"
                  onClick={handleCreateRoom}
                >
                  <FiPlus />
                </button>
              </>
            )}
            {isCollapsed && <FiMonitor size={20} className="mx-auto" />}
          </div>

          {showRoomForm && !isCollapsed && (
            <div className="px-3 py-2 space-y-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitRoom();
                  } else if (e.key === "Escape") {
                    setShowRoomForm(false);
                    setNewRoomName("");
                  }
                }}
                className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--surface-muted)]"
                placeholder="Enter room name"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded text-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmitRoom}
                  disabled={isRoomCreating}
                >
                  {isRoomCreating ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <FiSave /> Save
                    </>
                  )}
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded text-sm border border-[var(--border)] hover:bg-[var(--surface-muted)] transition"
                  onClick={() => {
                    setShowRoomForm(false);
                    setNewRoomName("");
                  }}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Room List */}
          {rooms.length > 0 &&
            rooms.map((room, i) => (
              <div key={i} className="space-y-2">
                {/* Edit Input (when in edit mode) */}
                {editingId === room.id &&
                category === "room" &&
                !isCollapsed ? (
                  <div className="px-3 py-2 space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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
                  <div
                    onClick={() => router.push(`room/${room.name}`)}
                    className="flex justify-between items-center px-3 py-2 rounded cursor-pointer hover:bg-[var(--surface-muted)] transition"
                  >
                    {!isCollapsed ? (
                      <>
                        <span className="truncate text-sm flex-1">
                          {room.name}
                        </span>
                        <button
                          onClick={(e) =>
                            handleEditName(room.id, room.name, e, "room")
                          }
                          className="p-1 rounded hover:bg-[var(--surface-muted)] transition cursor-pointer"
                        >
                          <FiEdit2 />
                        </button>
                      </>
                    ) : (
                      <FiMonitor size={20} className="mx-auto" />
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
