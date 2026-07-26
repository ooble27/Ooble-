import { supabase } from "@/integrations/supabase/client";

export interface MyProfile {
  fullName: string | null;
  email: string | null;
  sellRef: string | null;
  interacQuestion: string | null;
  interacAnswer: string | null;
}

export async function getMyProfile(): Promise<MyProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, email, sell_ref, interac_question, interac_answer")
    .eq("id", uid)
    .maybeSingle();
  if (error || !data) return null;

  let question = data.interac_question;
  let answer = data.interac_answer;

  if (!question || !answer) {
    const gen = generateInteracQA(uid);
    question = gen.question;
    answer = gen.answer;
    await supabase
      .from("profiles")
      .update({ interac_question: question, interac_answer: answer })
      .eq("id", uid);
  }

  return {
    fullName: data.full_name,
    email: data.email,
    sellRef: data.sell_ref,
    interacQuestion: question,
    interacAnswer: answer,
  };
}

function generateInteracQA(uid: string) {
  const code = uid.replace(/-/g, "").slice(0, 6).toUpperCase();
  return {
    question: "Code Ooble ?",
    answer: `OB${code}`,
  };
}
