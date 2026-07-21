import type { NextApiRequest, NextApiResponse } from "next";

const orders = [
  {
    id: "ORD-9821",
    date: "Jul 12, 2026",
    status: "Delivered",
    price: 166,
    address: "42 MG Road, Bengaluru - 560001",
    medicines: ["Metformin 500mg ×60", "Amlodipine 5mg ×30"],
  },
  {
    id: "ORD-9745",
    date: "Jun 15, 2026",
    status: "Delivered",
    price: 55,
    address: "42 MG Road, Bengaluru - 560001",
    medicines: ["Levothyroxine 50mcg ×30"],
  },
  {
    id: "ORD-9901",
    date: "Jul 14, 2026",
    status: "Processing",
    price: 96,
    address: "42 MG Road, Bengaluru - 560001",
    medicines: ["Vitamin D3 1000IU ×60", "Cetirizine 10mg ×30"],
  },
  {
    id: "ORD-9012",
    date: "Jul 08, 2026",
    status: "Cancelled",
    price: 72,
    address: "42 MG Road, Bengaluru - 560001",
    medicines: ["Ibuprofen 400mg ×20"],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(orders);
}
