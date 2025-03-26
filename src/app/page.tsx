"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className=" container flex flex-col mx-auto flex-grow ">
        <div className="my-auto flex justify-center gap-4">
          <Button>
            <Link href={"/kiosk"}>Kiosk</Link>
          </Button>
          <Button>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
