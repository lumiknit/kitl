import * as node from "../../common/node";
import * as j from "../../common/json";
import {
  faCode,
  faHashtag,
  faQuoteLeft,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadioButtons from "../Helpers/RadioButtons";
import { ReactElement } from "react";

export enum LiteralEditingType {
  Special = 0,
  Number,
  String,
  Raw,
}

const literalEditingTypeIcons = [faStar, faHashtag, faQuoteLeft, faCode];

export const guessEditingType = (value: j.Json): LiteralEditingType => {
  if (typeof value === "number") {
    return LiteralEditingType.Number;
  } else if (typeof value === "string") {
    return LiteralEditingType.String;
  } else if (typeof value === "object" && value !== null) {
    return LiteralEditingType.Raw;
  } else {
    return LiteralEditingType.Special;
  }
};

export type NodeEditorLiteralState = {
  editingType: LiteralEditingType;
};

export const initialState = (value: node.NodeData): NodeEditorLiteralState => {
  if (value.type !== "literal") {
    return {
      editingType: LiteralEditingType.Raw,
    };
  } else {
    return {
      editingType: guessEditingType(value.value),
    };
  }
};

export type NodeEditorLiteralProps = {
  value: node.LiteralNodeData;
  updateValue: (value: node.LiteralNodeData) => void;
  state: NodeEditorLiteralState;
  updateState: (state: NodeEditorLiteralState) => void;
};

const specialBody = (props: NodeEditorLiteralProps): ReactElement => {
  let selected;
  switch (props.value.value) {
    case false:
      selected = 1;
      break;
    case true:
      selected = 2;
      break;
    default:
      selected = 0; // null
  }
  const updateSelected = (index: number) => {
    let value = null;
    switch (index) {
      case 1:
        value = false;
        break;
      case 2:
        value = true;
        break;
    }
    return props.updateValue({
      ...props.value,
      value: value,
    });
  };
  return (
    <div className="input-group">
      <RadioButtons
        className="flex-grow-1"
        selected={selected}
        updateSelected={updateSelected}>
        <span>null</span>
        <span>false</span>
        <span>true</span>
      </RadioButtons>
    </div>
  );
};

const NodeEditorLiteral = (props: NodeEditorLiteralProps) => {
  /* Type buttons */
  const buttons = (
    <div className="node-editor-type-buttons">
      <div className="input-group">
        <RadioButtons
          color="primary"
          className="flex-grow-1"
          selected={props.state.editingType}
          updateSelected={index => {
            props.updateState({
              ...props.state,
              editingType: index as LiteralEditingType,
            });
          }}>
          {literalEditingTypeIcons.map((icon, i) => (
            <FontAwesomeIcon key={i} icon={icon} />
          ))}
        </RadioButtons>
      </div>
    </div>
  );

  let body;
  switch (props.state.editingType) {
    case LiteralEditingType.Special:
      body = specialBody(props);
      break;
  }
  return (
    <>
      <h3> Literal </h3>
      {buttons}
      {body}
    </>
  );
};

export default NodeEditorLiteral;
