import React from 'react';
import Head from 'next/head';

export const Hero = () => {
    return (
        <>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
                <style jsx global>{`
                    .text-black pt-10, .text-lg flex justify-center pt-8 {
                        font-family: 'Poppins', sans-serif!important; 
                        background: rgba(0, 0, 0, 0.3) !important;
                        backdrop-filter: blur(10px) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                        color: white !important;
                        font-weight: 500 !important;
                        border-radius: 12px !important;
                        padding: 0.65rem 1.25rem !important;
                        transition: all 0.2s ease !important;
                    }

                    .wallet-adapter-button:hover {
                        background: rgba(147, 51, 234, 0.5) !important;  /* purple-600 */
                        border-color: rgba(147, 51, 234, 0.5) !important;
                        box-shadow: 0 0 15px rgba(147, 51, 234, 0.3) !important;
                    }

                    .wallet-adapter-button:active {
                        transform: scale(0.98) !important;
                    }

                    .wallet-adapter-button-trigger {
                        background: linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(139, 92, 246, 0.4)) !important;
                    }
                `}</style>
            </Head>
            <div className="text-black pt-10">
                <div className="text-2xl flex justify-center">
                    Welcome to Turkify
                </div>
                <div className="text-lg flex justify-center pt-8">
                    Your one stop destination to getting your data labelled
                </div>
            </div>
        </>
    );
};