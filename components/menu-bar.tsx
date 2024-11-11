import React from "react";

import { Button } from "./ui/button";
import Link from "next/link";
import { Globe } from "lucide-react";
import { ModeToggle } from "./mode-toggle";


export default function MenuBar() {
    return (
        <div className="flex items-center justify-between m-5 h-16 rounded-full border shadow-lg">
            <Link href="/" className="flex ml-6 gap-2">
                <Globe />
                <h1 className="text-orange-500 font-extrabold text-xl">RNA</h1>
            </Link>


            <div className="mr-3 gap-2 ">
                <Link href="/recipe">
                    <Button variant="ghost" className="text-md">Recipe</Button>
                </Link>
                <Link href="/nutrition">
                    <Button variant="ghost" className="text-md">Nutrition</Button>
                </Link>
                <Link href="/developers">
                    <Button variant="ghost" className="text-md">Developers</Button>
                </Link>
                <ModeToggle />
            </div>
        </div>       
    );
}
