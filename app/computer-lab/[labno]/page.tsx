"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HashLoader } from "react-spinners";
import Lab1Layout from "../../../ui/lab1lLayout";
import Lab2Layout from "../../../ui/lab2Layout";
import { Desk } from "../../../types/desk";

export default function ComputerLabPage() {
  const params = useParams<{ labno: string }>();
  const [desks, setDesks] = useState<Desk[]>([]);
  const [layout, setLayout] = useState("1");
  const [selectedDesk, setSelectedDesk] = useState(null as Desk | null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDesks() {
      setLoading(true);
      try {
        const response = await fetch(`/api/getLab?name=${params.labno}`);
        const data = await response.json();
        // console.log("Fetched data:", data);
        setDesks(data.desks || []);
        setLayout(data.layout || "1");
      } catch (error) {
        console.error("Error fetching desks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDesks();
  }, [params.labno]);

  const handleDeskClick = (desk: Desk) => {
    setSelectedDesk(desk);
  };

  const handleCloseModal = () => {
    setSelectedDesk(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <HashLoader size={60} color="currentColor" />
      </div>
    );
  }

  // Conditional rendering based on layout
  if (layout === "1") {
    return (
      <Lab2Layout
        desks={desks}
        selectedDesk={selectedDesk}
        handleDeskClick={handleDeskClick}
        handleCloseModal={handleCloseModal}
        params={params}
      />
    );
  } else {
    return (
      <Lab1Layout
        desks={desks}
        selectedDesk={selectedDesk}
        handleDeskClick={handleDeskClick}
        handleCloseModal={handleCloseModal}
        params={params}
      />
    );
  }
}
