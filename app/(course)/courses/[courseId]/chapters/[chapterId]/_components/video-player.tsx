"use client";
import axios from "axios";
import MusPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
 chapterId: string;
 title: string;
 courseId: string;
 nextChapterId: string;
 playbackId: string;
 isLocked: boolean;
 completeOnEnd: boolean;
}

const VideoPlayer = ({
 chapterId,
 title,
 courseId,
 nextChapterId,
 playbackId,
 isLocked,
 completeOnEnd,
}: VideoPlayerProps) => {
 const router = useRouter();
 const [isReady, setIsReady] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const confetti = useConfettiStore();

 const onEnd = async () => {
  try {
   if (completeOnEnd) {
    setIsLoading(true);
    await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
     isCompleted: true,
    });
    if (!nextChapterId) {
     confetti.onOpen();
    }
    // location.reload(); // it works but it's not the best way to do it
    // router.refresh(); // it should work but its buggy
    toast.success("Chapter completed");
    if (nextChapterId) {
     router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
    }
   }
  } catch (error) {
   toast.error("Something went wrong");
  } finally {
   setIsLoading(false);
   router.refresh(); // some how it works here
  }
 };

 return (
  <div className="relative aspect-video">
   {((!isReady && !isLocked) || isLoading) && (
    <div className="absolute z-[10] inset-0 flex items-center justify-center bg-slate-800 ">
     <Loader2 className="h-8 w-8 animate-spin text-secondary" />
    </div>
   )}
   {isLocked && (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary ">
     <Lock className="h-8 w-8" />
     <p className="text-sm ">This chapter is locked</p>
    </div>
   )}
   {!isLocked && (
    <MusPlayer
     title={title}
     className={cn(!isReady && "hidden")}
     onCanPlay={() => setIsReady(true)}
     onEnded={onEnd}
     autoPlay
     playbackId={playbackId}
    />
   )}
  </div>
 );
};

export default VideoPlayer;
