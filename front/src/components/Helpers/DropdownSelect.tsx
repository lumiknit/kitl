export type DropdownSelectProps = {
  options: string[];
  value: string;
  btnClassName?: string;
  onChange: (value: string) => void;
};

const DropdownSelect = (props: DropdownSelectProps) => {
  const btnCls = `btn dropdown-toggle ${props.btnClassName}`;
  return (
    <>
      <button
        className={btnCls}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        {props.value}
      </button>
      <ul className="dropdown-menu">
        {props.options.map((option, index) => (
          <li key={index}>
            <a
              className="dropdown-item"
              href="#"
              onClick={() => props.onChange(option)}>
              {option}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DropdownSelect;
