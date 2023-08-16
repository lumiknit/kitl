import { useState } from "react";
import { ReactFlowProvider } from "reactflow";

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

import KitlEditorInner from "./KitlEditorInner";
import { FlowContext } from "../FlowEditor/context";

const KitlEditor = () => {
  const [flowContext, setFlowContext] = useState<FlowContext>(
    new FlowContext("scratch", "kitl"),
  );
  return (
    <ReactFlowProvider>
      <KitlEditorInner
        flowContext={flowContext}
        setFlowContext={setFlowContext}
      />
    </ReactFlowProvider>
  );
};

export default KitlEditor;
