//test
//@/components/ui/nav-user.tsx

"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import React, { useState, useEffect } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image"
import { Button } from "./ui/button"



export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
    const { toast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<{ name: string; picture: string; email: string } | null>(null);

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
            setUserInfo({ name: data.name, picture: data.picture, email: data.email });
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

    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
        <SidebarMenuItem>
        {isLoggedIn ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userInfo?.picture || "/placeholder-avatar.png"} alt={userInfo?.name || "Please relogin"} />
                <AvatarFallback className="rounded-lg">{userInfo?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userInfo?.name || "Please relogin"}</span>
                {/* <span className="truncate text-xs">{userInfo?.email || "user@example.com"}</span> */}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            >
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userInfo?.picture || "/placeholder-avatar.png"} alt={userInfo?.name || "Please relogin"} />
                    <AvatarFallback className="rounded-lg">{userInfo?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userInfo?.name || "Please relogin"}</span>
                    <span className="truncate text-xs">{userInfo?.email || "user@example.com"}</span>
                </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                Favorite
                </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                <BadgeCheck className="mr-2 h-4 w-4" />
                Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        ) : (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <SidebarMenuButton 
                onClick={() => login()} 
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
                <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg"><User /></AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left l-4 text-sm leading-tight">
                <span className="truncate font-semibold items-center">Login with Google</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
            </DropdownMenuTrigger>
        </DropdownMenu>
        )}
            {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="start"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                    </div>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCard />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Bell />
                    Notifications
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <LogOut />
                Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu> */}
        </SidebarMenuItem>
    </SidebarMenu>
  )
}
