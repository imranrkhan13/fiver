"use client"
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import axios from "axios";
import { useState } from "react";
import Image from 'next/image'


export function UploadImage({ onImageAdded, image }: {
    onImageAdded: (image: string) => void;
    image?: string;
}) {
    const [uploading, setUploading] = useState(false);

    async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        setUploading(true);
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
                headers: {
                    "Authorization": localStorage.getItem("token") || ""
                }
            });

            const { preSignedUrl, fields } = response.data;

            const formData = new FormData();
            for (const key in fields) {
                formData.append(key, fields[key]);
            }
            formData.append("file", file);

            await axios.post(preSignedUrl, formData);

            onImageAdded(`${CLOUDFRONT_URL}/${fields.key}`);
        } catch (e) {
            console.error("Upload failed:", e);
        } finally {
            setUploading(false);
        }
    }

    if (image) {
        return <Image src="/image.png" alt="Description" width={500} height={300} />
    }

    return (
        <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
            <div className="h-full flex justify-center flex-col relative w-full">
                <div className="h-full flex justify-center w-full pt-16 text-4xl">
                    {uploading ? (
                        <div className="text-sm">Loading...</div>
                    ) : (
                        <>
                            +
                            <input
                                type="file"
                                className="absolute opacity-0 top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer"
                                onChange={onFileSelect}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
