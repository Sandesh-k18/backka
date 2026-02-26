"use client"

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
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
} from '@/src/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog"
import { Button } from '@/src/components/ui/button';
import { X, Maximize2 } from 'lucide-react';
import { Message } from '@/src/model/User';
import { toast } from 'sonner';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`/api/delete-message/${message._id}`);
            toast.success("Message deleted");
            onMessageDelete(message._id.toString());
        } catch (error) {
            toast.error("Failed to delete message");
        }
    }

    return (
        <Card className="card-bordered flex flex-col justify-between h-full w-full min-w-0 overflow-hidden shadow-sm">
            <CardHeader className="p-4 sm:p-6">
                {/* 1. Use 'grid' instead of 'flex' for the header to lock column widths */}
                <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                    
                    {/* 2. Content Container: 'min-w-0' is vital to prevent grid blowout */}
                    <div className="min-w-0">
                        <CardTitle 
                            className="text-sm sm:text-md font-medium leading-snug whitespace-pre-wrap break-all sm:break-words line-clamp-6"
                            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                            {message.content}
                        </CardTitle>
                    </div>

                    {/* 3. Action Buttons: Explicitly fixed width to prevent distortion */}
                    <div className="flex flex-col gap-2 w-8 items-center">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0">
                                    <X className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90vw] max-w-[400px]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove this whisper.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                                    <Maximize2 className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="text-[10px] text-muted-foreground uppercase">
                                        Received: {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="py-4 text-base sm:text-lg whitespace-pre-wrap break-all overflow-y-auto max-h-[60vh]">
                                    {message.content}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground italic">
                        {dayjs(message.createdAt).fromNow()}
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground opacity-75">
                        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                    </span>
                </div>
            </CardHeader>
        </Card>
    )
}

export default MessageCard;