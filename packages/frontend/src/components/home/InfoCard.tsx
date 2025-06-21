import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { ReactNode } from "react";


// Define the props our component will accept
interface InfoCardProps 
{
    icon: ReactNode;
    title: string;
    children: ReactNode;
}

const InfoCard = ({ icon, title, children }: InfoCardProps) => 
{

    return (
        <Card className="flex h-full flex-col border-none bg-white text-center shadow-lg" >
            
            <CardHeader>
                {/* Icon with circular background */}
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    {icon}
                </div>
                <CardTitle className="text-xl font-bold">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow text-left text-neutral-600">
                {children}
            </CardContent>
        </Card>
    );
};

export default InfoCard;
