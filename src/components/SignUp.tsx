import React, { useState } from "react";
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
    <form onSubmit={handleSignUp} className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registrieren</h1>
      {message && <p className="text-sm text-center">{message}</p>}
      <Input
        id="name"
        type="text"
        placeholder="Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        id="email"
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        id="password"
        type="password"
        placeholder="Passwort"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Lädt..." : "Registrieren"}
      </Button>
      <p className="text-center text-sm mt-2">
        Schon registriert?{" "}
        <a href="/login" className="text-blue-600 underline">
          Anmelden
        </a>
      </p>
    </form>
  );
}