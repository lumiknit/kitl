import { Button, Color, InputGroup, InputText } from "@/block";
import DropdownButton from "@/block/DropdownButton";
import { toastSuccess } from "@/block/ToastContainer";
import { State as HrmState } from "@/hrm";
import { s } from "@/locales";
import {
	TbArrowBackUp,
	TbArrowForwardUp,
	TbBackspace,
	TbBinaryTree,
	TbClipboard,
	TbCopy,
	TbDeselect,
	TbDeviceFloppy,
	TbEdit,
	TbFolderSearch,
	TbRocket,
	TbScissors,
	TbTools,
} from "solid-icons/tb";
import { Component } from "solid-js";
import {
	State,
	ToolSet,
	changeMode,
	openBrowserModal,
	openGraphToolsModal,
	openLaunchModal,
	saveToFile,
} from "./state";

const TOOL_SET_INFO = () => [
	{
		name: s("mainEditor.menu.defaultTools"),
		icon: <TbTools />,
	},
	{
		name: s("mainEditor.menu.selectTools"),
		icon: <TbEdit />,
	},
];

type EditorHrmHeaderProps = {
	state: State;
};

const toolSetIcon = (toolSet: ToolSet) => {
	return TOOL_SET_INFO()[toolSet].icon;
};

const toolSet = (toolSet: ToolSet, g: HrmState) => {
	switch (toolSet) {
		case ToolSet.Default:
			return (
				<>
					<InputText
						class="flex-1"
						readonly
						value={`${g.name} @ ${g.path}`}
					/>
					<Button color={Color.warning} onClick={() => g.undo()}>
						<TbArrowBackUp />
					</Button>
					<Button color={Color.warning} onClick={() => g.redo()}>
						<TbArrowForwardUp />
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

const toolSetMenus = (state: State) => {
	return TOOL_SET_INFO().map((info, idx) => {
		return (
			<a
				onClick={() => {
					changeMode(state, idx as ToolSet);
				}}>
				{info.icon} {info.name}
			</a>
		);
	});
};

const EditorHrmHeader: Component<EditorHrmHeaderProps> = props => {
	const dropdownList = () => {
		return [
			toolSetMenus(props.state),
			[
				<a
					onClick={async () => {
						await saveToFile(props.state);
						toastSuccess(s("mainEditor.menu.saveSuccess"));
					}}>
					<TbDeviceFloppy /> {s("menu.save")}
				</a>,
			],
			[
				<a onClick={() => openBrowserModal(props.state)}>
					<TbFolderSearch /> {s("mainEditor.menu.browser")}
				</a>,
				<a onClick={() => openLaunchModal(props.state)}>
					<TbRocket /> {s("mainEditor.menu.launch")}
				</a>,
				<a onClick={() => openGraphToolsModal(props.state)}>
					<TbBinaryTree /> {s("mainEditor.menu.graphTools")}
				</a>,
			],
		];
	};
	return (
		<div class="editor-root-hrm-header-container">
			<InputGroup class="editor-root-hrm-header shadow-2">
				<DropdownButton color={Color.primary} list={dropdownList()}>
					{toolSetIcon(props.state.toolSet[0]())}
				</DropdownButton>
				{toolSet(props.state.toolSet[0](), props.state.hrm[0]())}
			</InputGroup>
			<div class="editor-root-hrm-badges">
				<Button
					color={Color.primary}
					outline
					small
					onClick={() => alert("unimpl")}>
					Test
				</Button>
			</div>
		</div>
	);
};

export default EditorHrmHeader;
