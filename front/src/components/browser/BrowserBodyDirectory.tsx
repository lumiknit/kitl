import { Component } from "solid-js";
import { State } from "./state";

type BrowserBodyDirectoryProps = {
	state: State;
};

const BrowserBodyDirectory: Component<BrowserBodyDirectoryProps> = props => {
	return <>{props.state.path}</>;
};

export default BrowserBodyDirectory;
