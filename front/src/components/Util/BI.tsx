import "bootstrap-icons/font/bootstrap-icons.css";

type BIProps = {
  iconName: string;
};

const BI = (props: BIProps) => (
  <i className={`bi bi-${props.iconName}`} />
);

export default BI;
