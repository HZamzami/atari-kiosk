import { NextApiRequest, NextApiResponse } from "next";
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const device = new escpos.USB(); // Automatically finds the printer
    const printer = new escpos.Printer(device);

    device.open(() => {
      printer.text("Bluetooth test\n\n").cut().close();
    });

    res.status(200).json({ message: "Print job sent" });
  } catch (err) {
    console.error("Print error:", err);
    res.status(500).json({ error: "Failed to print" });
  }
}
