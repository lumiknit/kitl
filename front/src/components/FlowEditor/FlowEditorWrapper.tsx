import { ReactFlowProvider } from "reactflow";

import FlowEditor, { FlowEditorProps } from "./FlowEditor";

const FlowEditorWrapper = (props: FlowEditorProps) => {
  return (
    <ReactFlowProvider>
      <FlowEditor {...props} />
    </ReactFlowProvider>
  );
};

export default FlowEditorWrapper;
