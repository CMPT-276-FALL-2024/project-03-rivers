import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import DeveloperCard from "./components/dev-card";


export default function Developer() {
    return (
        <div className="">
            <div className="flex">

                <Image
                    className="col-start-1 col-span-2 mb-8 mt-8  rounded-md"
                    src="/images/developer-test.jpg"
                    alt="Test-Image"
                    width={700}
                    height={300}
                />
                <div>
                    <DeveloperCard/>
                </div>
            </div>        
        </div>

    );
}