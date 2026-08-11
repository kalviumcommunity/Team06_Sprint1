"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CreditCard, Wallet, ChevronRight, Loader2, ShieldCheck, Lock } from "lucide-react";
import type { SelectedPaymentMethod, UpiApp, WalletOption, CardBrand } from "./types";

/* ─── helpers ─────────────────────────────────────────────── */
function detectCardBrand(number: string): CardBrand {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(n)) return "mastercard";
  if (/^6[0-9]{15}$/.test(n) || /^508[5-9]|^603[5-9]/.test(n)) return "rupay";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}
function formatCardNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

const UPI_APPS: { key: UpiApp; label: string; color: string; initial: string }[] = [
  { key: "googlepay", label: "Google Pay", color: "#4285F4", initial: "G" },
  { key: "phonepe",   label: "PhonePe",   color: "#6739B7", initial: "Ph" },
  { key: "paytm",     label: "Paytm",     color: "#00BAF2", initial: "Pt" },
  { key: "bhim",      label: "BHIM",      color: "#138808", initial: "B" },
];
const WALLETS: { key: WalletOption; label: string; color: string; initial: string }[] = [
  { key: "paytm",     label: "Paytm Wallet", color: "#00BAF2", initial: "P" },
  { key: "amazonpay", label: "Amazon Pay",   color: "#FF9900", initial: "A" },
  { key: "mobikwik",  label: "MobiKwik",     color: "#ED1C24", initial: "M" },
];
const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda",
  "Canara Bank", "Union Bank of India", "Yes Bank",
];
const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  visa: "Visa", mastercard: "Mastercard", rupay: "RuPay", amex: "Amex", unknown: "",
};
const BRAND_COLORS: Record<CardBrand, string> = {
  visa: "#1A1F71", mastercard: "#EB001B", rupay: "#1b6fb5", amex: "#007BC1", unknown: "#94a3b8",
};

type ModalTab = "upi" | "card" | "wallet";

interface PaymentModalProps {
  open: boolean;
  amount: number;
  subscriptionName: string;
  planName: string;
  billingDate: string;
  initialMethod?: SelectedPaymentMethod | null;
  onSubmit: (method: SelectedPaymentMethod) => void;
  onClose: () => void;
  processing: boolean;
}

export default function PaymentModal({
  open, amount, subscriptionName, planName, billingDate,
  initialMethod, onSubmit, onClose, processing,
}: PaymentModalProps) {
  const [tab, setTab] = useState<ModalTab>("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<UpiApp | null>(null);
  const [upiId, setUpiId] = useState("");
  const [upiMode, setUpiMode] = useState<"app" | "id">("app");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardBrand, setCardBrand] = useState<CardBrand>("unknown");
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (initialMethod) {
      setTab(initialMethod.category === "upi" ? "upi" : initialMethod.category === "card" ? "card" : "wallet");
      if (initialMethod.upiApp) { setSelectedUpiApp(initialMethod.upiApp); setUpiMode("app"); }
      if (initialMethod.upiId)  { setUpiId(initialMethod.upiId); setUpiMode("id"); }
      if (initialMethod.walletOption) setSelectedWallet(initialMethod.walletOption);
    }
  }, [open, initialMethod]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !processing) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, processing]);

  const handleCardNumber = useCallback((val: string) => {
    const formatted = formatCardNumber(val);
    setCardNumber(formatted);
    setCardBrand(detectCardBrand(formatted));
  }, []);

  const buildMethod = useCallback((): SelectedPaymentMethod | null => {
    setError("");
    if (tab === "upi") {
      if (upiMode === "app") {
        if (!selectedUpiApp) { setError("Please select a UPI app."); return null; }
        const app = UPI_APPS.find((a) => a.key === selectedUpiApp)!;
        return { category: "upi", upiApp: selectedUpiApp, displayLabel: app.label };
      } else {
        if (!upiId.trim()) { setError("Please enter your UPI ID."); return null; }
        if (!/^[\w.\-+]+@[a-zA-Z]+$/.test(upiId.trim())) { setError("Invalid UPI ID format. e.g. name@oksbi"); return null; }
        return { category: "upi", upiId: upiId.trim(), displayLabel: `UPI (${upiId.trim()})` };
      }
    }
    if (tab === "card") {
      const clean = cardNumber.replace(/\s/g, "");
      if (clean.length < 16) { setError("Please enter a valid 16-digit card number."); return null; }
      if (!cardName.trim())  { setError("Please enter the cardholder name."); return null; }
      if (expiry.length < 5) { setError("Please enter a valid expiry date (MM/YY)."); return null; }
      if (cvv.length < 3)    { setError("Please enter a valid CVV."); return null; }
      const last4 = clean.slice(-4);
      const brandLabel = cardBrand !== "unknown" ? CARD_BRAND_LABELS[cardBrand] : "Card";
      return { category: "card", cardLast4: last4, cardBrand, displayLabel: `${brandLabel} ••••${last4}` };
    }
    if (tab === "wallet") {
      if (selectedWallet) {
        const w = WALLETS.find((w) => w.key === selectedWallet)!;
        return { category: "wallet", walletOption: selectedWallet, displayLabel: w.label };
      }
      if (selectedBank) {
        return { category: "wallet", netBankingBank: selectedBank, displayLabel: `Net Banking (${selectedBank})` };
      }
      setError("Please select a wallet or bank.");
      return null;
    }
    return null;
  }, [tab, upiMode, selectedUpiApp, upiId, cardNumber, cardName, expiry, cvv, cardBrand, selectedWallet, selectedBank]);

  const handleSubmit = useCallback(() => {
    const method = buildMethod();
    if (!method) return;
    onSubmit(method);
  }, [buildMethod, onSubmit]);

  const tabBtnCls = (t: ModalTab) =>
    `flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
      tab === t
        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
    }`;

  const inputCls = "w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/40 font-medium";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)" }}
          onClick={() => { if (!processing) onClose(); }}
        >
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 28 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-md rounded-[28px] bg-white dark:bg-slate-900 shadow-2xl my-auto border border-slate-100 dark:border-slate-700/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            {!processing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                aria-label="Close payment modal"
              >
                <X size={15} className="text-slate-500 dark:text-slate-400" />
              </motion.button>
            )}

            {/* Header */}
            <div className="rounded-t-[28px] px-6 pt-6 pb-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-b border-emerald-100 dark:border-emerald-900/40">
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Complete Your Payment</p>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{subscriptionName}</h2>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{planName} · Billing: {billingDate}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">Amount Due</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">₹{amount}</p>
                </div>
              </div>
            </div>

            {/* Tab selector */}
            <div className="px-6 pt-5">
              <div className="flex rounded-xl p-1 gap-1 bg-slate-100 dark:bg-slate-800">
                <button className={tabBtnCls("upi")}    onClick={() => setTab("upi")}    disabled={processing} id="modal-tab-upi"><Smartphone size={14} /> UPI</button>
                <button className={tabBtnCls("card")}   onClick={() => setTab("card")}   disabled={processing} id="modal-tab-card"><CreditCard size={14} /> Card</button>
                <button className={tabBtnCls("wallet")} onClick={() => setTab("wallet")} disabled={processing} id="modal-tab-wallet"><Wallet size={14} /> Wallet</button>
              </div>
            </div>

            {/* Tab content */}
            <div className="px-6 pt-5 pb-2 min-h-[220px]">
              <AnimatePresence mode="wait">
                {/* UPI */}
                {tab === "upi" && (
                  <motion.div key="upi" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} transition={{ duration:0.18 }}>
                    <div className="flex gap-2 mb-4">
                      {(["app","id"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setUpiMode(m)}
                          disabled={processing}
                          className={`flex-1 rounded-xl border py-2 text-[12px] font-bold transition-all cursor-pointer ${
                            upiMode === m
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                              : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
                          }`}
                        >
                          {m === "app" ? "Select UPI App" : "Enter UPI ID"}
                        </button>
                      ))}
                    </div>
                    {upiMode === "app" ? (
                      <div className="grid grid-cols-2 gap-2.5">
                        {UPI_APPS.map((app) => (
                          <motion.button
                            key={app.key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedUpiApp(app.key)}
                            disabled={processing}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer ${
                              selectedUpiApp === app.key
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                                : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600"
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-extrabold" style={{ backgroundColor: app.color }}>
                              {app.initial}
                            </div>
                            <span className={`text-[13px] font-semibold ${selectedUpiApp === app.key ? "text-emerald-800 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"}`}>
                              {app.label}
                            </span>
                            {selectedUpiApp === app.key && (
                              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} className="ml-auto">
                                <div className="h-4 w-4 rounded-full flex items-center justify-center bg-teal-500">
                                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">UPI ID</label>
                        <input type="text" placeholder="name@oksbi" value={upiId} onChange={(e) => setUpiId(e.target.value)} disabled={processing} className={inputCls} id="upi-id-input" />
                        <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">Example: mobilenumber@paytm, name@oksbi</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* CARD */}
                {tab === "card" && (
                  <motion.div key="card" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} transition={{ duration:0.18 }} className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Card Number</label>
                        {cardBrand !== "unknown" && (
                          <motion.span initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} className="text-[11px] font-bold rounded-md px-2 py-0.5" style={{ backgroundColor: BRAND_COLORS[cardBrand] + "20", color: BRAND_COLORS[cardBrand] }}>
                            {CARD_BRAND_LABELS[cardBrand]}
                          </motion.span>
                        )}
                      </div>
                      <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={(e) => handleCardNumber(e.target.value)} disabled={processing} maxLength={19} className={`${inputCls} font-mono`} id="card-number-input" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Cardholder Name</label>
                      <input type="text" placeholder="As on card" value={cardName} onChange={(e) => setCardName(e.target.value)} disabled={processing} className={inputCls} id="card-name-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Expiry</label>
                        <input type="text" inputMode="numeric" placeholder="MM / YY" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} disabled={processing} maxLength={5} className={`${inputCls} font-mono`} id="card-expiry-input" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">CVV</label>
                        <input type="password" inputMode="numeric" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g,"").slice(0,4))} disabled={processing} maxLength={4} className={`${inputCls} font-mono`} id="card-cvv-input" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* WALLET */}
                {tab === "wallet" && (
                  <motion.div key="wallet" initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} transition={{ duration:0.18 }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Digital Wallets</p>
                    <div className="space-y-2 mb-5">
                      {WALLETS.map((w) => (
                        <motion.button
                          key={w.key}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => { setSelectedWallet(w.key); setSelectedBank(""); }}
                          disabled={processing}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all cursor-pointer ${
                            selectedWallet === w.key
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                              : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600"
                          }`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-[11px] font-extrabold" style={{ backgroundColor: w.color }}>{w.initial}</div>
                          <span className={`flex-1 text-[13px] font-semibold ${selectedWallet === w.key ? "text-emerald-800 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"}`}>{w.label}</span>
                          {selectedWallet === w.key ? (
                            <motion.div initial={{ scale:0 }} animate={{ scale:1 }}>
                              <div className="h-4 w-4 rounded-full flex items-center justify-center bg-teal-500">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              </div>
                            </motion.div>
                          ) : (
                            <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Net Banking</p>
                    <select
                      value={selectedBank}
                      onChange={(e) => { setSelectedBank(e.target.value); setSelectedWallet(null); }}
                      disabled={processing}
                      className={`${inputCls} cursor-pointer`}
                      id="net-banking-select"
                    >
                      <option value="">Select your bank</option>
                      {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  className="mx-6 mt-2 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-[12px] font-semibold text-rose-600 dark:text-rose-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="px-6 pt-4 pb-6">
              <motion.button
                whileHover={!processing ? { scale: 1.01, boxShadow: "0 6px 20px rgba(0,179,134,0.3)" } : {}}
                whileTap={!processing ? { scale: 0.99 } : {}}
                onClick={handleSubmit}
                disabled={processing}
                className="w-full rounded-2xl py-4 text-sm font-extrabold text-white transition-all cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: processing ? "linear-gradient(135deg, #86efac 0%, #6ee7b7 100%)" : "linear-gradient(135deg, #00b386 0%, #00c896 100%)",
                  boxShadow: processing ? "none" : "0 4px 14px rgba(0,179,134,0.35)",
                }}
                id="pay-now-submit"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
                      <Loader2 size={18} />
                    </motion.div>
                    Processing Payment...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock size={14} />
                    Pay ₹{amount}
                  </span>
                )}
              </motion.button>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-slate-400 dark:text-slate-500">
                <ShieldCheck size={13} strokeWidth={2.5} />
                <span className="text-[11px] font-semibold">256-bit SSL secured · Powered by trusted partners</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
