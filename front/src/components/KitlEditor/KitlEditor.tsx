import { ReactFlowProvider } from "reactflow";
import KitlEditorInner from "./KitlEditorInner";

import 'bootstrap/dist/css/bootstrap.min.css';

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
