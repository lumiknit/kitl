import { Component, For, Show, createEffect } from "solid-js";
import {
	State,
	StateWrap,
	cd,
	loadData,
	newFile,
	newFolder,
	reload,
	setFileSelected,
	uploadFile,
} from "./state";
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
import {
	addIndexToFilename,
	dateToShortString,
	splitHostPath,
	splitPath,
} from "@/common";
import { bytesToString } from "@/common/size";
import InputFile from "@/block/InputFile";
import { s } from "@/locales";
import Checkbox from "@/block/Checkbox";

const Header: Component<StateWrap> = props => {
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
};

const Footer: Component<BrowserBodyDirectoryFooterProps> = props => {
	return (
		<>
			<InputGroup class="my-1">
				<Button
					color={Color.primary}
					onClick={() => {
						newFolder(props.state, props.newName());
						reload(props.state);
					}}
					class="flex-1">
					<TbFolderPlus />
					&nbsp; {s("fileBrowser.folder")}
				</Button>
				<Button
					color={Color.secondary}
					onClick={() => {
						newFile(props.state, props.newName());
						reload(props.state);
					}}
					class="flex-1">
					<TbFilePlus />
					&nbsp; {s("fileBrowser.file")}
				</Button>
			</InputGroup>
			<InputFile
				placeholder={s("fileBrowser.uploadPlaceholder")}
				onFiles={files => {
					for (const file of files) {
						if (file === undefined) return;
						const name = props.newName(file.name);
						const newPath = `${props.state.path[0]()}/${name}`;
						uploadFile(props.state, newPath, file);
					}
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
		name = addIndexToFilename(d, i++);
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
				<Checkbox
					onChange={e => {
						setFileSelected(props.state, props.meta.path, e);
					}}
				/>
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

const BrowserBodyDirectory: Component<StateWrap> = props => {
	const host = () => {
		const [h] = splitHostPath(props.state.path[0]());
		return h;
	};
	const isEmpty = () => {
		const l = props.state.ls[0]();
		return l === undefined || l.length === 0;
	};
	createEffect(() => {
		loadData(props.state);
	});
	return (
		<>
			<Header {...props} />
			<Show
				when={!isEmpty()}
				fallback={<div>{s("fileBrowser.directory.empty")}</div>}>
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
						<For each={props.state.ls[0]()}>
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
				newName={d => newName(props.state.ls[0]()!, d)}
			/>
		</>
	);
};

export default BrowserBodyDirectory;
