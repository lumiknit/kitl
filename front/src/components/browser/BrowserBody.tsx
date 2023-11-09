import { Component, Show } from "solid-js";
import { State } from "./state";
import { StorageItemType } from "@/client/storage";
import BrowserBodyDirectory from "./BrowserBodyDirectory";
import { Dynamic } from "solid-js/web";
import BrowserBodyFile from "./BrowserBodyFile";
import Loading from "./Loading";

type BrowserBodyProps = {
	state: State;
};

const options: Map<StorageItemType, Component<BrowserBodyProps>> = new Map([
	[
		StorageItemType.NotFound,
		() => {
			return <div> Not Found </div>;
		},
	],
	[StorageItemType.Directory, BrowserBodyDirectory],
	[StorageItemType.File, BrowserBodyFile],
]);

const BrowserBody: Component<BrowserBodyProps> = props => {
	return (
		<Show
			when={props.state.storageItem[0]() !== undefined}
			fallback={<Loading>Loading metadata...</Loading>}>
			<Dynamic
				component={options.get(props.state.storageItem[0]()!.type)}
				state={props.state}
			/>
		</Show>
	);
};

export default BrowserBody;
