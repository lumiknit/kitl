import "bootstrap-icons/font/bootstrap-icons.css";

type BICheckBoxProps = {
  checked: boolean;
};

const BICheckBox = (props: BICheckBoxProps) => {
  if (props.checked) {
    return <i className="bi bi-check-square" />;
  } else {
    return <i className="bi bi-square" />;
  }
};

export default BICheckBox;
