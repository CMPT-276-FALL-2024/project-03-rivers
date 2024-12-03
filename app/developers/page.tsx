"use client"

import {  } from "react";
import DeveloperCard from "./components/dev-card";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";

export default function Developer() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="w-full md:w-2/3 max-w-3xl">
          <HeroVideoDialog
            videoSrc="https://www.youtube.com/embed/l4jLHlV2KVU"
            thumbnailSrc="https://i.ytimg.com/vi/l4jLHlV2KVU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCCdZs-8911DMUte00BLK6Dua-LgA"
            thumbnailAlt="SEE Yourself at SFU"
          />
        </div>
        <div className="w-full md:w-1/3">
          <DeveloperCard />
        </div>
      </div>
    </div>
  );
}
