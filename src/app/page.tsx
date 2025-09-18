"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<
    { name: string; items: string[] }[]
  >([{ name: "Computer-Lab", items: ["lab-1", "lab-2", "lab-3", "lab-4"] }]);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editingSub, setEditingSub] = useState<{
    category: string;
    name: string;
  } | null>(null);
  const [editSubName, setEditSubName] = useState("");

  // Convert names to URL-friendly format
  const toUrlFriendly = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Navigate to subcategory page
  const handleSubcategoryClick = (
    categoryName: string,
    subcategoryName: string
  ) => {
    const categoryUrl = toUrlFriendly(categoryName);
    const subcategoryUrl = toUrlFriendly(subcategoryName);

    // Route to specific pages based on category
    switch (categoryName) {
      case "Computer-Lab":
        router.push(`/computer-lab/${subcategoryUrl}`);
        break;
      case "Hardware-Lab":
        router.push(`/hardware-lab/${subcategoryUrl}`);
        break;
      case "Class Room":
        router.push(`/class-room/${subcategoryUrl}`);
        break;
      case "Teacher's Room":
        router.push(`/teachers-room/${subcategoryUrl}`);
        break;
      case "Office Room":
        router.push(`/office-room/${subcategoryUrl}`);
        break;
      case "Seminar Room":
        router.push(`/seminar-room/${subcategoryUrl}`);
        break;
      default:
        // Fallback to generic route
        router.push(`/${categoryUrl}/${subcategoryUrl}`);
    }
  };

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    setCategories((prev) => [...prev, { name, items: [] }]);
    setNewCategoryName("");
    setAddingCategory(false);
  }

  function SidebarNav() {
    return (
      <nav className="space-y-5">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="text-sm mb-2 flex items-center justify-between text-neutral-300">
              {editingCategory === cat.name ? (
                <div className="flex w-full items-center gap-2">
                  <input
                    autoFocus
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = editCategoryName.trim();
                        if (!value) return;
                        setCategories((prev) =>
                          prev.map((c) =>
                            c.name === cat.name ? { ...c, name: value } : c
                          )
                        );
                        setEditingCategory(null);
                      }
                      if (e.key === "Escape") setEditingCategory(null);
                    }}
                    className="flex-1 rounded-md bg-neutral-900 px-2 py-1 outline-none"
                  />
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="inline-flex h-7 items-center justify-center rounded-md border border-neutral-800 px-2 hover:bg-neutral-800"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <span>{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAddingSubFor(cat.name);
                        setNewSubName("");
                      }}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                      aria-label={`Add subcategory to ${cat.name}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory(cat.name);
                        setEditCategoryName(cat.name);
                      }}
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                      aria-label={`Rename ${cat.name}`}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() =>
                        setCategories((prev) =>
                          prev.filter((c) => c.name !== cat.name)
                        )
                      }
                      className="inline-flex h-6 w-6 items-center justify-center rounded border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                      aria-label={`Delete ${cat.name}`}
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-2">
              {cat.items.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md bg-neutral-800/60 hover:bg-neutral-800 px-3 py-2 text-neutral-200"
                >
                  {editingSub &&
                  editingSub.category === cat.name &&
                  editingSub.name === label ? (
                    <div className="flex w-full items-center gap-2">
                      <input
                        autoFocus
                        value={editSubName}
                        onChange={(e) => setEditSubName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = editSubName.trim();
                            if (!value) return;
                            setCategories((prev) =>
                              prev.map((c) =>
                                c.name === cat.name
                                  ? {
                                      ...c,
                                      items: c.items.map((it) =>
                                        it === label ? value : it
                                      ),
                                    }
                                  : c
                              )
                            );
                            setEditingSub(null);
                          }
                          if (e.key === "Escape") setEditingSub(null);
                        }}
                        className="flex-1 rounded-md bg-neutral-900 px-2 py-1 outline-none"
                      />
                      <button
                        onClick={() => setEditingSub(null)}
                        className="inline-flex h-6 items-center justify-center rounded border border-neutral-800 px-2 hover:bg-neutral-700"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="cursor-pointer hover:text-neutral-100 transition-colors"
                        onClick={() => handleSubcategoryClick(cat.name, label)}
                      >
                        {label}
                      </span>
                      <div className="flex items-center gap-2 text-neutral-300">
                        <button
                          onClick={() => {
                            setEditingSub({ category: cat.name, name: label });
                            setEditSubName(label);
                          }}
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-neutral-800 hover:bg-neutral-700"
                          aria-label={`Rename ${label}`}
                        >
                          ✎
                        </button>
                        <button
                          onClick={() =>
                            setCategories((prev) =>
                              prev.map((c) =>
                                c.name === cat.name
                                  ? {
                                      ...c,
                                      items: c.items.filter(
                                        (it) => it !== label
                                      ),
                                    }
                                  : c
                              )
                            )
                          }
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-neutral-800 hover:bg-neutral-700"
                          aria-label={`Delete ${label}`}
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {cat.name === "Computer-Lab" ? (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      const first = (cat.items[0] || "lab-1")
                        .toLowerCase()
                        .replace(/\s+/g, "-");
                      router.push(`/computer-lab/${first}/manage`);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-800"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add/Update items
                  </button>
                </div>
              ) : null}

              {addingSubFor === cat.name ? (
                <div className="rounded-md border border-neutral-800 bg-neutral-900/70 p-2">
                  <input
                    autoFocus
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const name = newSubName.trim();
                        if (!name) return;
                        setCategories((prev) =>
                          prev.map((c) =>
                            c.name === cat.name
                              ? { ...c, items: [...c.items, name] }
                              : c
                          )
                        );
                        setNewSubName("");
                        setAddingSubFor(null);
                      }
                      if (e.key === "Escape") setAddingSubFor(null);
                    }}
                    placeholder="New subcategory name"
                    className="w-full rounded-md bg-neutral-950/60 px-3 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        const name = newSubName.trim();
                        if (!name) return;
                        setCategories((prev) =>
                          prev.map((c) =>
                            c.name === cat.name
                              ? { ...c, items: [...c.items, name] }
                              : c
                          )
                        );
                        setNewSubName("");
                        setAddingSubFor(null);
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-neutral-200/10 hover:bg-neutral-200/20 px-3 py-1.5 text-sm text-neutral-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setAddingSubFor(null)}
                      className="inline-flex items-center justify-center rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {addingCategory ? (
          <div className="rounded-md border border-neutral-800 bg-neutral-900/70 p-2">
            <input
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
                if (e.key === "Escape") setAddingCategory(false);
              }}
              placeholder="New category name"
              className="w-full rounded-md bg-neutral-950/60 px-3 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-500"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center justify-center rounded-md bg-neutral-200/10 hover:bg-neutral-200/20 px-3 py-1.5 text-sm text-neutral-200"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAddingCategory(false);
                  setNewCategoryName("");
                }}
                className="inline-flex items-center justify-center rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </nav>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto">
      {/* Mobile top bar */}
      <div className="mb-4 flex items-center justify-between sm:hidden">
        <button
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="text-sm text-neutral-400">Inventory</div>
        <div className="w-9" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden sm:block rounded-xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-400">Spaces</span>
            <button
              onClick={() => setAddingCategory(true)}
              className="inline-flex h-7 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 px-2 text-neutral-300 hover:bg-neutral-800"
            >
              +
            </button>
          </div>
          <SidebarNav />
        </aside>

        {/* Main content */}
        <main className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: "CPU", total: 50, inUse: 40, issue: 10, inStore: 10 },
              { title: "Monitor", total: 70, inUse: 52, issue: 6, inStore: 10 },
              { title: "Printer", total: 18, inUse: 11, issue: 2, inStore: 10 },
              { title: "Switch", total: 10, inUse: 8, issue: 2, inStore: 10 },
              {
                title: "keyboard",
                total: 50,
                inUse: 40,
                issue: 10,
                inStore: 10,
              },
              { title: "mouse", total: 50, inUse: 40, issue: 10, inStore: 10 },
              {
                title: "Computer-Desk",
                total: 50,
                inUse: 40,
                issue: 10,
                inStore: 10,
              },
              { title: "Bench", total: 50, inUse: 40, issue: 10, inStore: 10 },
              { title: "Chair", total: 50, inUse: 40, issue: 10, inStore: 10 },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-xl border ${
                  item.title
                    ? "border-neutral-800/80 bg-neutral-900"
                    : "border-dashed border-neutral-800/70 bg-neutral-900/20"
                } p-4 min-h-36 flex flex-col justify-between`}
              >
                {item.title ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold tracking-wide text-neutral-100">
                        {item.title}
                      </div>
                      <div className="text-sm text-neutral-400">
                        Total:{" "}
                        <span className="text-neutral-200">{item.total}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-neutral-400 leading-6">
                      <div>
                        In use:{" "}
                        <span className="text-neutral-200">{item.inUse}</span>
                      </div>
                      {item.inStore !== undefined ? (
                        <div>
                          In store:{" "}
                          <span className="text-neutral-200">
                            {item.inStore}
                          </span>
                        </div>
                      ) : null}
                      <div>
                        Issue:{" "}
                        <span className="text-neutral-200">{item.issue}</span>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mobile drawer sidebar */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] sm:hidden"
          />
          <aside className="fixed z-50 inset-y-0 left-0 w-72 sm:hidden border-r border-neutral-800 bg-neutral-900 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-neutral-400">
                Spaces
              </span>
              <button
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <SidebarNav />
          </aside>
        </>
      )}
    </div>
  );
}
