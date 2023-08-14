import { ReactElement, memo, useCallback } from "react";

import * as array from "../../common/array";

export type RadioButtonsProps = {
  children: ReactElement | ReactElement[];
  color?: string | string[];
  className?: string;
  selected: number;
  onClick: (index: number) => void;
};

const RadioButtons = (props: RadioButtonsProps) => {
  const children = array.makeArray(props.children, <></>);
  const colors = array.makeArray(props.color, "secondary", children.length);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const index = parseInt(event.currentTarget.value);
      return props.onClick(index);
    },
    [props.onClick],
  );

  return children.map((child, index) => {
    const cls =
      props.selected === index
        ? `btn btn-${colors[index]} ${props.className || ""}`
        : `btn btn-outline-${colors[index]} ${props.className || ""}`;
    return (
      <button
        key={`radio-button--${index}`}
        className={cls}
        onClick={handleClick}
        value={index}>
        {child}
      </button>
    );
  });
};

export default memo(RadioButtons);
