
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

export default function BackButton(){

     const router = useRouter();

    return(
         <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 cursor-pointer"
        >
          <IoChevronBack />
         back
        </button>
    );
}