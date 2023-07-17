import { useEffect, useState } from "react";
import { ReactFlowProvider } from "reactflow";
import KitlEditorInner from "./KitlEditorInner";

export type KitlEditorState = {
  innerHeight: number;
};

const KitlEditor = () => {
  const [state, setState] = useState<KitlEditorState>({
    innerHeight: -1,
  });
  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    setState((state: KitlEditorState) => ({
      ...state,
      innerHeight: window.innerHeight,
    }));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ReactFlowProvider>
      <KitlEditorInner innerHeight={state.innerHeight} />
    </ReactFlowProvider>
  );
};

export default KitlEditor;
