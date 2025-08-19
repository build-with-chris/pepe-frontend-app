import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSignUp triggered", { name, email, password });
    setLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log("Supabase signUp result:", { data, error });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Registrierung erfolgreich! Bitte prüfe deine E-Mails zur Bestätigung.");
      setTimeout(() => {
        console.log("Navigating to /login after successful sign-up");
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen flex items-center justify-center overflow-hidden">
      {/* subtle glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-700/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-black/40 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full md:w-4/5 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-12">
        {/* Info Section */}
        <div className="flex flex-col justify-center">
   
          <h2 className="text-3xl font-bold mb-6 leading-tight">Artist Registrierung</h2>
          <p className="mb-4 text-white/80">
            In diesem Schritt legst du deine Login-Daten fest und bestätigst deine E-Mail. 
            Beim ersten Login wirst du gebeten, dein Künstlerprofil zu vervollständigen, ein Profilbild hochzuladen und deine Verfügbarkeiten anzugeben.
          </p>
          <p className="mb-6 text-white/80">
            Sobald du alles gespeichert hast, prüft ein Admin dein Profil und gibt es innerhalb von 24h frei. 
            Danach können dich Kunden direkt über den Booking Assistenten anfragen.
          </p>
          <div className="border-t border-white/10 my-6"></div>
          <h2 className="text-xl font-semibold mb-3">Vorteile für dich:</h2>
          <ul className="list-disc list-inside space-y-2 text-white/80">
            <li>Klare Übersicht über Anfragen</li>
            <li>Rechnungen direkt hochladen</li>
            <li>Kalenderpflege leicht gemacht</li>
            <li>Schnelleres Antworten auf Kundenanfragen</li>
            <li>Leicht & unkompliziert</li>
          </ul>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSignUp}
          className="flex flex-col gap-4 bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg"
        >
          <div className="flex justify-center mb-4">
            <DotLottieReact
              src="https://lottie.host/811964bf-fed6-4d2f-9782-58bb72490ec3/SHtPNzKNxL.lottie"
              loop
              autoplay
              style={{ width: "120px", height: "120px" }}
            />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-center">Registrieren</h2>
          {message && <p className="text-sm text-center text-white/70">{message}</p>}
          <Input
            id="name"
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/40 border-white/20 text-white placeholder:text-white/40"
          />
          <Input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/40 border-white/20 text-white placeholder:text-white/40"
          />
          <Input
            id="password"
            type="password"
            placeholder="Passwort"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black/40 border-white/20 text-white placeholder:text-white/40"
          />
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-blue-500 to-black hover:from-blue-600 hover:to-black text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Lädt..." : "Registrieren"}
          </Button>
          <p className="text-center text-sm mt-4 text-white/70">
            Schon registriert?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Anmelden
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}