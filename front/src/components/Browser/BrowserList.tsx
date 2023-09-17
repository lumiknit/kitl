export type BrowserListProps = {
  path: string;
};

const BrowserList = (props: BrowserListProps) => {
  return (<div> {props.path} </div>);
};

export default BrowserList;
