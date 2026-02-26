"use client"

import MessageCard from "@/src/components/pageComponents/MessageCard"
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
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
} from "@/src/components/ui/alert-dialog"; // Import Shadcn Alert Dialog
import { Message, User } from "@/src/model/User";
import { acceptingMessageSchema } from "@/src/schemas/acceptMessageSchema";
import { ApiResponse } from "@/src/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema)
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      toast.error("Failed to fetch message settings");
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Refreshed messages");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch messages", {
        description: axiosError.response?.data.message
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitching(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update message settings");
    } finally {
      setIsSwitching(false);
    }
  };

  // UPDATED: No more window.confirm, logic stays the same
  const handleClearAll = async () => {
    setIsDeletingAll(true);
    try {
      const response = await axios.delete<ApiResponse>("/api/delete-all-messages");
      if (response.data.success) {
        setMessages([]); 
        toast.success("All messages cleared");
      }
    } catch (error) {
      toast.error("Failed to clear messages");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = session?.user ? `${baseUrl}/u/${(session.user as User).username}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied!");
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        Please sign in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-4 md:p-6 bg-white rounded shadow-sm max-w-6xl min-h-[80vh]">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900">User Dashboard</h1>

      {/* Copy Link Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Copy Your Unique Link</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered flex-grow p-2 bg-gray-50 rounded border text-sm overflow-hidden text-ellipsis"
          />
          <Button onClick={copyToClipboard} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">Copy</Button>
        </div>
      </div>

      {/* Switch Section */}
      <div className="mb-6 flex items-center gap-2">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages as boolean}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="font-medium text-gray-700">
          Accept Messages: <span className={acceptMessages ? "text-green-600" : "text-red-600"}>
            {acceptMessages ? "On" : "Off"}
          </span>
        </span>
      </div>

      <Separator className="my-6" />

      {/* RESPONSIVE BUTTON ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchMessages(true)}
            disabled={isLoading}
            className="h-10 w-10 shrink-0 border-gray-200"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 text-gray-600" />
            )}
          </Button>

          {/* Clear All with Shadcn Dialog */}
          {messages.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeletingAll}
                  className="flex-1 sm:flex-none h-10 font-bold text-xs uppercase tracking-wider px-6 shadow-sm shadow-red-100"
                >
                  {isDeletingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Wipe your inbox?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500">
                    This will permanently delete all {messages.length} messages. This action is irreversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearAll}
                    className="bg-red-600 hover:bg-red-700 rounded-full text-white"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        {/* Simple count badge for better context */}
        {messages.length > 0 && (
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                Inbox: {messages.length}
            </div>
        )}
      </div>

      {/* Grid Section */}
      <div className="min-h-[400px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full min-w-0">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[160px] w-full animate-pulse bg-gray-100 rounded-xl border border-gray-200" />
            ))
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Trash2 className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Your inbox is empty.</p>
                <p className="text-xs text-gray-400">Share your link to get some messages!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;