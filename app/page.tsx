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

    async function fetchAllItems() {
      
      console.log('yes');
      setLoading(true);
      console.log('no');

      try {
        const [labres,cpuRes, monitorRes, printerRes, upsRes] = await Promise.all([
          fetch("/api/getAllLabs"),
          fetch("/api/getItems?item=cpu"),
          fetch("/api/getItems?item=monitor"),
          fetch("/api/getItems?item=printer"),
          fetch("/api/getItems?item=ups"),
        ]);

        const [labs,cpu, monitor, printer, ups] = await Promise.all([
          labres.json(),
          cpuRes.json(),
          monitorRes.json(),
          printerRes.json(),
          upsRes.json(),
        ]);

        setLabs(labs);
        setCpus(cpu);
        setMonitor(monitor);
        setPrinter(printer);
        setUps(ups);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching items:", error);
        }
      }
     setLoading(false);
    }

    fetchAllItems();

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
