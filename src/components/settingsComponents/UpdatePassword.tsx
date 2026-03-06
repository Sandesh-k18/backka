"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { Loader2, Lock, ChevronDown } from "lucide-react";
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

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const UpdatePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
      await signOut({ callbackUrl: "/sign-in", redirect: true });
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.message || "Update Failed");
    }
  };

  return (
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
  );
};