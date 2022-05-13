import { debounce } from "./debounce";
import { supabase } from "../supabaseClient";
import { Page } from "../utils/types";

export const updatePage = debounce(
  async (page: Partial<Page> & Pick<Page, "id">) => {
    if (!page) {
      return;
    }
    await supabase.from("pages").update(page).eq("id", page.id);
  },
  500
);
