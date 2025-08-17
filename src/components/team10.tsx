import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const members = [
  { name: "Michi Heiduk", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp", role: "CEO" },
  { name: "Chris Hermann", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp", role: "CEO" },

  { name: "Daniela Meier", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp", role: "Handstand, Contortion, Luft, Hulla" },
  { name: "Jakob Vöckler", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp", role: "Chienise Pole, Free Running" },
  { name: "Jonas Dürrbeck", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp", role: "Chienise Pole, Handstand, Akrobatik" },
  { name: "Carmen Lück", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp", role: "Akrobatuk, Cyr" },
  { name: "Lukas Brandl", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp", role: "Zauberei, Jonglage" },
  { name: "Thomas Dietz", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp", role: "Jonglage" },
  { name: "Oles Koval", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp", role: "Zauberei" },
  { name: "Julian Bellini", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp", role: "Objekttheater" },
  { name: "Jawad Rajpoot", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp", role: "Breakdance, Cyr wheel" },
  { name: "Serhard Perhat", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp", role: "Breakdance" },
  { name: "Flo", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp", role: "Chinese Pole, Partnerakrobatik" },
  { name: "Henry Hernandez", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp", role: "Feuershow" },
  { name: "Gabriel Drouin", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp", role: "Cyr wheel" },
  { name: "Svetlana Wotschel", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp", role: "Luftartistik, Waterbowl" },
  { name: "Sankofa Crew", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp", role: "Breakdance" },
  { name: "Jana Rippel", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp", role: "Areal Silk" },
  { name: "Sarah", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-6.webp", role: "Handstand, Tuch" },
  { name: "Jannick", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-7.webp", role: "Jonglage, Floor, Teeterboard" },
  { name: "Dani Thalmaier", image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-8.webp", role: "Breakdance" },
];

const Team10 = () => {
  return (
    <section className=" py-32">
      <div className="container">
        <div className="max-w-xl">
          <h2 className="mb-5 text-4xl md:text-5xl">Unser Team & Netzwerk</h2>
          <p className="mb-12 text-muted-foreground md:text-lg">
            Bei PepeShows vereinen wir erfahrene Artisten, kreative Köpfe und starke Persönlichkeiten. Gemeinsam erschaffen wir unvergessliche Showmomente – von Solo-Acts bis hin zu großen Ensembleproduktionen.
          </p>
          <Link to="/signup">
            <Button size="lg">Als Artist registrieren</Button>
          </Link>
        </div>
        <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {members.map((member, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Avatar className="size-10 border border-border">
                <AvatarImage src={member.image} />
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">{member.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Team10 };
