"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ItemsDashboard from "../../../ui/itemsDashboard";
import AddItemsForm from "../../../ui/addItemsForm";
import { HashLoader } from "react-spinners";
import BackButton from "../../../components/backButton";
import { Item } from "../../../types/item";

interface ApiItem extends Item {
  desk?: {
    deskNo: string;
    lab: {
      name: string;
    };
    room?: {
      name: string;
    } | null;
  } | null;
  room?: {
    name: string;
  } | null;
}

export default function ManageItems() {
  const [showForm, setShowForm] = useState(false);
  const [items, setitems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ manage: string }>();

  useEffect(() => {
    async function fetchdata() {
      try {
        const res = await fetch(`/api/getItems?item=${params.manage}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: ApiItem[] = await res.json();

        // Transform data to include location information
        const transformedData: Item[] = data.map((item: ApiItem) => {
          let location: string | null = null;

          // Desk-based location (cpu/monitor)
          if (item.desk && item.desk.lab) {
            location = `${item.desk.lab.name} - ${item.desk.deskNo}`;
          }

          // Desk assigned to a room (no lab)
          if (!location && item.desk && item.desk.room) {
            location = item.desk.room.name;
          }

          // Room-based location (printer/almari/bookshelf)
          if (!location && item.room) {
            location = item.room.name;
          }

          return {
            ...item,
            location,
          };
        });

        setitems(transformedData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchdata();
  }, [params.manage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <HashLoader size={60} color="currentColor" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 mx-auto max-w-6xl min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {`${params.manage}`.toUpperCase()}
        </h1>
        <p className="text-sm text-neutral-400">
          Manage, add and review all records below.
        </p>
      </div>

      {showForm ? (
        <AddItemsForm
          onClose={() => setShowForm(false)}
          title={params.manage}
        />
      ) : null}

      {/* Content */}
      <div className="rounded-xl border p-3 sm:p-5">
        <ItemsDashboard items={items} onAdd={() => setShowForm(true)} />
      </div>
    </div>
  );
}
