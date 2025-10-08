"use client";

import { useState, useEffect } from "react";
import Sidebar from "../ui/sidebar";
import SummaryCard from "../components/summaryCard";
import { HashLoader } from "react-spinners";

export default function Home() {
  const [cpus, setCpus] = useState([]);
  const [monitor, setMonitor] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchallItems() {
      try {
        const response = await fetch("/api/getItems?item=cpu");
        const data = await response.json();
        setCpus(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch("/api/getItems?item=monitor");
        const data = await response.json();
        setMonitor(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch("/api/getAllrooms");
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchallItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <HashLoader size={60} color="currentColor" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen min-w-screen gap-8">
      {/*sidebar*/}
      <Sidebar labs={labs} />

      {/*Dashboard*/}

      <div className="flex gap-8 items-start">
        <SummaryCard title="CPU" items={cpus} />
        <SummaryCard title="MONITOR" items={monitor} />
      </div>
    </main>
  );
}
