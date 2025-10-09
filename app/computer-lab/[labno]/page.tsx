"use client";

import { HiComputerDesktop } from "react-icons/hi2";
import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import DeskInfo from "../../../ui/deskInfo";
import { HashLoader } from "react-spinners";

interface Desk {
  id: number;
  deskNo: string;
  labId: number;
  cpu: {
    id: number;
    name: string;
    processor: string;
    ram: string;
    ssd: string;
    [key: string]: any;
  } | null;
  cpuId: number | null;
  monitor: any | null;
  monitorId: number | null;
  upsId: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function ComputerLabPage() {
  const router = useRouter();
  const params = useParams<{ labno: string }>();
  const [desks, setDesks] = useState([]);
  const [selectedDesk, setSelectedDesk] = useState(null as Desk | null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDesks() {
      setLoading(true);
      try {
        const response = await fetch(`/api/getRoom?name=${params.labno}`);
        const data = await response.json();
        // console.log("Fetched desks:", data);
        setDesks(data);
      } catch (error) {
        console.error("Error fetching desks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDesks();
  }, [params.labno]);

  const handleDeskClick = (desk:Desk) => {
    setSelectedDesk(desk);
  };

  const handleCloseModal = () => {
    setSelectedDesk(null);
  };

  return (
    <div className="p-4 sm:p-6 mx-auto min-h-screen min-w-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm cursor-pointer"
          >
            &lt;&lt; back
          </button>
          <span className="hidden" />
        </div>
        <h1 className="text-3xl font-bold mb-6">
          {`Computer ${params.labno}`}
        </h1>
      </div>

      {/* Desk */}
      <div className="w-full max-w-7xl mx-auto p-4">
  <div className="rounded-xl border p-4 sm:p-6 lg:p-8">
   
    {loading ? (
      <div className="flex justify-center items-center py-20">
        <HashLoader size={60} />
      </div>
    ) : (
      <div className="grid grid-cols-3 gap-x-12 gap-y-8 justify-items-center">
        {Array.from({ length: Math.ceil(desks.length / 2) }).map((_, pairIndex) => (
          
          <div key={pairIndex} className="flex gap-3">
            {desks.slice(pairIndex * 2, pairIndex * 2 + 2).map((desk:Desk) => (
              <div key={desk.id} className="flex flex-col items-center gap-1">
                <div
                  onClick={() => handleDeskClick(desk)}
                  className={`h-16 w-16 rounded-md border border-gray-600 flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-200 active:scale-95`}
                >
                  <HiComputerDesktop className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">
                  {desk.deskNo}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

      {/* Desk Info Modal */}
      {selectedDesk && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl mb-3 text-center font-semibold text-white">
              {selectedDesk.deskNo} Information
            </h2>
            <DeskInfo  desk={selectedDesk} handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}
