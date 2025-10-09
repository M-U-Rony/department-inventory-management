'use client';
import { useRouter } from "next/navigation";


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

  console.log(items);

  const router = useRouter();

  function allitems() {
    router.push(`/items/${title.toLowerCase()}`);
  }


  return (
    <div className="p-4 rounded-xl shadow-md max-w-sm cursor-pointer" onClick={allitems}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm">Total: {items.length}</span>
      </div>

      <div className="mt-3 text-sm space-y-1">
        <p>Issue: <span className="font-medium">{items.filter(item => item.status === 'not working').length}</span></p>
    
      </div>
    </div>
  );
}
