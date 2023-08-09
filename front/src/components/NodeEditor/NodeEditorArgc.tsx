import { ChangeEvent, useCallback, useRef } from "react";

export type NodeEditorArgcProps = {
  defaultValue: number;
  onChange?: (value: number) => void;
  className?: string;
  readonly?: boolean;
};

const NodeEditorArgc = (props: NodeEditorArgcProps) => {
  const onArgcChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (props.onChange === undefined) {
        return;
      }
      if (e.target.value === "") {
        return;
      }
      let v = parseInt(e.target.value);
      if (isNaN(v)) {
        const f = parseFloat(e.target.value);
        if (!isNaN(f)) {
          e.target.value = f.toString();
          v = Math.round(f);
        } else {
          e.target.value = "0";
          v = 0;
        }
      }
      if (v < 0) {
        e.target.value = "0";
        v = 0;
      }
      props.onChange(v);
    },
    [props.onChange],
  );
  return (
    <div className={`form-floating mb-1 ${props.className}`}>
      {props.readonly ? (
        <input
          type="number"
          className="form-control"
          defaultValue={props.defaultValue}
          placeholder="Argument Count"
          readOnly
          disabled
        />
      ) : (
        <input
          type="number"
          className="form-control"
          defaultValue={props.defaultValue}
          onChange={onArgcChange}
          placeholder="Argument Count"
        />
      )}
      <label>Argument Count</label>
    </div>
  );
};

export default NodeEditorArgc;
