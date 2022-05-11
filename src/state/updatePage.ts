import { debounce } from "../debounce";
import { supabase } from "../supabaseClient";
import { Page } from "./AppStateContext";

export const updatePage = debounce(
  async (page: Partial<Page> & Pick<Page, "id">) => {
    if (!page) {
      return;
    }
		console.log("updatePage", page)
    const { error } = await supabase
      .from("pages")
      .update(page)
      .eq("id", page.id);
  },
  500
);
