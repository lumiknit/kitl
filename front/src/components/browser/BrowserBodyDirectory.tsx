import { Button, Color, InputGroup } from "@/block";
import Checkbox from "@/block/Checkbox";
import DropdownButton from "@/block/DropdownButton";
import InputFile from "@/block/InputFile";
import {
	toastError,
	toastProgress,
	toastSuccess,
} from "@/block/ToastContainer";
import { StorageItem, StorageItemType } from "@/client/storage";
import { dateToShortString, splitHostPath, splitPath } from "@/common";
import { bytesToString } from "@/common";
import { s } from "@/locales";
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
import { Component, For, Show, createEffect } from "solid-js";
import {
	NothingSelectedError,
	State,
	StateWrap,
	cd,
	copySelectedFiles,
	deleteSelectedFiles,
	findUnusedName,
	loadData,
	newFile,
	newFolder,
	pasteFiles,
	reload,
	renameSelectedFiles,
	setFileSelected,
	uploadFile,
} from "./state";

// Helpers

const hCopyFiles = (state: State) => () => {
	try {
		copySelectedFiles(state, false);
		toastSuccess(s("toast.copySuccess"));
	} catch (e) {
		if (!(e instanceof NothingSelectedError)) throw e;
		toastError(s("fileBrowser.toast.nothingSelected"));
	}
};

const hCutFiles = (state: State) => () => {
	try {
		copySelectedFiles(state, true);
		toastSuccess(s("toast.cutSuccess"));
		reload(state);
	} catch (e) {
		if (!(e instanceof NothingSelectedError)) throw e;
		toastError(s("fileBrowser.toast.nothingSelected"));
	}
};

const hPasteFiles = (state: State) => async () => {
	try {
		await pasteFiles(state);
		toastSuccess(s("toast.pasteSuccess"));
	} catch (e) {
		toastError(s("fileBrowser.toast.pasteError"));
		console.warn("Failed to paste files", e);
		return;
	}
	reload(state);
};

const hDeleteFiles = (state: State) => async () => {
	try {
		await deleteSelectedFiles(state);
		toastSuccess(s("toast.deleteSuccess"));
	} catch {
		toastError(s("fileBrowser.toast.deleteError"));
	}
	reload(state);
};

const hNewFile = (state: State) => async () => {
	try {
		await newFile(state, findUnusedName(state));
		toastSuccess(s("fileBrowser.toast.newFileSuccess"));
	} catch (e) {
		toastError(s("fileBrowser.toast.newFileError"));
		console.warn("Failed to create new file", e);
	}
	reload(state);
};

const hNewFolder = (state: State) => async () => {
	try {
		await newFolder(state, findUnusedName(state));
		toastSuccess(s("fileBrowser.toast.newFolderSuccess"));
	} catch (e) {
		toastError(s("fileBrowser.toast.newFolderError"));
		console.warn("Failed to create new file", e);
	}
	reload(state);
};

const hUploadFiles = (state: State) => async (files: FileList) => {
	for (const file of files) {
		if (file === undefined) return;
		const name = findUnusedName(state, file.name);
		const newPath = `${state.path[0]()}/${name}`;
		uploadFile(state, newPath, file);
		toastProgress(s("fileBrowser.toast.uploadingFiles"));
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
							&nbsp; {s("menu.copy")}
						</a>,
						<a onClick={() => hCutFiles(props.state)}>
							<TbCut />
							&nbsp; {s("menu.cut")}
						</a>,
						<a onClick={() => hCopyFiles(props.state)}>
							<TbClipboard />
							&nbsp; {s("menu.paste")}
						</a>,
					],
					[
						<a onClick={() => hCopyFiles(props.state)}>
							<TbTrash />
							&nbsp; {s("menu.delete")}
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
