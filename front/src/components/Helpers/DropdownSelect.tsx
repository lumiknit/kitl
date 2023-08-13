export type DropdownSelectProps = {
  options: string[];
  value: string;
  btnClassName?: string;
  onChange: (value: string) => void;
};

const DropdownSelect = (props: DropdownSelectProps) => {
  const btnCls = `btn dropdown-toggle ${props.btnClassName}`;
  console.log(props.options);

  const menus = props.options.map(option => {
    const handleClick = () => {
      props.onChange(option);
    };
    return (
      <li key={option}>
        <a href="#" className="dropdown-item" onClick={handleClick}>
          {option}
        </a>
      </li>
    );
  });

  return (
    <>
      <button
        className={btnCls}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        {props.value}
      </button>
      <ul className="dropdown-menu">{menus}</ul>
    </>
  );
};

export default DropdownSelect;
