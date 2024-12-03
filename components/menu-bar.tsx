//@/components/ui/menu-bar.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Globe, User } from 'lucide-react';
import { ModeToggle } from "./mode-toggle";
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Helix from "./icons/helix";



export default function MenuBar() {
    const { toast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<{ name: string; picture: string } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('googleAccessToken');
        if (token) {
            setIsLoggedIn(true);
            fetchUserInfo(token);
        }
    }, []);

    const fetchUserInfo = async (token: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUserInfo({ name: data.name, picture: data.picture });
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Token Response:', tokenResponse);
            
            localStorage.setItem('googleAccessToken', tokenResponse.access_token);
            console.log('Access token saved to localStorage');
            
            setIsLoggedIn(true);
            fetchUserInfo(tokenResponse.access_token);
            
            toast({
                title: "Success to login",
                description: "Successfully logged in with Google account.",
            });
        },
        onError: () => {
            console.error('Login failed');
            toast({
                title: "Failed to login",
                description: "Failed to login with Google account.",
                variant: "destructive",
            });
        },
        scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile',
    });

    const logout = () => {
        localStorage.removeItem('googleAccessToken');
        setIsLoggedIn(false);
        setUserInfo(null);
        toast({
            title: "Success to logout",
            description: "Successfully logged out.",
        });
    };

    return (
        <div className="flex items-center justify-between m-5 h-16 rounded-full border shadow-lg">
            <Link href="/" className="flex ml-6 gap-2"> 
                {/* <Globe /> */}
                {/* <Helix /> */}
                <Helix 
                  color="orange" 
                  size={30} 
                  speed={2.5}
                  className="my-2" 
                />
                <h1 className="text-orange-500 font-extrabold text-xl">RNA</h1>
            </Link>

            <div className="mr-3 gap-2 flex items-center">
                <Link href="/recipe">
                    <Button variant="ghost" className="text-md">Search Recipe</Button>
                </Link>
                <Link href="/calendar">
                    <Button variant="ghost" className="text-md">View Plan</Button>
                </Link>
                <Link href="/developers">
                    <Button variant="ghost" className="text-md">Developers</Button>
                </Link>
                {isLoggedIn ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={userInfo?.picture || "/placeholder-avatar.png"} />
                        <AvatarFallback>{userInfo?.name?.[0] || <User />}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <div className="flex items-center">
                          <Image
                            src={userInfo?.picture || "/placeholder-avatar.png"}
                            alt="User Avatar"
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                          <span>{userInfo?.name || "User"}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => login()} variant="ghost" className="text-md">
                    Login
                  </Button>
                )}
                <ModeToggle />
            </div>
        </div>       
    );
}

