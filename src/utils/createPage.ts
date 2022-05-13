import { nanoid } from "nanoid";
import { supabase } from "../supabaseClient";

export const createPage = async () => {
  const user = supabase.auth.user();
  if (!user) {
    return;
  }
  const slug = nanoid();

  const page = {
    title: "Untitled",
    slug,
    nodes: [],
    created_by: user.id,
  };

  await supabase.from("pages").insert(page);
  return page;
};
