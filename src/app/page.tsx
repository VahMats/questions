"use client"

import {useState} from "react";
import Link from "next/link";

export default function Home() {
    const [limit, setLimit] = useState(40);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col gap-8">
            <Link href={{
                pathname:"/questions",
                query: {limit}
            }} className="text-2xl font-bold bg-[#1c75a6] px-20 py-3 rounded-md text-white">
                ՍԿՍԵԼ ԹԵՍՏԱՎՈՐՈՒՄԸ
            </Link>
            <div className="flex flex-col gap-2">
                <p>Ընտրել հարցերի քանակը</p>
                <input type="number" className="bg-white text-black" value={limit} onChange={(e)=>{setLimit(Number(e.target.value))}} />
            </div>
        </div>
    </div>
  );
}
