import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NodeData, NodeType } from "../state/AppStateContext";
import { supabase } from "../supabaseClient";

type PageNodeProps = {
	node: NodeData;
}

export const PageNode = ({
  node,
}: PageNodeProps) => {
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    const fetchPageTitle = async () => {
      const { data } = await supabase
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
