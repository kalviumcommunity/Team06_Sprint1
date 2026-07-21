'use client';

import { Download } from 'lucide-react';

interface DownloadInvoiceButtonProps {
  orderId: string;
  isLoading?: boolean;
  onClick: (orderId: string) => Promise<void> | void;
}

export default function DownloadInvoiceButton({
  orderId,
  isLoading = false,
  onClick,
}: DownloadInvoiceButtonProps) {
  return (
    <button
      onClick={() => onClick(orderId)}
      disabled={isLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 font-medium transition-all duration-200 ${
        isLoading
          ? 'cursor-not-allowed bg-gray-50 text-gray-400'
          : 'bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:scale-98'
      }`}
    >
      <Download size={18} />
      <span>{isLoading ? 'Downloading...' : 'Download Invoice'}</span>
    </button>
  );
}
