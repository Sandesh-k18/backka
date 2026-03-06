"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Loader2, Trash2, ShieldAlert, AlertTriangle, Lock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

export const DangerZone = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");

  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Password is required to delete account");
      return;
    }

    setIsDeleting(true);
    try {
      // Pass the password to the backend for verification before deletion
      await axios.delete("/api/auth/delete-account", {
        data: { password } 
      });

      toast.success("Account permanently removed");
      await signOut({ callbackUrl: "/sign-up" });
    } catch (error: any) {
      setIsDeleting(false);
      // Handle specific error messages from your backend (e.g., "Invalid password")
      toast.error(error.response?.data?.message || "Deletion Failed");
    }
  };

  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
      <div className="flex items-center gap-2 mb-4 text-red-600">
        <ShieldAlert className="h-5 w-5" />
        <h2 className="font-bold uppercase tracking-wider text-sm">Danger Zone</h2>
      </div>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Once you delete your account, there is no going back. All messages and data associated with your protocol will be permanently wiped.
      </p>
      
      <AlertDialog onOpenChange={() => setPassword("")}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full sm:w-auto font-bold uppercase text-xs tracking-widest px-8 shadow-sm hover:shadow-red-200 transition-all">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl border-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Final Security Check
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-2">
              <p>
                This action is <strong>irreversible</strong>. To confirm you want to delete everything, please enter your account password.
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="password"
                  placeholder="Enter your password..." 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-red-200 focus-visible:ring-red-500"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-full border-slate-200">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount} 
              disabled={!password || isDeleting}
              className="bg-red-600 hover:bg-red-700 rounded-full min-w-[140px]"
            >
              {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm Deletion"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};