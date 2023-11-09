import { Component, For, Show, createEffect, createSignal } from "solid-js";
import { State, cd, newFile, newFolder, uploadFile } from "./state";
import { clients } from "@/client";
import { StorageItem, StorageItemType } from "@/client/storage";
import { Button, Color, InputGroup } from "@/block";
import {
	TbClipboard,
	TbCopy,
	TbCut,
	TbFile,
	TbFilePlus,
	TbFolder,
	TbFolderPlus,
	TbQuestionMark,
	TbTrash,
} from "solid-icons/tb";
import { dateToShortString, splitHostPath, splitPath } from "@/common";
import { bytesToString } from "@/common/size";
import InputFile from "@/block/InputFile";
import { s } from "@/locales";
import Checkbox from "@/block/Checkbox";

type BrowserBodyDirectoryProps = {
	state: State;
};

const Header: Component<BrowserBodyDirectoryProps> = props => {
	return (
		<InputGroup class="my-1">
			<Button
				color={Color.secondary}
				onClick={props.state.onClose}
				class="flex-1">
				<TbCut />
			</Button>
			<Button
				color={Color.secondary}
				onClick={props.state.onClose}
				class="flex-1">
				<TbCopy />
			</Button>
			<Button
				color={Color.secondary}
				onClick={props.state.onClose}
				class="flex-1">
				<TbClipboard />
			</Button>
			<Button
				color={Color.danger}
				onClick={props.state.onClose}
				class="flex-1">
				<TbTrash />
			</Button>
		</InputGroup>
	);
};

type BrowserBodyDirectoryFooterProps = {
	state: State;
	newName: (d?: string) => string;
	reload: () => void;
};

const Footer: Component<BrowserBodyDirectoryFooterProps> = props => {
	return (
		<>
			<InputGroup class="my-1">
				<Button
					color={Color.primary}
					onClick={() => {
						newFolder(props.state, props.newName());
						props.reload();
					}}
					class="flex-1">
					<TbFolderPlus />
					&nbsp; {s("fileBrowser.folder")}
				</Button>
				<Button
					color={Color.secondary}
					onClick={() => {
						newFile(props.state, props.newName());
						props.reload();
					}}
					class="flex-1">
					<TbFilePlus />
					&nbsp; {s("fileBrowser.file")}
				</Button>
			</InputGroup>
			<InputFile
				placeholder={s("fileBrowser.upload")}
				onChange={e => {
					if (e.target.files === null) return;
					const file = e.target.files[0];
					if (file === undefined) return;
					const name = props.newName(file.name);
					const newPath = `${props.state.path[0]()}/${name}`;
					uploadFile(props.state, newPath, file);
				}}
			/>
		</>
	);
};

const newName = (ls: StorageItem[], d?: string) => {
	if (d === undefined) d = "new";
	// Generate a new name
	const names = new Set(
		ls.map(item => {
			const p = splitPath(item.path);
			return p[p.length - 1];
		}),
	);
	let name = d,
		i = 0;
	while (names.has(name)) {
		name = `${d}-${++i}`;
	}
	return name;
};

type ItemProps = {
	state: State;
	host: string;
	meta: StorageItem;
};

const Item = (props: ItemProps) => {
	const name = () => {
		const p = splitPath(props.meta.path);
		return p[p.length - 1];
	};
	const icon = () => {
		switch (props.meta.type) {
			case StorageItemType.Directory:
				return <TbFolder />;
			case StorageItemType.File:
				return <TbFile />;
			default:
				return <TbQuestionMark />;
		}
	};
	return (
		<tr>
			<td>
				<Checkbox />
			</td>
			<td class="word-break-all">
				<a
					onClick={() => {
						cd(props.state, `${props.host}:${props.meta.path}`);
					}}>
					{icon()}&nbsp;{name()}
				</a>
			</td>
			<td class="text-right">
				{bytesToString(props.meta.size)}
				<br />
				{dateToShortString(props.meta.lastModified)}
			</td>
		</tr>
	);
};

const BrowserBodyDirectory: Component<BrowserBodyDirectoryProps> = props => {
	const [ls, setLs] = createSignal<StorageItem[]>([]);
	const loadList = async () => {
		if (props.state.storageItem[0]() === undefined) return;
		const loaded = await clients.list(props.state.path[0]());
		// Sort directories first, then by name
		loaded.sort((a, b) => {
			if (a.type === b.type) {
				return a.path.localeCompare(b.path);
			} else {
				return a.type === StorageItemType.Directory ? -1 : 1;
			}
		});
		setLs(loaded);
	};
	const host = () => {
		const [h] = splitHostPath(props.state.path[0]());
		return h;
	};
	createEffect(loadList);
	return (
		<>
			<Header {...props} />
			<Show when={ls().length > 0} fallback={<div> Empty </div>}>
				<table class="w-100">
					<thead>
						<tr>
							<th></th>
							<th>{s("fileBrowser.name")}</th>
							<th class="text-right">
								{s("fileBrowser.size")}
								<br /> {s("fileBrowser.modified")}
							</th>
						</tr>
					</thead>
					<tbody>
						<For each={ls()}>
							{item => (
								<Item
									state={props.state}
									host={host()}
									meta={item}
								/>
							)}
						</For>
					</tbody>
				</table>
			</Show>
			<Footer
				state={props.state}
				newName={d => newName(ls(), d)}
				reload={loadList}
			/>
		</>
	);
};

export default BrowserBodyDirectory;
