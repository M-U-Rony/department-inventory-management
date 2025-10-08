"use client";

import { useState,useEffect} from "react";
import { useRouter,useParams } from "next/navigation";
import ItemsDashboard from "../../../ui/itemsDashboard";
import AddItemsForm from "../../../ui/addItemsForm";


export default function ManageItems() {
  const [showForm, setShowForm] = useState(false);
  const [items, setitems] = useState([])
  const router = useRouter();
  const params = useParams<{ manage: string }>();


  useEffect(()=>{

    async function fetchdata(){

      const res = await fetch(`/api/getItems?item=${params.manage}`,{
        method: 'GET',
        headers: {
          contentType: 'application/json'

        }
      })

      const data = await res.json();

      setitems(data);
    }

    fetchdata();


  },[])


  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-6 cursor-pointer"
        >
         &lt; back
        </button>
      </div>
      {showForm ? <AddItemsForm onClose={() => setShowForm(false)}  title={params.manage}/> : null}

      <ItemsDashboard items={items} onAdd={() => setShowForm(true)} />
    </div>
  );
}
