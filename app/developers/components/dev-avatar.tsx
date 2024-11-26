import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CardHeader} from "@/components/ui/card";


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
