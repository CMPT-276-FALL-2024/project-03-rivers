import { HomeScroll } from "@/components/home-scroll";
import { HomeTestimonials } from "@/components/home-testimotional";
import { BoxIntro } from "@/components/home-title";
import SparklesText from "@/components/ui/sparkles-text";
import Image from "next/image";


export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <SparklesText text="RNA" /> */}
      <div className="flex justify-between mt-10">
        <BoxIntro />
        <Image src="/images/home/pic1.png" alt="arrow image" width={800} height={600} className="rounded-lg" >
        </Image>
      </div>
      <div className="mt-16">
        <HomeTestimonials />
        {/* <HomeScroll /> */}
      </div>
      
    </div>
  );
}
