"use client";

import { HiComputerDesktop } from "react-icons/hi2";
import DeskInfo from "./deskInfo";
import BackButton from "../components/backButton";
import { Desk } from "../types/desk";

interface Lab2LayoutProps {
  desks: Desk[];
  selectedDesk: Desk | null;
  handleDeskClick: (desk: Desk) => void;
  handleCloseModal: () => void;
  params: { labno: string };
}

export default function Lab2Layout({
  desks,
  selectedDesk,
  handleDeskClick,
  handleCloseModal,
  params,
}: Lab2LayoutProps) {
  return (
    <div className="p-4 sm:p-6 mx-auto min-h-screen min-w-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold mb-6">
          {`Computer ${params.labno}`}
        </h1>
      </div>

      {/* Desk */}
      <div className="w-full min-w-[800px] mx-auto p-2 sm:p-4">
        <div className="rounded-xl border p-2 sm:p-4 lg:p-6 xl:p-8">
          <div className="grid grid-cols-3 gap-x-4 sm:gap-x-12 gap-y-3 sm:gap-y-8">
            {/* Left Column - 2 desks per row */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: Math.ceil(desks.length / 7) }).map(
                (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-3 justify-center">
                    {desks
                      .slice(rowIndex * 7, rowIndex * 7 + 7)
                      .slice(0, 2)
                      .map((desk: Desk) => (
                        <div
                          key={desk.id}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            onClick={() => handleDeskClick(desk)}
                            className={`min-h-[3.5rem] min-w-[3.5rem] h-16 w-16 rounded-md border border-gray-600 flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-200 active:scale-95 ${(desk.cpu?.status !== 'working' ||
                            desk.monitor?.status !== 'working' || desk.cpuId == null || desk.monitorId == null
                          )
                            ? 'text-red-400 border-red-400' : 'text-green-500 border-green-500'}`}
                          >
                            <HiComputerDesktop className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-medium">
                            {desk.deskNo}
                          </span>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>

            {/* Middle Column - 3 desks per row */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: Math.ceil(desks.length / 7) }).map(
                (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-3 justify-center">
                    {desks
                      .slice(rowIndex * 7, rowIndex * 7 + 7)
                      .slice(2, 5)
                      .map((desk: Desk) => (
                        <div
                          key={desk.id}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            onClick={() => handleDeskClick(desk)}
                            className={`min-h-[3.5rem] min-w-[3.5rem] h-16 w-16 rounded-md border border-gray-600 flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-200 active:scale-95 ${(desk.cpu?.status !== 'working' ||
                            desk.monitor?.status !== 'working' || desk.cpuId == null || desk.monitorId == null
                          )
                            ? 'text-red-400 border-red-400' : 'text-green-500 border-green-500'}`}
                          >
                            <HiComputerDesktop className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-medium">
                            {desk.deskNo}
                          </span>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>

            {/* Right Column - 2 desks per row */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: Math.ceil(desks.length / 7) }).map(
                (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-3 justify-center">
                    {desks
                      .slice(rowIndex * 7, rowIndex * 7 + 7)
                      .slice(5, 7)
                      .map((desk: Desk) => (
                        <div
                          key={desk.id}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            onClick={() => handleDeskClick(desk)}
                            className={`min-h-[3.5rem] min-w-[3.5rem] h-16 w-16 rounded-md border flex items-center justify-center hover:opacity-80 cursor-pointer transition-all duration-200 active:scale-95 ${(desk.cpu?.status !== 'working' ||
                            desk.monitor?.status !== 'working' || desk.cpuId == null || desk.monitorId == null
                          )
                            ? 'text-red-400 border-red-400' : 'text-green-500 border-green-500'}`}
                          >
                            <HiComputerDesktop className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-medium">
                            {desk.deskNo}
                          </span>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desk Info Modal */}
      {selectedDesk && (
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="w-full max-w-md card-surface rounded-xl p-5 sm:p-6 shadow-sm">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 muted-text hover:text-gray-200 text-lg sm:text-xl"
            >
              ✖
            </button>
            <h2 className="text-xl sm:text-2xl mb-3 text-center font-semibold pr-6">
              {selectedDesk.deskNo} Information
            </h2>
            <DeskInfo desk={selectedDesk} handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}
