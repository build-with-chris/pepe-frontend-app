import PEPE from "../assets/PEPE.png"
import { Button } from "@/components/ui/button"

export default function Home(){
    return (
        <div className="flex flex-col items-center justify-center h-[90vh]">
            <img className="max-h-full w-auto object-contain" src={PEPE} alt="Pepe Artists" />
            <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button>Booking Assistant</Button>
            </div>
        </div>
    )
}