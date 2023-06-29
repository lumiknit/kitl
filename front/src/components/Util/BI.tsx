import "bootstrap-icons/font/bootstrap-icons.css";

type BIProps = {
  iconName: string;
};

const BI = (props: BIProps) => {
  const iconClass = `bi bi-${props.iconName}`;
  return <i className={iconClass} />;
};

export default BI;
