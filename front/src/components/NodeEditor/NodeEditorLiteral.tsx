import * as node from "../../common/node";
import * as j from "../../common/json";
import RadioButtons from "../Helpers/RadioButtons";
import { ReactElement } from "react";
import NodeEditorJson from "./NodeEditorJson";
import NodeEditorNumber from "./NodeEditorNumber";
import NodeEditorString from "./NodeEditorString";
import i18n from "../../locales/i18n";

import { BsQuote } from "react-icons/bs";
import {
  TbCircle,
  TbCircleDashed,
  TbCircleOff,
  TbCircleCheck,
  Tb123,
  TbBraces,
} from "react-icons/tb";

export enum LiteralEditingType {
  Special = 0,
  Number,
  String,
  Raw,
}

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
  if (value.type !== node.NodeType.Literal) {
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
  onChange: (value: node.LiteralNodeData) => void;
  onReturnKey?: () => void;
  state: NodeEditorLiteralState;
  updateState: (
    state: NodeEditorLiteralState,
    value?: node.LiteralNodeData,
  ) => void;
};

const specialBody = (props: NodeEditorLiteralProps): ReactElement => {
  let selected = -1;
  switch (props.value.value) {
    case null:
      selected = 0;
      break;
    case false:
      selected = 1;
      break;
    case true:
      selected = 2;
      break;
  }
  const handleChange = (index: number) => {
    let value = null;
    switch (index) {
      case 1:
        value = false;
        break;
      case 2:
        value = true;
        break;
    }
    return props.onChange({
      ...props.value,
      value: value,
    });
  };
  return (
    <div className="input-group">
      <RadioButtons
        className="flex-grow-1"
        selected={selected}
        onClick={handleChange}>
        <span>
          <TbCircleDashed />
          {i18n.t("value.null")}
        </span>
        <span>
          <TbCircleOff />
          {i18n.t("value.false")}
        </span>
        <span>
          <TbCircleCheck />
          {i18n.t("value.true")}
        </span>
      </RadioButtons>
    </div>
  );
};

const NodeEditorLiteral = (props: NodeEditorLiteralProps) => {
  const handleLiteralTypeChange = (index: number) => {
    if (index === props.state.editingType) {
      return;
    }
    let v = props.value.value;
    switch (index) {
      case LiteralEditingType.Special:
        v = null;
        break;
      case LiteralEditingType.Number:
        v = parseFloat(v as string);
        if (isNaN(v)) {
          v = 0;
        }
        break;
      case LiteralEditingType.String:
        v = JSON.stringify(v);

        break;
    }
    props.updateState(
      {
        ...props.state,
        editingType: index as LiteralEditingType,
      },
      {
        ...props.value,
        value: v,
      },
    );
  };
  /* Type buttons */
  const buttons = (
    <div className="node-editor-type-buttons mb-1">
      <div className="input-group">
        <RadioButtons
          color="primary"
          className="flex-grow-1"
          selected={props.state.editingType}
          onClick={handleLiteralTypeChange}>
          <TbCircle />
          <Tb123 />
          <BsQuote />
          <TbBraces />
        </RadioButtons>
      </div>
    </div>
  );

  const updateValue = (value: j.Json) => {
    props.onChange({
      ...props.value,
      value: value,
    });
  };

  let body;
  switch (props.state.editingType) {
    case LiteralEditingType.Special:
      body = specialBody(props);
      break;
    case LiteralEditingType.Number:
      body = (
        <NodeEditorNumber
          value={props.value.value}
          onChange={updateValue}
          onReturnKey={props.onReturnKey}
        />
      );
      break;
    case LiteralEditingType.String:
      body = (
        <NodeEditorString value={props.value.value} onChange={updateValue} />
      );
      break;
    case LiteralEditingType.Raw:
      body = (
        <NodeEditorJson value={props.value.value} onChange={updateValue} />
      );
      break;
  }
  return (
    <>
      <h3> {i18n.t("nodeEditor.common.literal")} </h3>
      {buttons}
      {body}
    </>
  );
};

export default NodeEditorLiteral;
