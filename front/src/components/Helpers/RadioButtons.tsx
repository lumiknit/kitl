import { ReactElement, memo, useCallback } from "react";

export type RadioButtonsProps = {
  children: ReactElement | ReactElement[];
  color?: string | string[];
  className?: string;
  selected: number;
  updateSelected: (index: number) => void;
};

const RadioButtons = (props: RadioButtonsProps) => {
  let children;
  if (Array.isArray(props.children)) {
    children = props.children;
  } else {
    children = [props.children];
  }

  let colors: string[];
  if (Array.isArray(props.color)) {
    colors = props.color;
  } else if (props.color) {
    colors = new Array(children.length).fill(props.color);
  } else {
    colors = new Array(children.length).fill("secondary");
  }

  const updateSelected = useCallback(
    (index: number) => {
      if (props.selected !== index) {
        return props.updateSelected(index);
      }
    },
    [props.updateSelected],
  );

  return children.map((child, index) => {
    const cls =
      props.selected === index
        ? `btn btn-${colors[index]} ${props.className || ""}`
        : `btn btn-outline-${colors[index]} ${props.className || ""}`;
    return (
      <button key={index} className={cls} onClick={() => updateSelected(index)}>
        {child}
      </button>
    );
  });
};

export default memo(RadioButtons);
