"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Globe } from 'lucide-react';
import { ModeToggle } from "./mode-toggle";
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useToast } from '@/hooks/use-toast';

export default function MenuBar() {
    const { toast } = useToast();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Token Response:', tokenResponse);
            
            // アクセストークンを保存
            localStorage.setItem('googleAccessToken', tokenResponse.access_token);
            console.log('Access token saved to localStorage');
            
            toast({
                title: "ログイン成功",
                description: "Googleアカウントでログインしました。",
            });
        },
        onError: () => {
            console.error('Login failed');
            toast({
                title: "ログイン失敗",
                description: "Googleアカウントでのログインに失敗しました。",
                variant: "destructive",
            });
        },
        scope: 'https://www.googleapis.com/auth/calendar.events',
    });

    return (
        <div className="flex items-center justify-between m-5 h-16 rounded-full border shadow-lg">
            <Link href="/" className="flex ml-6 gap-2">
                <Globe />
                <h1 className="text-orange-500 font-extrabold text-xl">RNA</h1>
            </Link>

            <div className="mr-3 gap-2 flex items-center">
                <Link href="/recipe">
                    <Button variant="ghost" className="text-md">Recipe</Button>
                </Link>
                <Link href="/calendar">
                    <Button variant="ghost" className="text-md">Calendar</Button>
                </Link>
                <Link href="/developers">
                    <Button variant="ghost" className="text-md">Developers</Button>
                </Link>
                <Button 
                    variant="outline"
                    onClick={() => login()}
                >
                    Googleでログイン
                </Button>
                <ModeToggle />
            </div>
        </div>       
    );
}

