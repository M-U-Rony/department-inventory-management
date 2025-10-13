"use client";

import { useState, useEffect } from "react";
import Sidebar from "../ui/sidebar";
import SummaryCard from "../components/summaryCard";
import { HashLoader } from "react-spinners";

export default function Home() {
  const [cpus, setCpus] = useState([]);
  const [monitor, setMonitor] = useState([]);
  const [printer, setPrinter] = useState([]);
  const [ups, setUps] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [labFetch, setLabFetch] = useState(false);

  function onNewLab() {
    setLabFetch((prev) => !prev);
  }

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
        const response = await fetch("/api/getItems?item=printer");
        const data = await response.json();
        setPrinter(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        const response = await fetch("/api/getItems?item=ups");
        const data = await response.json();
        setUps(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchallItems();
  }, []);


  useEffect(() => {

    async function fetchLabs() {
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

    fetchLabs();
    
  }, [labFetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-w-screen min-h-screen">
        <HashLoader size={60} color="currentColor" />
      </div>
    );
  }

  return (
    <main className="flex min-w-screen gap-6">
      {/*sidebar*/}
      <Sidebar labs={labs} onNewLab={onNewLab}/>

      <div className="flex flex-wrap gap-6 items-start mt-16 justify-center">
        <SummaryCard title="CPU" items={cpus} />
        <SummaryCard title="MONITOR" items={monitor} />
        <SummaryCard title="PRINTER" items={printer} />
        <SummaryCard title="UPS" items={ups} />
      </div>
    </main>
  );
}
