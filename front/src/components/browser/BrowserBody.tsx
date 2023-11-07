import {
	Component,
	JSX,
	Match,
	Switch,
	createEffect,
	createSignal,
} from "solid-js";
import { State, isFileLarge } from "./state";
import { Button, Color } from "@/block";
import { StorageItemType } from "@/client/storage";
import BrowserBodyDirectory from "./BrowserBodyDirectory";
import { Dynamic } from "solid-js/web";

type BrowserBodyProps = {
	state: State;
};

const BrowserBody: Component<BrowserBodyProps> = props => {
	const [show, setShow] = createSignal(false);
	createEffect(() => {
		console.log("BodyUpdate", props.state.storageItem[0]());
		setShow(!isFileLarge(props.state));
	});
	const options: { [k: string]: () => JSX.Element } = {
		[StorageItemType.NotFound]: () => {
			return <div> Not Found </div>;
		},
		[StorageItemType.Directory]: () => {
			return <BrowserBodyDirectory state={props.state} />;
		},
		[StorageItemType.File]: () => {
			return <div> File </div>;
		},
	};
	const fallback = () => (
		<Dynamic component={options[props.state.storageItem[0]()!.type]} />
	);
	return (
		<Switch fallback={fallback()}>
			<Match when={props.state.storageItem[0]() === undefined}>
				<div>Loading...</div>
			</Match>
			<Match when={!show()}>
				<div>
					File is too large ({props.state.storageItem[0]()!.size}{" "}
					bytes).
					<Button
						color={Color.primary}
						onClick={() => {
							setShow(true);
						}}>
						Show
					</Button>
					<Button
						color={Color.secondary}
						onClick={() => {
							alert("NOT INPML");
						}}>
						Download
					</Button>
				</div>
			</Match>
		</Switch>
	);
};

export default BrowserBody;
