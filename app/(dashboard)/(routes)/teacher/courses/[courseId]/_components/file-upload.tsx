"use client";
import toast from "react-hot-toast";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@/lib/uploadthing";

interface FileUplaodProps {
 onChange: (url?: string) => void;
 endpoint: keyof typeof ourFileRouter;
}

export default function FileUpload({ onChange, endpoint }: FileUplaodProps) {
 return (
  <UploadButton
   endpoint={endpoint}
   onClientUploadComplete={(res) => {
    onChange(res?.[0].url);
   }}
   onUploadError={(error: Error) => {
    toast.error(`ERROR! ${error.message}`);
    console.log(error.message);
   }}
  />
 );
}
