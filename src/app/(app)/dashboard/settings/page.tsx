"use client";

import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { 
  Loader2, 
  ArrowLeft, 
  Trash2, 
  ShieldAlert, 
  ChevronDown, 
  Lock, 
  UserCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
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
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [confirmUsername, setConfirmUsername] = useState("");
  const targetUsername = (session?.user as any)?.username?.toLowerCase() || "";

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
  setIsSubmitting(true);
  try {
    await axios.post("/api/auth/change-password", {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    
    toast.success("Security updated. Please sign in again.");

    // Standard Sign Out without extra URL parameters
    await signOut({ 
      callbackUrl: "/sign-in", // Clean URL
      redirect: true 
    });

  } catch (error: any) {
    setIsSubmitting(false);
    toast.error(error.response?.data?.message || "Update Failed");
  }
};

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await axios.delete("/api/auth/delete-account");
      toast.success("Account permanently removed");
      await signOut({ callbackUrl: "/sign-up" });
    } catch (error: any) {
      setIsDeleting(false);
      toast.error("Deletion Failed");
    }
  };

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

      <div className="space-y-4">
        <button 
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
            <span className="font-semibold text-slate-700">Update Password</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${showPasswordForm ? 'rotate-180' : ''}`} />
        </button>

        {showPasswordForm && (
          <div className="p-4 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="currentPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="newPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl><Input type="password" placeholder="Min 6 chars" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Change Password"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>

      <Separator className="my-8" />

      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
        <div className="flex items-center gap-2 mb-4 text-red-600">
          <ShieldAlert className="h-5 w-5" />
          <h2 className="font-bold uppercase tracking-wider text-sm">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Once you delete your account, there is no going back. All messages sent to your protocol will be wiped.
        </p>
        
        <AlertDialog onOpenChange={() => setConfirmUsername("")}>
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
                Final Confirmation Required
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4 pt-2">
                <p>This action is <strong>irreversible</strong>. To proceed, please type your username <span className="text-slate-900 font-mono font-bold bg-slate-100 px-1 rounded">{targetUsername}</span> in lowercase below.</p>
                <Input 
                  placeholder="Type username here..." 
                  value={confirmUsername}
                  onChange={(e) => setConfirmUsername(e.target.value.toLowerCase())}
                  className="border-red-200 focus-visible:ring-red-500 lowercase"
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="rounded-full border-slate-200">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteAccount} 
                disabled={confirmUsername !== targetUsername || isDeleting}
                className="bg-red-600 hover:bg-red-700 rounded-full min-w-[140px]"
              >
                {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : "Delete Everything"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsPage;