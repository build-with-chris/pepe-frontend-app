

import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/lib/supabase';

// Konfiguration für den Storage-Bucket (default: invoices)
const INVOICE_BUCKET = import.meta.env.VITE_SUPABASE_INVOICES_BUCKET || 'invoices';

interface RequestItem {
  id: number;
  status: string;
  event_date: string; // YYYY-MM-DD
  artist_gage?: number | null; // gewünschte/vereinbarte Gage des Artists
}

interface InvoiceFile {
  name: string;
  url: string;
  size?: number;
  created_at?: string;
}

const normalize = (s?: string | null) => (s ?? '').toString().trim().toLowerCase();

const parseISODate = (iso: string) => new Date(`${iso}T00:00:00`);

export default function Buhaltung() {
  const { token } = useAuth();
  const [artistId, setArtistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [requests, setRequests] = useState<RequestItem[]>([]);

  const [uploading, setUploading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceFile[]>([]);
  const [invError, setInvError] = useState<string | null>(null);

  // 1) Eigenen Artist laden (für artistId)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/api/artists/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const me = await res.json();
        if (!mounted) return;
        setArtistId(me.id);
      } catch (e: any) {
        if (!mounted) return;
        console.error('❌ /api/artists/me failed', e);
        setError(e?.message || 'Profil konnte nicht geladen werden');
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  // 2) Eigene Anfragen laden (für Verdienstübersicht)
  useEffect(() => {
    if (!token) return;
    let mounted = true;
    (async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/api/requests/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as RequestItem[];
        if (!mounted) return;
        setRequests(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        console.error('❌ /api/requests/requests failed', e);
        setError(e?.message || 'Anfragen konnten nicht geladen werden');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  // 3) Rechnungen aus dem Storage listen
  const listInvoices = async (aid: number) => {
    try {
      setInvError(null);
      const prefix = `artist/${aid}`;
      const { data, error } = await supabase.storage
        .from(INVOICE_BUCKET)
        .list(prefix, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;
      const items: InvoiceFile[] = (data || []).map((f) => {
        const { data: pub } = supabase.storage.from(INVOICE_BUCKET).getPublicUrl(`${prefix}/${f.name}`);
        return { name: f.name, url: pub.publicUrl, size: f.metadata?.size, created_at: f.created_at as any };
      });
      setInvoices(items);
    } catch (e: any) {
      console.error('❌ list invoices failed', e);
      setInvError(e?.message || 'Rechnungen konnten nicht geladen werden');
    }
  };

  useEffect(() => {
    if (artistId) listInvoices(artistId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId]);

  // Upload-Handler (PDF oder Bild)
  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!artistId) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setInvError(null);
    const prefix = `artist/${artistId}`;
    try {
      for (const file of Array.from(files)) {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        const path = `${prefix}/${safeName}`;
        const { error: upErr } = await supabase.storage
          .from(INVOICE_BUCKET)
          .upload(path, file, {
            contentType: file.type || (ext ? `application/${ext}` : 'application/octet-stream'),
            upsert: false,
          });
        if (upErr) throw upErr;
      }
      await listInvoices(artistId);
    } catch (e: any) {
      console.error('❌ upload failed', e);
      setInvError(e?.message || 'Upload fehlgeschlagen');
    } finally {
      setUploading(false);
      // input leeren
      e.currentTarget.value = '';
    }
  };

  // Verdienst-Berechnung
  const { monthTotal, yearTotal, monthCount, yearCount } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0-basiert
    const accepted = requests.filter((r) => normalize(r.status) === 'akzeptiert');
    let monthTotal = 0;
    let yearTotal = 0;
    let monthCount = 0;
    let yearCount = 0;
    for (const r of accepted) {
      const d = parseISODate(r.event_date);
      const val = Number(r.artist_gage ?? 0) || 0;
      if (d.getFullYear() === y) {
        yearTotal += val; yearCount += 1;
        if (d.getMonth() === m) { monthTotal += val; monthCount += 1; }
      }
    }
    return { monthTotal, yearTotal, monthCount, yearCount };
  }, [requests]);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">🧾 Buchhaltung</h1>

      {/* Upload & Archiv */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Rechnungen hochladen</h2>
        <div className="bg-gray-900 border border-gray-800 rounded p-4">
          <p className="text-sm text-gray-300 mb-3">
            Lade hier deine Rechnungen zu bestätigten Gigs hoch (PDF, JPG, PNG, WEBP). Dateien landen in deinem persönlichen Ordner.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="file"
              multiple
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={onUpload}
              disabled={!artistId || uploading}
              className="block text-sm"
            />
            <button
              type="button"
              onClick={() => artistId && listInvoices(artistId)}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm"
            >
              Liste aktualisieren
            </button>
            {uploading && <span className="text-gray-400 text-sm">Lade hoch…</span>}
          </div>
          {invError && <p className="text-red-400 text-sm mt-2">{invError}</p>}

          <div className="mt-4">
            <h3 className="font-medium mb-2">Rechnungs-Archiv</h3>
            {invoices.length === 0 ? (
              <p className="text-gray-400 text-sm">Noch keine Rechnungen hochgeladen.</p>
            ) : (
              <ul className="space-y-2">
                {invoices.map((f) => (
                  <li key={f.name} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                    <div className="truncate pr-3">
                      <a href={f.url} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline">
                        {f.name}
                      </a>
                      {f.size ? <span className="text-gray-400 text-xs ml-2">({Math.round(f.size/1024)} KB)</span> : null}
                    </div>
                    <a href={f.url} target="_blank" rel="noreferrer" className="text-sm text-gray-300 hover:text-white">
                      Öffnen
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Verdienstübersicht */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Verdienstübersicht</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="text-sm text-gray-400">Aktueller Monat</div>
            <div className="text-2xl font-bold mt-1">{monthTotal.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-gray-400 mt-1">{monthCount} angenommene Gigs</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="text-sm text-gray-400">Aktuelles Jahr</div>
            <div className="text-2xl font-bold mt-1">{yearTotal.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-gray-400 mt-1">{yearCount} angenommene Gigs</div>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </section>

      <p className="text-xs text-gray-500 mt-6">
        Hinweis: Die Verdienstsummen basieren auf deiner angegebenen Gage (<code>artist_gage</code>) für akzeptierte Anfragen.
      </p>
    </div>
  );
}