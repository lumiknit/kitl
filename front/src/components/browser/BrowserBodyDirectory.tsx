import { Component, For, Show, createEffect } from "solid-js";
import {
	NothingSelectedError,
	State,
	StateWrap,
	cd,
	copySelectedFiles,
	cutSelectedFiles,
	deleteSelectedFiles,
	loadData,
	newFile,
	newFolder,
	pasteFiles,
	reload,
	renameSelectedFiles,
	setFileSelected,
	uploadFile,
} from "./state";
import { StorageItem, StorageItemType } from "@/client/storage";
import { Button, Color, InputGroup } from "@/block";
import {
	TbClipboard,
	TbCopy,
	TbCut,
	TbEdit,
	TbFile,
	TbFilePlus,
	TbFolder,
	TbFolderPlus,
	TbMenu,
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
import { ToastType, toast } from "@/block/ToastContainer";
import DropdownButton from "@/block/DropdownButton";

// Helpers

const hCopyFiles = (state: State) => () => {
	try {
		copySelectedFiles(state);
		toast(s("fileBrowser.toasts.copySuccess"), { type: ToastType.Success });
	} catch (e) {
		if (!(e instanceof NothingSelectedError)) throw e;
		toast(s("fileBrowser.toasts.nothingSelected"), {
			type: ToastType.Error,
		});
	}
};

const hCutFiles = (state: State) => () => {
	try {
		cutSelectedFiles(state);
		toast(s("fileBrowser.toasts.cutSuccess"), { type: ToastType.Success });
		reload(state);
	} catch (e) {
		if (!(e instanceof NothingSelectedError)) throw e;
		toast(s("fileBrowser.toasts.nothingSelected"), {
			type: ToastType.Error,
		});
	}
};

const hPasteFiles = (state: State) => async () => {
	try {
		await pasteFiles(state);
		toast(s("fileBrowser.toasts.pasteSuccess"), {
			type: ToastType.Success,
		});
	} catch (e) {
		toast(s("fileBrowser.toasts.pasteError"), { type: ToastType.Error });
		console.warn("Failed to paste files", e);
		return;
	}
	reload(state);
};

const hDeleteFiles = (state: State) => async () => {
	try {
		await deleteSelectedFiles(state);
		toast(s("fileBrowser.toasts.deleteSuccess"), {
			type: ToastType.Success,
		});
	} catch {
		toast(s("fileBrowser.toasts.deleteError"), { type: ToastType.Error });
	}
	reload(state);
};

const newName = (state: State, d?: string): string => {
	d = d ?? "new";
	const ls = state.ls[0]();
	if (ls === undefined) return d;
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

const hNewFile = (state: State) => async () => {
	try {
		await newFile(state, newName(state));
		toast(s("fileBrowser.toasts.newFileSuccess"), {
			type: ToastType.Success,
		});
	} catch (e) {
		toast(s("fileBrowser.toasts.newFileError"), { type: ToastType.Error });
		console.warn("Failed to create new file", e);
	}
	reload(state);
};

const hNewFolder = (state: State) => async () => {
	try {
		await newFolder(state, newName(state));
		toast(s("fileBrowser.toasts.newFolderSuccess"), {
			type: ToastType.Success,
		});
	} catch (e) {
		toast(s("fileBrowser.toasts.newFolderError"), {
			type: ToastType.Error,
		});
		console.warn("Failed to create new file", e);
	}
	reload(state);
};

const hUploadFiles = (state: State) => async (files: FileList) => {
	for (const file of files) {
		if (file === undefined) return;
		const name = newName(state, file.name);
		const newPath = `${state.path[0]()}/${name}`;
		uploadFile(state, newPath, file);
		toast(s("fileBrowser.toasts.uploadingFiles"), {
			type: ToastType.Progress,
		});
	}
};

// Components

const Header: Component<StateWrap> = props => {
	return (
		<InputGroup class="my-1">
			<DropdownButton
				color={Color.primary}
				list={[
					[
						<a onClick={() => renameSelectedFiles(props.state)}>
							<TbEdit />
							&nbsp; {s("fileBrowser.menu.rename")}
						</a>,
					],
					[
						<a onClick={() => hCopyFiles(props.state)}>
							<TbCopy />
							&nbsp; {s("fileBrowser.menu.copy")}
						</a>,
						<a onClick={() => hCutFiles(props.state)}>
							<TbCut />
							&nbsp; {s("fileBrowser.menu.cut")}
						</a>,
						<a onClick={() => hCopyFiles(props.state)}>
							<TbClipboard />
							&nbsp; {s("fileBrowser.menu.paste")}
						</a>,
					],
					[
						<a onClick={() => hCopyFiles(props.state)}>
							<TbTrash />
							&nbsp; {s("fileBrowser.menu.delete")}
						</a>,
					],
				]}>
				<TbMenu />
			</DropdownButton>
			<Button
				color={Color.secondary}
				onClick={hPasteFiles(props.state)}
				class="flex-1">
				<TbClipboard />
			</Button>
			<Button
				color={Color.secondary}
				onClick={hCopyFiles(props.state)}
				class="flex-1">
				<TbCopy />
			</Button>
			<Button
				color={Color.warning}
				onClick={hCutFiles(props.state)}
				class="flex-1">
				<TbCut />
			</Button>
			<Button
				color={Color.danger}
				onClick={hDeleteFiles(props.state)}
				class="flex-1">
				<TbTrash />
			</Button>
		</InputGroup>
	);
};

type BrowserBodyDirectoryFooterProps = {
	state: State;
};

const Footer: Component<BrowserBodyDirectoryFooterProps> = props => {
	return (
		<>
			<InputGroup class="my-1">
				<Button
					color={Color.primary}
					onClick={hNewFolder(props.state)}
					class="flex-1">
					<TbFolderPlus />
					&nbsp; {s("fileBrowser.folder")}
				</Button>
				<Button
					color={Color.secondary}
					onClick={hNewFile(props.state)}
					class="flex-1">
					<TbFilePlus />
					&nbsp; {s("fileBrowser.file")}
				</Button>
			</InputGroup>
			<InputFile
				placeholder={s("fileBrowser.uploadPlaceholder")}
				onFiles={hUploadFiles(props.state)}
			/>
		</>
	);
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
			<Footer state={props.state} />
		</>
	);
};

export default BrowserBodyDirectory;
