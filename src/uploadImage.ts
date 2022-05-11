import { supabase } from "./supabaseClient";

export const uploadImage = async (file?: File) => {
  try {
    // setUploading(true)

    if (!file) {
      throw new Error("You must select an image to upload.");
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    return { filePath, fileName };
  } catch (error) {
    // alert(error.message)
  } finally {
    // setUploading(false)
  }
};
