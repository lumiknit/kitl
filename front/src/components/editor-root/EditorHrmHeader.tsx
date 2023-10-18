import { Button, Color, InputGroup } from "@/block";
import DropdownButton from "@/block/DropdownButton";
import { Box, Updater } from "@/common";
import { State } from "@/hrm";
import {
	TbArrowBackUp,
	TbArrowForwardUp,
	TbBackspace,
	TbBinaryTree,
	TbClipboard,
	TbCopy,
	TbDeselect,
	TbEdit,
	TbFolderSearch,
	TbRocket,
	TbScissors,
	TbSquarePlus,
} from "solid-icons/tb";
import { Component, createSignal } from "solid-js";
import { s } from "@/locales";
import { ModalActions } from "./Modals";

enum ToolSet {
	Add,
	Edit,
}

const TOOL_SET_INFO = () => [
	{
		name: s("mainEditor.menu.addTools"),
		icon: <TbSquarePlus />,
	},
	{
		name: s("mainEditor.menu.selectTools"),
		icon: <TbEdit />,
	},
];

type EditorHrmHeaderState = {
	toolSet: ToolSet;
};

type EditorHrmHeaderProps = {
	stateBox: Box<State>;
	modalActionsBox: Box<ModalActions>;
};

const toolSetIcon = (toolSet: ToolSet) => {
	return TOOL_SET_INFO()[toolSet].icon;
};

const toolSet = (toolSet: ToolSet, stateBox: Box<State>) => {
	switch (toolSet) {
		case ToolSet.Add:
			return (
				<>
					<Button
						color={Color.warning}
						onClick={() => stateBox[0]?.undo()}>
						<TbArrowBackUp />
					</Button>
					<Button
						color={Color.warning}
						onClick={() => stateBox[0]?.redo()}>
						<TbArrowForwardUp />
					</Button>
					<Button
						color={Color.secondary}
						class="flex-1"
						onClick={() => stateBox[0]?.addEmptyNode()}>
						<TbSquarePlus />
					</Button>
					<Button
						color={Color.danger}
						class="flex-1"
						onClick={() => stateBox[0]?.deleteSelectedNodes()}>
						<TbBackspace />
					</Button>
				</>
			);
		case ToolSet.Edit:
			return (
				<>
					<Button
						color={Color.warning}
						class="flex-1"
						onClick={() => stateBox[0]?.deselectAll()}>
						<TbDeselect />
					</Button>
					<Button
						color={Color.secondary}
						class="flex-1"
						onClick={() => alert("unimpl")}>
						<TbScissors />
					</Button>
					<Button
						color={Color.secondary}
						class="flex-1"
						onClick={() => alert("unimpl")}>
						<TbCopy />
					</Button>
					<Button
						color={Color.secondary}
						class="flex-1"
						onClick={() => alert("unimpl")}>
						<TbClipboard />
					</Button>
					<Button
						color={Color.danger}
						class="flex-1"
						onClick={() => stateBox[0]?.deleteSelectedNodes()}>
						<TbBackspace />
					</Button>
				</>
			);
	}
};

const toolSetMenus = (g: Box<State>, setS: Updater<EditorHrmHeaderState>) => {
	return TOOL_SET_INFO().map((info, idx) => {
		return (
			<a
				onClick={() => {
					setS(s => ({
						...s,
						toolSet: idx as ToolSet,
					}));
					if (g[0]) {
						g[0].selectMode = idx === ToolSet.Edit;
					}
				}}>
				{" "}
				{info.icon} {info.name}
			</a>
		);
	});
};

const EditorHrmHeader: Component<EditorHrmHeaderProps> = props => {
	const [state, setState] = createSignal<EditorHrmHeaderState>({
		toolSet: ToolSet.Add,
	});
	const dropdownList = () => {
		return [
			toolSetMenus(props.stateBox, setState),
			[
				<a>
					<TbFolderSearch /> {s("mainEditor.menu.browser")}
				</a>,
				<a>
					<TbRocket /> {s("mainEditor.menu.launch")}
				</a>,
				<a onClick={() => props.modalActionsBox?.[0]?.openGraphTools()}>
					<TbBinaryTree /> {s("mainEditor.menu.graphTools")}
				</a>,
			],
		];
	};
	return (
		<div class="editor-root-hrm-header-container">
			<InputGroup class="editor-root-hrm-header shadow-2">
				<DropdownButton color={Color.primary} list={dropdownList()}>
					{toolSetIcon(state().toolSet)}
				</DropdownButton>
				{toolSet(state().toolSet, props.stateBox)}
			</InputGroup>
		</div>
	);
};

export default EditorHrmHeader;
