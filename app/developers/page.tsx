import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DeveloperCard from "./components/dev-card";
import Image from "next/image";


export default function Developer() {
    return (
        <div className="">
            <div className="flex">

                <Image
                    className="col-start-1 col-span-2 mb-8 mt-8  rounded-md"
                    src="/images/Developer-test.jpg"
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
