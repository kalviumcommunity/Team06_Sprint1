import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";

export default function MedicinesPage() {
  return (
    <DashboardLayout title="Medicines">
      <div className="w-full space-y-6">
        <PageHeader title="Medicines" />
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]">
          <p className="text-slate-500 dark:text-slate-400">This page is under construction.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
