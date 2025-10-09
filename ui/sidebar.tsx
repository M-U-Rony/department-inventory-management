import { useRouter } from "next/navigation";
import { useState } from "react";

interface Lab {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default function Sidebar({ labs }: { labs: Lab[] }) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [labName, setLabName] = useState("");


  function handleSave() {

    if(labName.trim()) {
      async function saveLab() {
    
          setShowInput(false);
          setLabName("");
          try {
            await fetch('/api/createRoom', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: labName }),
            });
        } catch (error) {
            console.error('Error creating lab:', error);
          }
    }

    saveLab();
    }  
}

  return (
    <div className="p-4 w-64 min-h-screen">
      {/* Spaces Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold">Spaces</h2>
      </div>

      {/* Computer-Lab Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-3 py-2 rounded">
          <span>Computer-Lab</span>
          <div className="flex gap-2">
            <button
              className="px-2 rounded cursor-pointer"
              onClick={()=> setShowInput(true)}
            >
              +
            </button>
          </div>
        </div>

        {showInput && (
          <div className="mt-2">
            <input
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              className="w-full px-3 py-2 rounded"
              placeholder="Enter lab name"
            />
            <button
              className="mt-2 px-3 py-2 rounded "
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="mt-2 px-3 py-2 rounded ml-2"
              onClick={() => {
                setShowInput(false);
                setLabName("");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Lab List */}
        {labs.length>0 && labs.map((lab,i:number) => (
          <div
            key={i}
            onClick={() => router.push(`/computer-lab/${lab.name}`)}
            className="flex justify-between items-center px-3 py-2 rounded cursor-pointer"
          >
            <span>{lab.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
