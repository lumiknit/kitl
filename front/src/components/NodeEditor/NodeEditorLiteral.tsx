import * as node from "../../common/node";
import * as j from "../../common/json";
import { faCode, faHashtag, faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export enum LiteralEditingType {
  Special = 0,
  Number,
  String,
  Raw,
}

const literalEditingTypeNames = [
  "Special",
  "Number",
  "String",
  "Raw",
];

const literalEditingIcons = [
  faStar,
  faHashtag,
  faQuoteLeft,
  faCode,
];

export const guessEditingType = (value: j.Json): LiteralEditingType => {
  if (typeof value === "number") {
    return LiteralEditingType.Number;
  } else if (typeof value === "string") {
    return LiteralEditingType.String;
  } else if(typeof value === "object" && value !== null) {
    return LiteralEditingType.Raw;
  } else {
    return LiteralEditingType.Special;
  }
};

export type NodeEditorLiteralProps = {
  value: j.Json;
  updateValue: (value: node.NodeData) => void;
  editingType: LiteralEditingType;
  updateEditingType: (ty: LiteralEditingType) => void;
};

const NodeEditorLiteral = (props: NodeEditorLiteralProps) => {
  /* Type buttons */
  const buttons = (
    <div className="node-editor-type-buttons">
      <div className="input-group">
        {
          literalEditingTypeNames.map((name, i) => {
            const cls = i === props.editingType ? "btn-primary" : "btn-outline-primary";
            return (
              <button
                key={name}
                className={`btn ${cls} flex-grow-1`}
                onClick={() => props.updateEditingType(i)}
              >
                <FontAwesomeIcon icon={literalEditingIcons[i]} />
              </button>
            );
          })
        }
      </div>
    </div>
  );

  let body;
  switch(props.editingType) {

  return (
    <>
      <h3> Literal </h3>
      {buttons}
      {body}
    </>
  );
};

export default NodeEditorLiteral;
