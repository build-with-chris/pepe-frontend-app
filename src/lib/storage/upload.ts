import { supabase } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

const PROFILE_BUCKET = import.meta.env.VITE_SUPABASE_PROFILE_BUCKET || "profiles";

export async function uploadProfileImage(
  file: File | null,
  artistId: string,
  bucket: string,
  supabaseClient: SupabaseClient,
  setProfileImageUrl: (url: string) => void,
  setBackendDebug: (msg: string) => void,
  existingUrl: string | null = ""
) {
  if (!file) return existingUrl || "";
  let ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ext || ext.length > 5) {
    const mime = file.type;
    if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
    else if (mime.includes("png")) ext = "png";
    else if (mime.includes("webp")) ext = "webp";
    else ext = "jpg";
  }
  const path = `artist/${artistId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(PROFILE_BUCKET).upload(path, file, {
    contentType: file.type || `image/${ext}`,
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadGalleryImages(
  files: File[],
  artistId: string,
  bucket: string,
  supabaseClient: SupabaseClient,
  existingUrls: string[],
  setGalleryUrls: (urls: string[]) => void
) {
  if (!files || files.length === 0) return existingUrls || [];
  const out: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    let ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!ext || ext.length > 5) {
      const mime = f.type;
      if (mime.includes("jpeg") || mime.includes("jpg")) ext = "jpg";
      else if (mime.includes("png")) ext = "png";
      else if (mime.includes("webp")) ext = "webp";
      else ext = "jpg";
    }
    const path = `artist/${artistId}/gallery/${Date.now()}-${i}.${ext}`;
    const { error } = await supabase.storage.from(PROFILE_BUCKET).upload(path, f, {
      contentType: f.type || `image/${ext}`,
      upsert: false,
    });
    if (error) continue;
    const { data } = supabase.storage.from(PROFILE_BUCKET).getPublicUrl(path);
    if (data?.publicUrl) out.push(data.publicUrl);
  }
  return [...existingUrls, ...out].slice(0, 3);
}