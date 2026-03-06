"use client";

import { useSession } from "next-auth/react";
import { Loader2, ArrowLeft, UserCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";

import { UpdatePassword } from "@/src/components/settingsComponents/UpdatePassword";
import { DangerZone } from "@/src/components/settingsComponents/DangerZone";

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const targetUsername = (session?.user as any)?.username?.toLowerCase() || "";

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
    </div>
  );

  return (
    <div className="container mx-auto my-8 p-4 md:p-6 bg-white rounded-2xl shadow-sm max-w-2xl min-h-[80vh] border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Settings</h1>
      </div>

      {/* Profile Info Section */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <UserCircle className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Account Username</p>
            <p className="font-bold text-slate-900">{targetUsername}</p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Logic split into specific components */}
      <UpdatePassword />

      <Separator className="my-8" />

      {/* Danger Zone Component - Password Protected */}
      <DangerZone />
    </div>
  );
};

export default SettingsPage;