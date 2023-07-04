import { useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import EditorMain from "./EditorMain";

const handleResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

const EditorRoot = () => {
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ReactFlowProvider>
      <EditorMain />
    </ReactFlowProvider>
  );
};

export default EditorRoot;
