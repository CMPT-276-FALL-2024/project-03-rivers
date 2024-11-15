import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeveloperAvatar from "./dev-avatar";

export default function DeveloperCard() {
    return (
        <div className="grid grid-cols-2 gap-5 mb-5 ml-5 mr-5">
            <Card>
                <CardHeader className="flex items-center space-x-2">
                    <div>
                        <DeveloperAvatar imageSrc="/images/avatar1.png" />
                    </div>
                    <div>
                        <CardTitle>Ryota Kato</CardTitle>
                        <CardDescription>03 Rivers</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    Github:
                    <a className="text-black underline underline-offset-1"
                        href=""
                        >
                         Ryota
                    </a>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center space-x-2">
                    <div>
                        <DeveloperAvatar imageSrc="/images/avatar1.png" />
                    </div>
                    <div>
                        <CardTitle>Eito Nishikawa</CardTitle>
                        <CardDescription>03 Rivers</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    Github:
                    <a className="text-black underline underline-offset-1"
                        href=""
                        >
                         Eito
                    </a>
                </CardContent>
            </Card>

            <Card> 
                <CardHeader className="flex items-center space-x-2">
                    <div>
                        <DeveloperAvatar imageSrc="/images/avatar2.png" />
                    </div>
                    <div>
                        <CardTitle>Tulika Varma</CardTitle>
                        <CardDescription>03 Rivers</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    Github:
                    <a className="text-black underline underline-offset-1"
                        href="https://github.com/TulikaVarma?tab=repositories"
                        >
                         Tulika 
                    </a>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center space-x-2">
                    <div>
                        <DeveloperAvatar imageSrc="/images/avatar1.png" />
                    </div>
                    <div>
                        <CardTitle>Ansh Aggarwal</CardTitle>
                        <CardDescription>03 Rivers</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    Github: 
                    <a className="text-black underline underline-offset-1"
                        href=""
                        >
                         Ansh
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}