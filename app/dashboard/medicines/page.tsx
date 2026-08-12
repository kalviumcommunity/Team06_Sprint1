import { redirect } from "next/navigation";

export default function DashboardMedicinesRedirect() {
  redirect("/medicines");
}
