import { ReactFlowProvider } from "reactflow";
import KitlEditorInner from "./KitlEditorInner";

export type KitlEditorState = {
  innerHeight: number;
};

const KitlEditor = () => {
  return (
    <ReactFlowProvider>
      <KitlEditorInner />
    </ReactFlowProvider>
  );
};

export default KitlEditor;
