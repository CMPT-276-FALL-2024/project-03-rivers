import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";


export default function RecipeCard() {
    return (
        <div>
            <Card className="w-[300px] shadow-md m-5">
                <CardHeader>
                    <Image 
                        src="/recipe/pic1.jpg"
                        alt="recipe image"
                        width={360}
                        height={240}
                        className="rounded-t-lg"
                    />
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center pt-5">
                        <p>Calories</p>
                        <Button>View</Button>                     
                    </div>

                </CardContent>
                {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
            </Card>
        </div>
    );
}
