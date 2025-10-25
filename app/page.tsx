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
  const [almari, setAlmari] = useState([]);
  const [bookshelf, setBookshelf] = useState([]);
  const [labs, setLabs] = useState([]);
  const [rooms, setrooms] = useState([])
  const [loading, setLoading] = useState(true);
  const [labFetch, setLabFetch] = useState(false);

  function onNewLab() {
    setLabFetch((prev) => !prev);
  }
  
  useEffect(() => {

    async function fetchAllItems() {
      
      setLoading(true);

      try {
        const [labres,roomres,cpuRes, monitorRes, printerRes, upsRes,almariRes,bookshelfRes] = await Promise.all([
          fetch("/api/getAllLabs"),
          fetch("/api/getAllRooms"),
          fetch("/api/getItems?item=cpu"),
          fetch("/api/getItems?item=monitor"),
          fetch("/api/getItems?item=printer"),
          fetch("/api/getItems?item=ups"),
          fetch("/api/getItems?item=almari"),
          fetch("/api/getItems?item=bookshelf"),
        ]);

        const [labs,rooms,cpu, monitor, printer, ups,almari,bookshelf] = await Promise.all([
          labres.json(),
          roomres.json(),
          cpuRes.json(),
          monitorRes.json(),
          printerRes.json(),
          upsRes.json(),
          almariRes.json(),
          bookshelfRes.json(),
        ]);

        setLabs(labs);
        setrooms(rooms)
        setCpus(cpu);
        setMonitor(monitor);
        setPrinter(printer);
        setUps(ups);
        setAlmari(almari);
        setBookshelf(bookshelf);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error in fetching item";
        console.log(message);
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
      <Sidebar labs={labs} rooms={rooms} onNewLab={onNewLab}/>

      <div className="flex flex-wrap gap-x-6 gap-y-10 mt-16 mb-16">
        <SummaryCard title="CPU" items={cpus} />
        <SummaryCard title="MONITOR" items={monitor} />
        <SummaryCard title="PRINTER" items={printer} />
        <SummaryCard title="UPS" items={ups} />
        <SummaryCard title="ALMARI" items={almari} />
        <SummaryCard title="BOOKSHELF" items={bookshelf} />
      </div>
    </main>
  );
}
