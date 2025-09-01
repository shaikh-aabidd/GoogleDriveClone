import { supabase } from "../../../src/supabaseClient";
import { useState } from "react";

export default function FileOpenButton({ file }) {
  const [url, setUrl] = useState(null);

  const handleOpen = async () => {
    // Remove "users/" from the start since bucket is "files"

    const { data, error } = await supabase.storage
      .from("files") // ✅ bucket name
      .createSignedUrl(file.file_path, 60); // valid for 60s

    if (error) {
      console.error("Error generating signed URL:", error);
      return;
    }

    setUrl(data.signedUrl);
    window.open(data.signedUrl, "_blank");
  };

  return (
    <button
      onClick={handleOpen}
      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Open
    </button>
  );
}
