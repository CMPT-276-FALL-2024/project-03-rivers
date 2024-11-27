import { Button } from "@/components/ui/button";
import BoxReveal from "./ui/box-reveal";
import Link from "next/link";
import { AnimatedButton } from "./animated-button";


export async function BoxIntro() {
  return (
    <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <p className="text-[3.5rem] font-semibold">
          RNA<span className="text-[#5046e6]">.</span>
        </p>
        {/* <AnimatedButton /> */}
      </BoxReveal>

      {/* <BoxReveal>
        <AnimatedButton />
      </BoxReveal> */}

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem]">
          Recipe Searcher and Planner for{" "}
          <span className="text-[#5046e6] font-bold">Health</span>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <div className="mt-6">
          <p>
            -&gt; 2600+ Ingredients
            <span className="font-semibold text-[#5046e6]"> Search Recipes</span>,            
            <span className="font-semibold text-[#5046e6]"> Nutrition Analysis</span>,
            <span className="font-semibold text-[#5046e6]"> Count Ingredients Amount</span>

            . <br />
            -&gt; 5000+ Recipes
            <span className="font-semibold text-[#5046e6]"> Nutrition Facts</span>,
            <span className="font-semibold text-[#5046e6]"> Calories</span>
            . <br />
            -&gt; Add your recipe plan to 
            <span className="font-semibold text-[#5046e6]"> Google Calendar</span>
            . <br />
            -&gt; User friendly and responsive. <br />
          </p>
        </div>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <Link href="/recipe">
          <Button className="mt-[1.6rem] bg-[#5046e6]">Search Recipe</Button>
        </Link>
        </BoxReveal>
    </div>
  );
}
