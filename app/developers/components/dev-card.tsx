import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeveloperAvatar from "./dev-avatar";
import { Github } from "lucide-react";

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
                    
                <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <Github className="w-5 h-5" />
                            <span className="ml-1">Github:</span>
                        </div>
                        <a
                            className="text-black dark:text-white underline underline-offset-1 decoration-black dark:decoration-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            href="https://github.com/ryotakc"
                        >
                            Ryota
                        </a>
                </div>

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

                <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <Github className="w-5 h-5" />
                            <span className="ml-1">Github:</span>
                        </div>
                        <a
                            className="text-black dark:text-white underline underline-offset-1 decoration-black dark:decoration-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            href="https://github.com/eito8210"
                        >
                        Eito 
                        </a>

                </div>

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
                <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <Github className="w-5 h-5" />
                            <span className="ml-1">Github:</span>
                        </div>
                        <a
                            className="text-black dark:text-white underline underline-offset-1 decoration-black dark:decoration-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            href="https://github.com/TulikaVarma"
                        >
                        Tulika 
                        </a>
                </div>
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
                <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <Github className="w-5 h-5" />
                            <span className="ml-1">Github:</span>
                        </div>
                        <a
                            className="text-black dark:text-white underline underline-offset-1 decoration-black dark:decoration-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            href="https://github.com/zorojuro12"
                        >
                            Ansh
                        </a>
                </div>
                </CardContent>
            </Card>
        </div>
    );
}
