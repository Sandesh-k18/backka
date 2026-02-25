"use client"

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
        <Card className="card-bordered flex flex-col justify-between h-full">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    {/* The content is truncated here to keep the card size consistent */}
                    <div className="flex-grow overflow-hidden">
                        <CardTitle className="text-md font-medium line-clamp-3 break-words">
                            {message.content}
                        </CardTitle>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* DELETE BUTTON (AlertDialog) */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" className="h-8 w-8">
                                    <X className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently remove this whisper from your dashboard.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* EXPAND/POP-UP BUTTON (Dialog) */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Maximize2 className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
                                <DialogHeader>
                                    <DialogTitle className="text-sm text-muted-foreground">
                                        Received: {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="py-4 text-lg leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                                    {message.content}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="text-[10px] text-muted-foreground mt-4 italic">
                    {dayjs(message.createdAt).fromNow()}
                    {/* //relativetime is used here */}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
    )
}

export default MessageCard;