import { ReactElement, memo, useCallback } from "react";

import * as array from "../../common/array";

export type RadioButtonsProps = {
  children: ReactElement | ReactElement[];
  color?: string | string[];
  className?: string;
  selected: number;
  updateSelected: (index: number) => void;
};

const RadioButtons = (props: RadioButtonsProps) => {
  const children = array.makeArray(props.children, <></>);
  const colors = array.makeArray(props.color, "secondary", children.length);

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
    const handleClick = () => {
      updateSelected(index);
    };
    return (
      <button
        key={`radio-button--${index}`}
        className={cls}
        onClick={handleClick}>
        {child}
      </button>
    );
  });
};

export default memo(RadioButtons);
