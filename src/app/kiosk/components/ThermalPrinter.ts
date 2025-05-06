// components/PrintTrigger.tsx or inside a page component

import { useEffect } from "react";

export default function PrintTrigger() {
  useEffect(() => {
    const sendPrintJob = async () => {
      try {
        const res = await fetch("/api/printer", {
          method: "POST", // or GET, depending on your API route
        });

        const data = await res.json();
        console.log("Print Response:", data);
      } catch (error) {
        console.error("Error sending print job:", error);
      }
    };

    sendPrintJob();
  }, []);
}
