'use client';
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

export default function SummaryCard({ title, items}: CardProps) {

  // console.log(items);

  const router = useRouter();

  let Icon = RiComputerLine;

  if(title == 'CPU'){
    Icon = PiComputerTower;
  }

  else if(title == 'MONITOR'){
    Icon = RiComputerLine;
  }
  else if(title == 'PRINTER'){
    Icon = FiPrinter;
  }
  else if(title == 'UPS'){
    Icon = CiBatteryCharging;
  }
   else if(title == 'ALMARI'){
    Icon = TfiLayoutAccordionMerged;
  }
   else if(title == 'BOOKSHELF'){
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
        rounded-2xl p-5 sm:p-6 
        shadow-sm border cursor-pointer 
        transition-all duration-200 ease-in-out 
        hover:shadow-md hover:-translate-y-1 
        flex flex-col
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl accent-bg/10 border border-[var(--border)]">
            <Icon className="w-5 h-5 accent" />
          </div>
          <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        <div className="muted-surface p-2 rounded-lg text-center">
          <p className="muted-text text-xs">Total</p>
          <p className="font-medium">{total}</p>
        </div>

        <div className="muted-surface p-2 rounded-lg text-center">
          <p className="muted-text text-xs">Active</p>
          <p className="font-medium">{active}</p>
        </div>

        <div className="muted-surface p-2 rounded-lg text-center">
          <p className="muted-text text-xs">Issue</p>
          <p className="font-medium text-red-500">{issues}</p>
        </div>
      </div>
    </div>
  );
}
