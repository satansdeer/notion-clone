import { nanoid } from "nanoid";
import { supabase } from "./supabaseClient";

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

  const { data } = await supabase.from("pages").insert(page);
  console.log("Created page", data);

  return page;
};
