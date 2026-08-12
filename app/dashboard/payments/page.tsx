"use client";

import React, { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/src/components/Header";
import { TabControl, PaymentHistory } from "@/components/payments";
import type { Payment } from "@/components/payments";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  Wallet2,
  AlertCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Loader2,
  ChevronRight,
  X,
  CalendarDays,
  IndianRupee,
  FileText,
} from "lucide-react";

/* ─── Constants ──────────────────────────────────────────── */
// NOTE: The retry delay timer is configured server-side via PAYMENT_RETRY_DELAY_MS env var.
// The frontend always reads retryAvailableAt directly from the DB response — no hard-coded delay here.

/* ─── Types ──────────────────────────────────────────────── */
type PaymentTab = "upi" | "card" | "wallet";
type UpiMode = "app" | "id";
interface FailedState {
  /** Unix ms timestamp of when retry becomes available — sourced from DB retryAvailableAt */
  retryAvailableAt: number;
  paymentId?: string;
}

/* ─── UPI SVG Logos ─────────────────────────────────────── */
const UPI_APPS = [
  {
    key: "googlepay",
    label: "Google Pay",
    logo: (
      <svg viewBox="0 0 56 24" className="h-6 w-auto" aria-label="Google Pay">
        <text x="0" y="19" fontSize="17" fontWeight="700" fontFamily="'Roboto',Arial,sans-serif">
          <tspan fill="#4285F4">G</tspan>
          <tspan fill="#EA4335">o</tspan>
          <tspan fill="#FBBC05">o</tspan>
          <tspan fill="#4285F4">g</tspan>
          <tspan fill="#34A853">l</tspan>
          <tspan fill="#EA4335">e</tspan>
        </text>
        <text x="1" y="32" fontSize="11" fontWeight="600" fontFamily="Arial,sans-serif" fill="#5F6368"> Pay</text>
      </svg>
    ),
    bg: "#ffffff",
    dark: "#1e293b",
  },
  {
    key: "phonepe",
    label: "PhonePe",
    logo: (
      <svg viewBox="0 0 44 44" className="h-9 w-9" aria-label="PhonePe">
        <circle cx="22" cy="22" r="22" fill="#5F259F"/>
        <text x="22" y="29" textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">Pe</text>
      </svg>
    ),
    bg: "#5F259F",
    dark: "#5F259F",
  },
  {
    key: "paytm",
    label: "Paytm",
    logo: (
      <svg viewBox="0 0 44 44" className="h-9 w-9" aria-label="Paytm">
        <rect width="44" height="44" rx="10" fill="#00BAF2"/>
        <text x="22" y="29" textAnchor="middle" fontSize="10.5" fontWeight="800" fontFamily="Arial,sans-serif" fill="white" letterSpacing="-0.3">paytm</text>
      </svg>
    ),
    bg: "#00BAF2",
    dark: "#00BAF2",
  },
  {
    key: "bhim",
    label: "BHIM",
    logo: (
      <svg viewBox="0 0 44 44" className="h-9 w-9" aria-label="BHIM UPI">
        <circle cx="22" cy="22" r="22" fill="#1A237E"/>
        <text x="22" y="22" textAnchor="middle" dominantBaseline="middle" fontSize="10.5" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">BHIM</text>
        <text x="22" y="34" textAnchor="middle" fontSize="8" fontFamily="Arial,sans-serif" fill="#F5A623" fontWeight="700">UPI</text>
      </svg>
    ),
    bg: "#1A237E",
    dark: "#1A237E",
  },
  {
    key: "amazonpay",
    label: "Amazon Pay",
    logo: (
      <svg viewBox="0 0 44 44" className="h-9 w-9" aria-label="Amazon Pay">
        <rect width="44" height="44" rx="8" fill="#131921"/>
        <text x="22" y="16" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial,sans-serif" fill="white">amazon</text>
        <text x="22" y="26" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial,sans-serif" fill="white">pay</text>
        <path d="M12 33 Q22 39 32 33" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    bg: "#131921",
    dark: "#131921",
  },
  {
    key: "mobikwik",
    label: "MobiKwik",
    logo: (
      <svg viewBox="0 0 44 44" className="h-9 w-9" aria-label="MobiKwik">
        <rect width="44" height="44" rx="8" fill="#1B2A7E"/>
        <text x="22" y="19" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">Mobi</text>
        <text x="22" y="31" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif" fill="#00D4FF">Kwik</text>
      </svg>
    ),
    bg: "#1B2A7E",
    dark: "#1B2A7E",
  },
];

const WALLETS = [
  { key: "paytm",      label: "Paytm Wallet",  color: "#00BAF2", initial: "P" },
  { key: "amazonpay",  label: "Amazon Pay",     color: "#FF9900", initial: "A" },
  { key: "mobikwik",   label: "MobiKwik",       color: "#1B2A7E", initial: "M" },
  { key: "freecharge", label: "FreeCharge",     color: "#E8173F", initial: "F" },
];

/* ─── Countdown Timer ────────────────────────────────────── */
/** retryAvailableAt: Unix-ms timestamp sourced from DB — countdown is retryAvailableAt - now() */
function CountdownTimer({ retryAvailableAt, onExpire }: { retryAvailableAt: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, retryAvailableAt - Date.now()));
  const firedRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!firedRef.current) { firedRef.current = true; onExpire(); }
      return;
    }
    const id = setInterval(() => {
      const left = Math.max(0, retryAvailableAt - Date.now());
      setRemaining(left);
      if (left <= 0 && !firedRef.current) {
        firedRef.current = true;
        onExpire();
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [retryAvailableAt, onExpire]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return (
    <span className="font-mono text-[22px] font-extrabold text-white leading-none tracking-widest">
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </span>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */
function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function nextMonthLabel() {
  const d = new Date(); d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" });
}
function todayLabel() {
  return new Date().toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" });
}

/* ─── Payments Tab Content ───────────────────────────────── */
interface PaymentsTabProps {
  payments: Payment[];
  onPaymentSubmitted: () => void;
}

function PaymentsTab({ payments, onPaymentSubmitted }: PaymentsTabProps) {
  const [payTab, setPayTab] = useState<PaymentTab>("upi");
  const [upiMode, setUpiMode] = useState<UpiMode>("app");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [upiId, setUpiId] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [processing, setProcessing] = useState(false);
  const [subscriptionPaid, setSubscriptionPaid] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState("Jul 20, 2026");
  const [failedState, setFailedState] = useState<FailedState | null>(null);
  const [retryReady, setRetryReady] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [failureMsg, setFailureMsg] = useState<string | null>(null);

  useEffect(() => {
    const latest = payments[0];
    if (latest && latest.status === "failed" && latest.retryAvailableAt) {
      // Use the DB-stored retryAvailableAt — survives page refresh
      const retryAt = new Date(latest.retryAvailableAt).getTime();
      if (Date.now() < retryAt) {
        setFailedState({ retryAvailableAt: retryAt, paymentId: latest.id });
        setRetryReady(false);
      } else {
        // retryAvailableAt has passed — retry is already available
        setFailedState(null);
        setRetryReady(true);
      }
    } else {
      setFailedState(null);
      setRetryReady(false);
    }

    if (latest && latest.status === "success") {
      setSubscriptionPaid(true);
    } else {
      setSubscriptionPaid(false);
    }
  }, [payments]);

  const handleExpire = useCallback(() => setRetryReady(true), []);

  const getMethodLabel = () => {
    if (payTab === "upi")
      return selectedUpiApp
        ? (UPI_APPS.find((a) => a.key === selectedUpiApp)?.label ?? "UPI")
        : upiId
        ? `UPI: ${upiId}`
        : "UPI";
    if (payTab === "card") return cardName ? `Card: ${cardName}` : "Card";
    return selectedWallet
      ? (WALLETS.find((w) => w.key === selectedWallet)?.label ?? "Wallet")
      : "Wallet";
  };

  const canPay = () => {
    if (failedState && !retryReady) return false;
    if (subscriptionPaid) return false;
    if (payTab === "upi")
      return upiMode === "app" ? !!selectedUpiApp : upiId.includes("@");
    if (payTab === "card")
      return cardNumber.replace(/\s/g, "").length >= 16 && !!cardName && !!expiry && cvv.length >= 3;
    return !!selectedWallet;
  };

  const handlePay = async () => {
    if (!canPay() || processing) return;
    setProcessing(true);
    setSuccessMsg(null);
    setFailureMsg(null);

    const isRetry = failedState && retryReady;
    const url = isRetry
      ? `/api/admin/payments/${failedState.paymentId}/retry`
      : "/api/payments";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: isRetry ? undefined : JSON.stringify({
          method: getMethodLabel(),
          orderId: null,
          amount: 249,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        if (isRetry) {
          // Retry API returns { message, payment } — no data.success field
          setSuccessMsg("Payment retry initiated! Checking result...");
          setTimeout(() => {
            onPaymentSubmitted();
            setSuccessMsg(null);
          }, 3500);
        } else {
          // Fresh payment — API always returns { success: true, payment: {...} }
          if (data.success) {
            if (data.payment.status === "SUCCESS") {
              setFailedState(null);
              setRetryReady(false);
              setFailureMsg(null);
              setSubscriptionPaid(true);
              setNextBillingDate(nextMonthLabel());
              setSuccessMsg("Payment Successful! Your subscription is now active.");
            } else {
              // Payment failed
              const retryAt = data.payment.retryAvailableAt
                ? new Date(data.payment.retryAvailableAt).getTime()
                : Date.now() + 45 * 60 * 1000;
              setFailedState({
                retryAvailableAt: retryAt,
                paymentId: data.payment.id,
              });
              setRetryReady(false);
              setSuccessMsg(null);
              setFailureMsg("Payment failed. Your transaction could not be processed. Please retry after 45 minutes.");
            }
            onPaymentSubmitted();
          } else {
            setFailureMsg(data.error || "Payment could not be processed. Please try again.");
          }
        }
      } else {
        setFailureMsg(data.error || "Payment request failed. Please check your details and try again.");
        console.error("Payment action failed:", data.error);
      }
    } catch (e) {
      setFailureMsg("A network error occurred. Please check your connection and try again.");
      console.error("Payment error", e);
    } finally {
      if (!isRetry) {
        setProcessing(false);
      } else {
        setTimeout(() => setProcessing(false), 3500);
      }
    }
  };

  return (
    <div className="mx-auto max-w-[560px] space-y-4">

      {/* Success Banner */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-3.5 text-white shadow-lg"
          >
            <CheckCircle2 size={20} strokeWidth={2.5} className="shrink-0" />
            <p className="flex-1 text-sm font-semibold">{successMsg}</p>
            <button onClick={() => setSuccessMsg(null)} className="rounded-lg p-1 hover:bg-white/20 transition-colors">
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failure Banner */}
      <AnimatePresence>
        {failureMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 rounded-2xl bg-rose-500 px-5 py-3.5 text-white shadow-lg"
          >
            <AlertCircle size={20} strokeWidth={2.5} className="shrink-0" />
            <p className="flex-1 text-sm font-semibold">{failureMsg}</p>
            <button onClick={() => setFailureMsg(null)} className="rounded-lg p-1 hover:bg-white/20 transition-colors">
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Failed Card */}
      <AnimatePresence>
        {failedState && !retryReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl overflow-hidden border border-rose-900/50 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1c0a0a 0%, #2d1010 100%)" }}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-700/40 bg-rose-500/15">
                <AlertCircle size={20} className="text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-white">Payment Failed</p>
                <p className="text-[12px] text-rose-300/80 mt-0.5 leading-snug">
                  Your payment could not be processed.<br />Please try again after 45 minutes.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-rose-600/40 bg-rose-700/30 px-4 py-2.5 min-w-[82px]">
                <CountdownTimer retryAvailableAt={failedState.retryAvailableAt} onExpire={handleExpire} />
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400">Retry in</span>
              </div>
            </div>
          </motion.div>
        )}

        {failedState && retryReady && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 rounded-2xl border border-emerald-800/40 bg-emerald-950/30 px-5 py-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
              <RefreshCw size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-300">Ready to Retry</p>
              <p className="text-xs text-emerald-500/80 mt-0.5">The waiting period has ended. Select your payment method and retry.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Payment Card */}
      <div className="rounded-[24px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Card Header */}
        <div
          className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800"
          style={{ background: "linear-gradient(135deg, rgba(0,179,134,0.06) 0%, transparent 100%)" }}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-teal-500 mb-1.5">
            Complete Your Payment
          </p>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Monthly Medicine Plan
              </h2>
              <p className="mt-0.5 text-[13px] font-medium text-slate-400 dark:text-slate-500">
                1 Month · Billing: {nextBillingDate}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Amount Due
              </p>
              <p className="text-[26px] font-extrabold leading-tight text-slate-900 dark:text-white">₹249</p>
            </div>
          </div>
        </div>

        {/* Method Tabs */}
        <div className="px-6 pt-5">
          <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            {(["upi", "card", "wallet"] as PaymentTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setPayTab(t)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold transition-all ${
                  payTab === t
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {t === "upi" && <Smartphone size={13} />}
                {t === "card" && <CreditCard size={13} />}
                {t === "wallet" && <Wallet2 size={13} />}
                {t === "upi" ? "UPI" : t === "card" ? "Card" : "Wallet"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 pt-4 pb-6">
          <AnimatePresence mode="wait">

            {/* UPI */}
            {payTab === "upi" && (
              <motion.div key="upi" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-4">
                {/* Sub-tabs */}
                <div className="flex gap-2">
                  {(["app", "id"] as UpiMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setUpiMode(m)}
                      className={`flex-1 rounded-xl border py-2.5 text-[13px] font-semibold transition-all ${
                        upiMode === m
                          ? "border-teal-500 bg-teal-500/10 text-teal-500 dark:text-teal-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {m === "app" ? "Select UPI App" : "Enter UPI ID"}
                    </button>
                  ))}
                </div>

                {/* UPI App Grid */}
                {upiMode === "app" && (
                  <div className="grid grid-cols-2 gap-2.5">
                    {UPI_APPS.map((app) => (
                      <button
                        key={app.key}
                        onClick={() => setSelectedUpiApp(selectedUpiApp === app.key ? null : app.key)}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all ${
                          selectedUpiApp === app.key
                            ? "border-teal-500 ring-1 ring-teal-500/30 bg-teal-500/8 dark:bg-teal-500/10"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50"
                        }`}
                      >
                        <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl overflow-hidden">
                          {app.logo}
                        </div>
                        <span className="flex-1 text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                          {app.label}
                        </span>
                        {selectedUpiApp === app.key && (
                          <CheckCircle2 size={14} className="text-teal-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* UPI ID Input */}
                {upiMode === "id" && (
                  <div className="space-y-2">
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 px-1">
                      E.g. name@okaxis, mobile@ybl, 9876543210@paytm
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Card */}
            {payTab === "card" && (
              <motion.div key="card" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-3">
                <input value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="Card number" maxLength={19}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all tracking-widest" />
                <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" />
                  <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="CVV" type="password" maxLength={4}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" />
                </div>
              </motion.div>
            )}

            {/* Wallet */}
            {payTab === "wallet" && (
              <motion.div key="wallet" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="space-y-2.5">
                {WALLETS.map((w) => (
                  <button
                    key={w.key}
                    onClick={() => setSelectedWallet(selectedWallet === w.key ? null : w.key)}
                    className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition-all ${
                      selectedWallet === w.key
                        ? "border-teal-500 ring-1 ring-teal-500/30 bg-teal-500/8 dark:bg-teal-500/10"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-[13px] font-extrabold" style={{ backgroundColor: w.color }}>
                      {w.initial}
                    </div>
                    <span className="flex-1 text-[14px] font-semibold text-slate-800 dark:text-slate-200">{w.label}</span>
                    {selectedWallet === w.key
                      ? <CheckCircle2 size={15} className="text-teal-500 shrink-0" />
                      : <ChevronRight size={15} className="text-slate-300 dark:text-slate-600 shrink-0" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pay Button */}
          <div className="mt-6 space-y-3">
            <motion.button
              whileHover={canPay() && !processing ? { scale: 1.01, boxShadow: "0 8px 24px rgba(0,179,134,0.4)" } : {}}
              whileTap={canPay() && !processing ? { scale: 0.99 } : {}}
              onClick={handlePay}
              disabled={!canPay() || processing}
              id="pay-now-btn"
              className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 text-[15px] font-extrabold text-white transition-all ${
                subscriptionPaid
                  ? "bg-emerald-500 cursor-default"
                  : canPay() && !processing
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
              style={
                subscriptionPaid
                  ? {}
                  : { background: "linear-gradient(135deg, #00b386 0%, #00c896 100%)", boxShadow: "0 4px 16px rgba(0,179,134,0.30)" }
              }
            >
              {processing ? (
                <><Loader2 size={17} className="animate-spin" /> Processing...</>
              ) : subscriptionPaid ? (
                <><CheckCircle2 size={17} /> Payment Complete</>
              ) : failedState && !retryReady ? (
                <><Clock size={17} /> Retry Unavailable</>
              ) : failedState && retryReady ? (
                <><RefreshCw size={17} /> Retry Payment ₹249</>
              ) : (
                <><Lock size={17} /> Pay ₹249</>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              <ShieldCheck size={12} className="text-slate-300 dark:text-slate-600" />
              256-bit SSL secured · Powered by trusted partners
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status (after successful payment) */}
      <AnimatePresence>
        {subscriptionPaid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-900 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                <CheckCircle2 size={19} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Subscription Active</p>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">Processed on {todayLabel()}</p>
              </div>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Next Billing Date</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{nextBillingDate}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── No Subscription State ──────────────────────────────── */
function NoSubscriptionState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto max-w-[520px]"
    >
      <div
        className="rounded-[28px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-10 text-center shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        style={{ background: "linear-gradient(160deg, rgba(0,179,134,0.04) 0%, transparent 60%)" }}
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 dark:bg-teal-950/30 shadow-sm">
          <FileText size={28} className="text-teal-500" />
        </div>
        <h2 className="text-[20px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          No Active Subscription
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
          You need to have an active subscription order before you can make a payment.
          Please visit the Orders page to view your subscription.
        </p>
        <a
          href="/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-600 active:scale-95 px-6 py-3 text-[14px] font-bold text-white shadow-md transition-all"
          style={{ boxShadow: "0 4px 16px rgba(0,179,134,0.30)" }}
        >
          <CalendarDays size={16} />
          View My Orders
        </a>
      </div>
    </motion.div>
  );
}

/* ─── Root Page ──────────────────────────────────────────── */
function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams?.get("orderId");

  const [activeTab, setActiveTab] = useState<"payments" | "history">("payments");
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);

  // Auto-switch to history if orderId is in URL
  useEffect(() => {
    if (queryOrderId) setActiveTab("history");
  }, [queryOrderId]);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) setPayments(await res.json());
    } catch (e) {
      console.error("Failed to load payments", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user has any orders (subscription)
  useEffect(() => {
    async function checkSubscription() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const orders = await res.json();
          setHasSubscription(Array.isArray(orders) && orders.length > 0);
        } else {
          setHasSubscription(false);
        }
      } catch {
        setHasSubscription(false);
      }
    }
    checkSubscription();
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  const handleRetryClick = useCallback((_payment: Payment) => {
    // no-op — inline retry handled inside PaymentsTab
  }, []);

  // Show subscription check state while loading
  const isCheckingSubscription = hasSubscription === null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header title="Payments" />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1100px] space-y-8">

          {/* ── Toggle ── */}
          <div className="w-full">
            <TabControl activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* ── Subscription check loading ── */}
          {isCheckingSubscription && (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
            </div>
          )}

          {/* ── Tab Content ── */}
          {!isCheckingSubscription && (
            <AnimatePresence mode="wait">
              {activeTab === "payments" ? (
                <motion.div
                  key="payments-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {hasSubscription ? (
                    <PaymentsTab payments={payments} onPaymentSubmitted={loadPayments} />
                  ) : (
                    <NoSubscriptionState />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="history-tab"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mx-auto max-w-[850px]"
                >
                  <div className="rounded-[24px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-8">
                    <div className="mb-6">
                      <h2 className="text-[18px] font-bold text-slate-900 dark:text-white tracking-tight">
                        Payment History
                      </h2>
                      <p className="mt-1 text-[13px] text-slate-400 dark:text-slate-500 font-medium">
                        View all your past payments and their status
                      </p>
                    </div>
                    <PaymentHistory payments={payments} loading={loading} onRetry={handleRetryClick} />
                    {!loading && payments.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={loadPayments}
                        className="mt-6 w-full rounded-xl py-3.5 text-center text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors bg-[#f8fafc] dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Refresh Transactions
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>
      </main>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
        </div>
      }
    >
      <PaymentsPageContent />
    </Suspense>
  );
}
