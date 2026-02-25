"use client"

import MessageCard from "@/src/components/pageComponents/MessageCard"
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { Message, User } from "@/src/model/User";
import { acceptingMessageSchema } from "@/src/schemas/acceptMessageSchema";
import { ApiResponse } from "@/src/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId));
    toast.success("Message deleted successfully");
  }

  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema)
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitching(false);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Refreshed messages successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Failed to fetch messages", {
        description: axiosError.response?.data.message
      });
    } finally {
      setIsLoading(false);
      setIsSwitching(false);
    }
  }, [setIsLoading, setMessages]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, fetchAcceptMessage, fetchMessages])

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update accept message");
    }
  }

  // Moved these outside to ensure they are available for the return statement
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = session?.user ? `${baseUrl}/u/${(session.user as User).username}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };

  if (!session || !session.user) {
    return <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl min-h-[60vh]">Please sign in to view your dashboard.</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl min-h-[60vh]">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-gray-100 rounded border"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages as boolean}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;