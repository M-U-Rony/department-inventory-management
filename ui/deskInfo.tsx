'use client';

import { useState } from "react";

interface DeskInfoProps {
  desk?: any;
 handleCloseModal: () => void;
}

interface Item {
  id: number;
  name: string;
}

export default function DeskInfo({ desk,handleCloseModal }: DeskInfoProps) {

    const [unassignedItems, setUnassignedItems] = useState<Item[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentItemType, setCurrentItemType] = useState('');

    // console.log("Desk info:", desk);            

    const handleAssign = async(item: string) => {
        try {
            setCurrentItemType(item);
            const data = await fetch(`/api/getUnassignedItems?item=${item}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const items = await data.json();
            setUnassignedItems(items);
            setShowModal(true);
            
        } catch (error) {
            console.error("Error fetching unassigned items:", error);
        }
    }

    const handleItemWithdraw = async (itemId: number,item: string) => {
        try {
            const response = await fetch(`/api/withdrawItem?item=${item}&id=${itemId}&deskId=${desk?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to withdraw item');
            }
            console.log(`Withdraw ${itemId} to desk ${desk?.id}`);
            handleCloseModal();

        } catch (error) {
            console.error("Error withdrawing item:", error);
        }
    }
    
    const handleItemAssignment = async (itemId: number) => {
        try {
            const response = await fetch(`/api/assignItem?item=${currentItemType}&id=${itemId}&deskId=${desk?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to assign item');
            }
            console.log(`Assigning ${itemId} to desk ${desk?.id}`);
            setShowModal(false);
            handleCloseModal();

        } catch (error) {
            console.error("Error assigning item:", error);
        }
    }


  return (
    <div className="text-gray-100">
      {/* Modal for Unassigned Items */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-md w-3xl h-96 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-center font-semibold">Available items</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {unassignedItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {unassignedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600"
                      onClick={() => handleItemAssignment(item.id)}
                    >
                    {item.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No items available</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Information */}

      {/* Monitor */}
      <div className="rounded-md p-4 mb-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-gray-400 text-sm">Monitor:</p>
            {desk?.monitorId == null ? (
              <button onClick={()=> handleAssign('monitor')} className="px-4 py-2 bg-gray-600 text-white rounded cursor-pointer">Assign</button>
            ) : (
              <div className="flex flex-col mt-1">
                <span className="px-2 py-0.5">Name: {desk.monitor.name}</span>
                <span className="px-2 py-0.5">Condition: {desk.monitor.status}</span>
                <button onClick={()=> handleItemWithdraw(desk.monitorId,'monitor')} className="px-4 py-2 bg-gray-600 text-red-400 rounded cursor-pointer">Withdraw</button>
              </div>
            )}
          </div>

          <div>
            <p className="text-gray-400 text-sm">CPU:</p>
            {desk?.cpuId == null ? (
              <button onClick={()=> handleAssign('cpu')} className="px-4 py-2 bg-gray-600 text-white rounded cursor-pointer">Assign</button>
            ) : (
              <div className="flex flex-col mt-1">
                <span className="px-2 py-0.5">Name: {desk.cpu.name}</span>
                <span className="px-2 py-0.5">Processor: {desk.cpu.processor}</span>
                <span className="px-2 py-0.5">Ram: {desk.cpu.ram}</span>
                <span className="px-2 py-0.5">SSD: {desk.cpu.ssd}</span>
                {desk.cpu.hdd? <span className="px-2 py-0.5">HDD: {desk.cpu.hdd}</span> : null}
                <span className="px-2 py-0.5">GPU:{desk.cpu.gpu}</span>
                <span className="px-2 py-0.5">Condition: {desk.cpu.status}</span>
                <button onClick={()=> handleItemWithdraw(desk.cpuId,'cpu')} className="px-4 py-2 bg-gray-600 text-red-400 rounded cursor-pointer">Withdraw</button>
              </div>
            )}
          </div>
         
        
        </div>
      </div>

    </div>
  );
}
