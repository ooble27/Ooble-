/**
 * KYC côté client : lire l'état de sa vérification et la soumettre.
 *
 * Les pièces (recto de la pièce d'identité + selfie) vont dans le bucket privé
 * `kyc`, rangées sous `<uid>/…`. Les métadonnées saisies sont stockées dans
 * `result_payload`. Le staff relit et décide via le back-office (KycPanel).
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type KycDbStatus = Database["public"]["Enums"]["kyc_status"];

export interface MyKyc {
  status: KycDbStatus;
  docType?: string;
  legalName?: string;
  submittedAt: string;
}

/** Vérification la plus récente de l'utilisateur connecté (ou null). */
export async function getMyKyc(): Promise<MyKyc | null> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) return null;

  const { data: row } = await supabase
    .from("kyc_verifications")
    .select("status, result_payload, created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!row) return null;

  const p = (row.result_payload ?? {}) as { doc_type?: string; legal_name?: string };
  return { status: row.status, docType: p.doc_type, legalName: p.legal_name, submittedAt: row.created_at };
}

export interface KycInput {
  legalName: string;
  dob: string;
  docType: string;
  docNumber: string;
}

/**
 * Soumet (ou resoumet) la vérification : téléverse les pièces puis écrit la
 * ligne `kyc_verifications` en `pending`. Une seule vérification par client :
 * on remplace la précédente si elle n'est pas déjà approuvée.
 */
export async function submitKyc(
  input: KycInput,
  files: { front?: File | null; selfie?: File | null },
): Promise<{ error?: string }> {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) return { error: "Vous devez être connecté." };

  const ts = Date.now();
  const uploadOne = async (file: File, kind: string) => {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${uid}/${ts}-${kind}.${ext}`;
    const { error } = await supabase.storage.from("kyc").upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
    });
    if (error) throw error;
    return path;
  };

  const paths: { front_path?: string; selfie_path?: string } = {};
  try {
    if (files.front) paths.front_path = await uploadOne(files.front, "recto");
    if (files.selfie) paths.selfie_path = await uploadOne(files.selfie, "selfie");
  } catch {
    return { error: "Échec du téléversement des pièces. Réessayez." };
  }

  const payload = {
    doc_type: input.docType,
    legal_name: input.legalName.trim(),
    dob: input.dob,
    doc_number: input.docNumber.trim(),
    ...paths,
  };

  const { data: existing } = await supabase
    .from("kyc_verifications")
    .select("id, status")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing && existing.status !== "approved") {
    const { error } = await supabase
      .from("kyc_verifications")
      .update({ status: "pending", provider: "manual", result_payload: payload })
      .eq("id", existing.id);
    return error ? { error: error.message } : {};
  }

  const { error } = await supabase
    .from("kyc_verifications")
    .insert({ user_id: uid, provider: "manual", status: "pending", result_payload: payload });
  return error ? { error: error.message } : {};
}
