import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Contact7Props {
  title?: string;
  description?: string;
  emailLabel?: string;
  emailDescription?: string;
  email?: string;
  officeLabel?: string;
  officeDescription?: string;
  officeAddress?: string;
  phoneLabel?: string;
  phoneDescription?: string;
  phone?: string;
  chatLabel?: string;
  chatDescription?: string;
  chatLink?: string;
}

const Contact7 = ({
  title = "Kontakt",
  description = "Wir sind für dich da.",
  emailLabel = "Email",
  emailDescription = "Auf Emails antworten wir in der Regel innerhalb von 24 Stunden.",
  email = "chris@pepearts.de",
  officeLabel = "Space",
  officeDescription = "Unser PepeDome im Ostpark München.",
  officeAddress = "PepeDome, Ostpark München, 81735",
  phoneLabel = "Phone",
  phoneDescription = "Mon-Fri, 9am-5pm",
  phone = "015904891419",
  chatLabel = "Live Chat",
  chatDescription = "Coming soon...",
  chatLink = "Coming soon",
}: Contact7Props) => {
  const { t } = useTranslation();
  return (
    <section className="bg-black py-32">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="mb-14">
          <h1 className="mb-3 mt-2 text-balance text-3xl font-semibold md:text-4xl">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            {t("contact.description")}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href={`mailto:${email}`}
            className="block bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
          >
            <span className="bg-white/10 mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <Mail className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg font-semibold">{t("contact.email.label")}</p>
            <p className="text-muted-foreground mb-3">{t("contact.email.description")}</p>
            <p className="font-semibold underline-offset-2">{email}</p>
          </a>
          <a
            href="https://www.google.de/maps/place/Pepe+Dome+im+Theatron+im+Ostpark/@48.1119726,11.640768,16z/data=!3m1!4b1!4m6!3m5!1s0x479ddfe1623e7b83:0x8f776b2413dcab9e!8m2!3d48.1119726!4d11.6433429!16s%2Fg%2F11dfj6w_tt?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
          >
            <span className="bg-white/10 mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <MapPin className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg font-semibold">{t("contact.office.label")}</p>
            <p className="text-muted-foreground mb-3">{t("contact.office.description")}</p>
            <p className="font-semibold underline-offset-2">{t("contact.office.address")}</p>
          </a>
          <a
            href={`tel:${phone}`}
            className="block bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
          >
            <span className="bg-white/10 mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <Phone className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg font-semibold">{t("contact.phone.label")}</p>
            <p className="text-muted-foreground mb-3">{t("contact.phone.description")}</p>
            <p className="font-semibold underline-offset-2">{phone}</p>
          </a>
          <a
            href="#"
            className="block bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition"
          >
            <span className="bg-white/10 mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <MessageCircle className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg font-semibold">{t("contact.chat.label")}</p>
            <p className="text-muted-foreground mb-3">{t("contact.chat.description")}</p>
            <p className="font-semibold underline-offset-2">{t("contact.chat.link")}</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export { Contact7 };
