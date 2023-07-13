import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import KitlEditorInner from "./KitlEditorInner";

const handleResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

const KitlEditor = () => {
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ReactFlowProvider>
      <KitlEditorInner />
    </ReactFlowProvider>
  );
};

export default KitlEditor;
