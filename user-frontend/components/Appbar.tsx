"use client";

import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/utils';

export const Appbar = () => {
  const { publicKey, signMessage } = useWallet();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  async function signAndSend() {
    if (!publicKey) {
      return;
    }
    
    setIsSigningIn(true);
    try {
      const message = new TextEncoder().encode("Sign into mechanical turks");
      const signature = await signMessage?.(message);
      console.log(signature);
      console.log(publicKey);
      
      const response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
        signature,
        publicKey: publicKey?.toString()
      });
      
      localStorage.setItem("token", response.data.token);
      setShowWalletInfo(true);
    } catch (error) {
      console.error("Signing error:", error);
    } finally {
      setIsSigningIn(false);
    }
  }

  useEffect(() => {
    if (publicKey) {
      signAndSend();
    } else {
      setShowWalletInfo(false);
    }
  }, [publicKey]);

  return (
    <div className="relative">
      {/* Background with Solana-inspired pattern */}
      <div className="absolute inset-0 bg-black overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-500/10 to-transparent"></div>
        {/* Animated circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-green-500/10 animate-pulse"></div>
        <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-purple-500/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo area */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-purple-600 rounded-full"></div>
                <div className="ml-2 text-2xl font-bold text-white">
                  Turkify
                </div>
              </div>
            </div>

            {/* Wallet section */}
            <div className="flex items-center space-x-4">
              {publicKey && showWalletInfo && (
                <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-white/5 backdrop-blur-sm rounded-full text-sm text-white border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs md:text-sm">
                    {publicKey.toString().substring(0, 4)}...{publicKey.toString().substring(publicKey.toString().length - 4)}
                  </span>
                </div>
              )}
              
              {isSigningIn ? (
                <div className="flex items-center bg-black/30 text-white px-4 py-2 rounded-xl border border-white/10">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing
                </div>
              ) : (
                <div className="wallet-button-container">
                  {publicKey ? (
                    <WalletDisconnectButton />
                  ) : (
                    <WalletMultiButton />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        .wallet-adapter-button {
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
    </div>
  );
};