import PEPE from "../assets/PEPE.png"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import {CarouselOrientation} from "@/components/carousel-Landingpage"

export default function Home(){
    return (
        <>
        <div className="relative w-screen h-[400px] md:h-[600px] lg:h-[800px]">
            <CarouselOrientation />
            <div className="absolute inset-0 flex items-center justify-center">
                <Link to="/anfragen">
                    <Button className="font-bold size-3xl">Booking Assistant</Button>
                </Link>
            </div>
        </div>

        <h3 className="p-6 text-lg leading-relaxed max-w-4xl mx-auto">
            Bei PepeShows bringen wir außergewöhnliches Entertainment direkt zu Ihnen! <br />
            Als führende Künstleragentur spezialisieren wir uns auf die Vermittlung von professionellen 
            Zirkuskünstlern für Unternehmen in der DACH-Region. <br />
            Unsere Agentur steht für ein vielseitiges Künstlerportfolio und maßgeschneiderte Performances, 
            die Ihr Firmenevent unvergesslich machen. <br />
            Unsere Künstler sind ideal für jede Art von Firmenfeier und schaffen eine unvergessliche Atmosphäre 
            durch Showeinlagen, Workshops oder maßgeschneiderte Programme.
        </h3>
        </>
    )
}