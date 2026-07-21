import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import OrderStatusBadge from "./OrderStatusBadge";

interface Order {
  id: string;
  medicine: string;
  quantity: number;
  amount: number;
  status: string;
  nextRefill: string;
}

interface Props {
  orders: Order[];
}

export default function OrderTable({ orders }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Medicine</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Next Refill</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.medicine}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>₹{order.amount}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell>{order.nextRefill}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}