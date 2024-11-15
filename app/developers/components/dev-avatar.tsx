import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface DeveloperAvatarProps {
    imageSrc?: string;
}

export default function DeveloperAvatar({imageSrc }: DeveloperAvatarProps) {
    return (
                <CardHeader>
                    <Avatar className="w-20 h-20 bg-transparent"> 
                        <AvatarImage className="w-full h-full rounded-full object-cover" src={imageSrc} />
                    </Avatar>
                </CardHeader>
    );
}
