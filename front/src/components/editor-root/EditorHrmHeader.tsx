import { Button, Color, InputGroup } from "@/block";
import DropdownButton from "@/block/DropdownButton";
import { Updater } from "@/common";
import { State as HrmState } from "@/hrm";
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
import { ModalType } from "./Modals";
import { State } from "./state";

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
	state: State;
};

const toolSetIcon = (toolSet: ToolSet) => {
	return TOOL_SET_INFO()[toolSet].icon;
};

const toolSet = (toolSet: ToolSet, g: HrmState) => {
	switch (toolSet) {
		case ToolSet.Add:
			return (
				<>
					<Button color={Color.warning} onClick={() => g.undo()}>
						<TbArrowBackUp />
					</Button>
					<Button color={Color.warning} onClick={() => g.redo()}>
						<TbArrowForwardUp />
					</Button>
					<Button
						color={Color.secondary}
						class="flex-1"
						onClick={() => g.addEmptyNode()}>
						<TbSquarePlus />
					</Button>
					<Button
						color={Color.danger}
						class="flex-1"
						onClick={() => g.deleteSelectedNodes()}>
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
						onClick={() => g.deselectAll()}>
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
						onClick={() => g.deleteSelectedNodes()}>
						<TbBackspace />
					</Button>
				</>
			);
	}
};

const toolSetMenus = (g: HrmState, setS: Updater<EditorHrmHeaderState>) => {
	return TOOL_SET_INFO().map((info, idx) => {
		return (
			<a
				onClick={() => {
					setS(s => ({
						...s,
						toolSet: idx as ToolSet,
					}));
					if (g) {
						g.selectMode = idx === ToolSet.Edit;
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
			toolSetMenus(props.state.hrm[0](), setState),
			[
				<a
					onClick={() =>
						props.state.modalActions[0]()?.open(ModalType.Browser)
					}>
					<TbFolderSearch /> {s("mainEditor.menu.browser")}
				</a>,
				<a>
					<TbRocket /> {s("mainEditor.menu.launch")}
				</a>,
				<a
					onClick={() =>
						props.state.modalActions[0]()?.openGraphTools()
					}>
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
				{toolSet(state().toolSet, props.state.hrm[0]())}
			</InputGroup>
		</div>
	);
};

export default EditorHrmHeader;
