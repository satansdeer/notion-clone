import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const PageNode = ({
  node,
}: any) => {
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const fetchPageTitle = async () => {
      const { data, error, status } = await supabase
        .from("pages")
        .select("title")
        .eq("slug", node.value)
        .single();
      setPageTitle(data?.title);
    };
    if (node.type === "page" && node.value) {
      fetchPageTitle();
    }
  }, [node.type, node.value]);

  const navigateToPage = () => {
    navigate(`/${node.value}`);
  };

  return (
    <div onClick={navigateToPage} className={`node ${node.type}`}>
      📄 {pageTitle}
    </div>
  );
};
