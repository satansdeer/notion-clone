import { supabase } from "./supabaseClient";

export const uploadImage = async (event: any) => {
  try {
    // setUploading(true)

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    return {filePath, fileName};
  } catch (error) {
    // alert(error.message)
  } finally {
    // setUploading(false)
  }
};
