"use client"

import { useEffect, useRef } from "react";
import DeveloperCard from "./components/dev-card";

export default function Developer() {
    const videoRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="w-full md:w-2/3 max-w-3xl relative">
                    <div className="aspect-video">
                        <iframe
                            ref={videoRef}
                            className="w-full h-full rounded-lg shadow-lg"
                            src="https://www.youtube.com/embed/l4jLHlV2KVU" 
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <DeveloperCard />
                </div>
            </div>
        </div>
    );
}

