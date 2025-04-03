"use client";
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { UploadImage } from "@/components/UploadImage";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export const Upload = () => {
    const [images, setImages] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [txSignature, setTxSignature] = useState("");
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const router = useRouter();

    async function onSubmit() {
        const requestData = {
            options: images.map(image => ({
                imageUrl: image,
            })),
            title,
            signature: txSignature
        };
        
        const response = await axios.post(`${BACKEND_URL}/v1/user/task`, requestData, {
            headers: {
                "Authorization": localStorage.getItem("token"),
                "Content-Type": "application/json"
            }
        });

        router.push(`/task/${response.data.id}`)
    }

    async function makePayment() {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey!,
                toPubkey: new PublicKey("2KeovpYvrgpziaDsq8nbNMP4mc48VNBVXb5arbqrg9Cq"),
                lamports: 100000000,
            })
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        setTxSignature(signature);
    }

    return (
        <div className="task-container">
            <div className="task-content">
                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                    
                    * {
                        box-sizing: border-box;
                        font-family: 'Poppins', sans-serif;
                    }
                    
                    body {
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        min-height: 100vh;
                    }
                    
                    .task-container {
                        display: flex;
                        justify-content: center;
                        padding: 2rem;
                    }
                    
                    .task-content {
                        max-width: 800px;
                        width: 100%;
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        padding: 2rem;
                        transition: transform 0.3s ease;
                    }
                    
                    .task-content:hover {
                        transform: translateY(-5px);
                    }
                    
                    .task-title {
                        font-size: 1.75rem;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 1.5rem;
                        border-bottom: 2px solid #f0f0f0;
                        padding-bottom: 0.75rem;
                    }
                    
                    .task-label {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 500;
                        color: #555;
                        font-size: 0.95rem;
                    }
                    
                    .task-input {
                        width: 100%;
                        padding: 0.75rem 1rem;
                        border: 1px solid #e1e1e1;
                        border-radius: 8px;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        margin-bottom: 1.5rem;
                    }
                    
                    .task-input:focus {
                        outline: none;
                        border-color: #6366f1;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                    }
                    
                    .task-input::placeholder {
                        color: #aaa;
                    }
                    
                    .images-section {
                        display: block;
                        margin-bottom: 0.5rem;
                        font-weight: 500;
                        color: #555;
                        font-size: 0.95rem;
                    }
                    
                    .images-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }
                    
                    .upload-container {
                        margin-bottom: 2rem;
                    }
                    
                    .button-container {
                        display: flex;
                        justify-content: center;
                        margin-top: 1rem;
                    }
                    
                    .sol-button {
                        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        padding: 0.75rem 2rem;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
                    }
                    
                    .sol-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
                        background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    }
                    
                    .sol-button:active {
                        transform: translateY(1px);
                    }
                    
                    @media (max-width: 768px) {
                        .task-container {
                            padding: 1rem;
                        }
                        
                        .task-content {
                            padding: 1.5rem;
                        }
                        
                        .task-title {
                            font-size: 1.5rem;
                        }
                    }
                `}</style>

                <div className="task-title">
                    Create a task
                </div>
                <label className="task-label">Task details</label>
                <input 
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    id="first_name"
                    className="task-input"
                    placeholder="What is your task?"
                    required 
                />
                <label className="images-section">Add Images</label>
                <div className="images-container">
                    {images.map((image, index) => (
                        <UploadImage 
                            key={index} 
                            image={image} 
                            onImageAdded={(imageUrl) => setImages(i => [...i, imageUrl])} 
                        />
                    ))}
                </div>
                <div className="upload-container">
                    <UploadImage onImageAdded={(imageUrl) => setImages(i => [...i, imageUrl])} />
                </div>
                <div className="button-container">
                    <button 
                        onClick={txSignature ? onSubmit : makePayment} 
                        type="button" 
                        className="sol-button">
                        {txSignature ? "Submit Task" : "Pay 0.1 SOL"}
                    </button>
                </div>
            </div>
        </div>
    );
}