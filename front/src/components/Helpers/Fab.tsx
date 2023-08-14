import { ReactElement, memo } from "react";

import "./Fab.scss";

export type FabProps = {
  onClick: () => void;
  icon: ReactElement;
  className?: string;
};

const Fab = (props: FabProps) => {
  return (
    <div className={`f-fab ${props.className ?? ""}`} onClick={props.onClick}>
      {props.icon}
    </div>
  );
};

export default memo(Fab);
