
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const disciplinesOptions = [
  "Zauberer",
  "Cyr-Wheel",
  "Bodenakrobatik",
  "Luftakrobatik",
  "Partnerakrobatik",
  "Chinese Pole",
  "Hula Hoop",
  "Handstand",
  "Contemporary Dance",
  "Breakdance",
  "Teeterboard",
  "Jonglage",
  "Moderation",
  "Pantomime/Entertainment",
];

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<number>(500);
  const [priceMax, setPriceMax] = useState<number>(2000);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  // Load existing profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.sub)
        .single();
      if (data) {
        setName(data.name || "");
        setAddress(data.address || "");
        setPhoneNumber(data.phone_number || "");
        setDisciplines(data.disciplines || []);
        setPriceMin(data.price_min || 500);
        setPriceMax(data.price_max || 2000);
      }
    };
    loadProfile();
  }, [user]);

  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !address || !phoneNumber || disciplines.length === 0) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    if (priceMin > priceMax) {
      setError("Das Minimum darf nicht größer als das Maximum sein.");
      return;
    }
    setLoading(true);
    // Save profile data to Supabase (example, adjust table name)
    const { data, error: supabaseError } = await supabase
      .from("profiles")
      .upsert({
        user_id: user!.sub,
        name,
        address,
        phone_number: phoneNumber,
        disciplines,
        price_min: priceMin,
        price_max: priceMax,
        is_complete: true,
      })
      .eq("user_id", user!.sub);

    setLoading(false);
    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSuccess(true);
      // Also create Artist in backend SQLite via Flask API
      try {
        const artistPayload = {
          name,
          email: user!.email,
          address,
          phone_number: phoneNumber,
          disciplines,
          price_min: priceMin,
          price_max: priceMax,
        };
        console.log("Calling backend createArtist:", artistPayload);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(artistPayload),
        });
        const text = await res.text();
        if (!res.ok) {
          console.error("Backend createArtist failed:", res.status, text);
        } else {
          console.log("Backend createArtist succeeded");
        }
      } catch (err) {
        console.error("Error calling backend createArtist:", err);
      }
      // navigate("/dashboard");
    }
  };

  const toggleDiscipline = (d: string) => {
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil einrichten</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && (
        <div className="mb-4 text-green-700 bg-green-100 border border-green-400 rounded p-3">
          Profil erfolgreich gespeichert!
          <button
            className="ml-4 text-green-900 underline"
            onClick={() => navigate("/dashboard")}
          >
            Zum Dashboard
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Adresse*</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Telefonnummer*</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Disziplinen*</label>
          <div className="flex flex-wrap gap-2">
            {disciplinesOptions.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => toggleDiscipline(d)}
                className={`px-3 py-1 border rounded ${
                  disciplines.includes(d)
                    ? "bg-blue-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Preis (min)*</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              min={0}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Preis (max)*</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              min={priceMin}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? "Speichern..." : "Profil speichern"}
        </button>
      </form>
    </div>
);
}