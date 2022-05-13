import { debounce } from "../debounce";
import { supabase } from "../supabaseClient";
import { Page } from "./usePageState";

export const updatePage = debounce(
  async (page: Partial<Page> & Pick<Page, "id">) => {
    if (!page) {
      return;
    }
    const { error } = await supabase
      .from("pages")
      .update(page)
      .eq("id", page.id);
  },
  500
);
