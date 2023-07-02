import { useEffect } from "react";

import FlowEditor from "./FlowEditor/FlowEditor";
import JsonEditor from "./JsonEditor/JsonEditor";

import "./EditorRoot.css";

export type EditorRootProps = {
  editing: string;
};

const EditorRoot = (props: EditorRootProps) => {
  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let mainComponent = undefined;
  if (props.editing === "json") {
    mainComponent = <JsonEditor />;
  } else if (props.editing === "flow") {
    mainComponent = <FlowEditor />;
  }
  return <div className="editor-root">{mainComponent}</div>;
};

export default EditorRoot;
