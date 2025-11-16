"use client";
import { useRouter } from "next/navigation";
import { RiComputerLine } from "react-icons/ri";
import { PiComputerTower } from "react-icons/pi";
import { FiPrinter } from "react-icons/fi";
import { CiBatteryCharging } from "react-icons/ci";
import { TfiLayoutAccordionMerged } from "react-icons/tfi";
import { RiBookShelfLine } from "react-icons/ri";

type Item = {
  id: number;
  name: string;
  processor?: string;
  ram?: string;
  gpu?: string;
  hdd?: string;
  ssd?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface CardProps {
  title: string;
  items: Item[];
}

export default function SummaryCard({ title, items }: CardProps) {
  const router = useRouter();

  let Icon = RiComputerLine;

  if (title == "CPU") {
    Icon = PiComputerTower;
  } else if (title == "MONITOR") {
    Icon = RiComputerLine;
  } else if (title == "PRINTER") {
    Icon = FiPrinter;
  } else if (title == "UPS") {
    Icon = CiBatteryCharging;
  } else if (title == "ALMARI") {
    Icon = TfiLayoutAccordionMerged;
  } else if (title == "BOOKSHELF") {
    Icon = RiBookShelfLine;
  }

  const total = items.length;
  const issues = items.filter((item) => item.status != "working").length;
  const active = items.filter((item) => item.status == "working").length;

  function allitems() {
    router.push(`/items/${title.toLowerCase()}`);
  }

  return (
    <div
      onClick={allitems}
      className="
        card-surface 
        rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 
        shadow-sm border cursor-pointer 
        transition-all duration-200 ease-in-out 
        hover:shadow-md hover:-translate-y-1 
        flex flex-col ml-4
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl accent-bg/10 border border-[var(--border)]">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 accent" />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 text-xs sm:text-sm">
        <div className="muted-surface p-1.5 sm:p-2 rounded-lg text-center">
          <p className="muted-text text-xs">Total</p>
          <p className="font-medium text-sm sm:text-base">{total}</p>
        </div>

        <div className="muted-surface p-1.5 sm:p-2 rounded-lg text-center">
          <p className="muted-text text-xs">Active</p>
          <p className="font-medium text-sm sm:text-base">{active}</p>
        </div>

        <div className="muted-surface p-1.5 sm:p-2 rounded-lg text-center">
          <p className="muted-text text-xs">Issue</p>
          <p className="font-medium text-red-500 text-sm sm:text-base">
            {issues}
          </p>
        </div>
      </div>
    </div>
  );
}
