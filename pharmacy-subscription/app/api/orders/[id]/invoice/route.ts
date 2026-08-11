import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUserId } from '@/lib/getAuthUserId';

function generatePdfBuffer(order: {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  items: { medicineName: string; quantity: number; unitPrice: number }[];
}): Buffer {
  const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const lines: string[] = [
    'BT',
    '/F1 20 Tf',
    '50 740 Td',
    '(PharmEasy - Order Invoice) Tj',
    '/F1 12 Tf',
    '0 -30 Td',
    `(${escapePdfText(`Order Number: ${order.orderNumber}`)}) Tj`,
    '0 -20 Td',
    `(${escapePdfText(`Date: ${dateStr}`)}) Tj`,
    '0 -20 Td',
    `(${escapePdfText(`Status: ${order.status}`)}) Tj`,
    '0 -20 Td',
    `(${escapePdfText(`Delivery Address: ${order.deliveryAddress}`)}) Tj`,
    '0 -35 Td',
    '/F1 14 Tf',
    '(Items Purchased:) Tj',
    '/F1 11 Tf',
    '0 -20 Td',
  ];

  order.items.forEach((item) => {
    const itemTotal = (item.quantity * item.unitPrice).toFixed(2);
    lines.push(
      `(${escapePdfText(`• ${item.medicineName}  |  Qty: ${item.quantity}  |  Price: Rs.${item.unitPrice}  |  Total: Rs.${itemTotal}`)}) Tj`,
      '0 -18 Td'
    );
  });

  lines.push(
    '0 -15 Td',
    '/F1 14 Tf',
    `(${escapePdfText(`Grand Total: Rs.${order.totalAmount.toFixed(2)}`)}) Tj`,
    '0 -40 Td',
    '/F1 10 Tf',
    '(Thank you for choosing PharmEasy Subscription System!) Tj',
    'ET'
  );

  const streamContent = lines.join('\n');
  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
377
%%EOF`;

  return Buffer.from(pdfString, 'utf-8');
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuthenticatedUserId();
  if (auth.error) return auth.error;
  const { userId } = auth;

  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        userId,
        OR: [{ id }, { orderNumber: id }],
      },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const pdfBuffer = generatePdfBuffer(order);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice PDF' },
      { status: 500 }
    );
  }
}
