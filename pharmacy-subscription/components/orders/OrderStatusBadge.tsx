import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

export default function OrderStatusBadge({ status }: Props) {
  if (status === "Paid") {
    return <Badge className="bg-green-600">Paid</Badge>;
  }

  if (status === "Pending") {
    return <Badge className="bg-yellow-500">Pending</Badge>;
  }

  return <Badge variant="destructive">Failed</Badge>;
}
