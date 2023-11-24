import { Button, Color, InputGroup, InputText } from "@/block";
import InputLabel from "@/block/InputLabel";
import { toastError } from "@/block/ToastContainer";
import { Update, VWrap } from "@/common";
import {
	DEF_TYPES,
	AliasDef,
	TagDef,
	TypeDef,
	Definition,
	Root,
	emptyDefFns,
	loadRoot,
	newRoot,
} from "@/common/kitl/defs";
import { normalizedWhitenName } from "@/common/name";
import { s } from "@/locales";
import {
	TbArrowRight,
	TbCaretUp,
	TbCheckbox,
	TbDeviceFloppy,
	TbEdit,
	TbSquarePlus,
	TbTrash,
} from "solid-icons/tb";
import { Component, For, JSX, Show, batch, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { State, StateWrap, saveFile } from "./state";
import RadioButtons, { RadioButton } from "@/block/RadioButtons";

const DEF_TYPE_COLORS: { [k: string]: Color } = {
	value: Color.primary,
	tag: Color.success,
	type: Color.warning,
	alias: Color.secondary,
};

type KitlContents = {
	modified: VWrap<boolean>;
	errorMessage: VWrap<string>;
	root: VWrap<Root>;
};

const setDefFn = (name: string, def: Definition) => (root: Root) => ({
	...root,
	defs: {
		...root.defs,
		[name]: def,
	},
});
const removeDefFn = (name: string) => (root: Root) => {
	const newDefs = { ...root.defs };
	delete newDefs[name];
	return {
		...root,
		defs: newDefs,
	};
};
const updateDef = (contents: KitlContents, fns: Update<Root>[]) =>
	batch(() => {
		fns.forEach(fn => contents.root[1](fn));
		contents.modified[1](true);
	});

const verifyDefName = (contents: KitlContents, name: string): string => {
	name = normalizedWhitenName(name);
	if (!name) {
		toastError(s("fileBrowser.toast.invalidDefCreationName"));
		throw new Error("Invalid name");
	}
	if (contents.root[0]().defs[name]) {
		toastError(s("fileBrowser.toast.defAlreadyExists"));
		throw new Error("Already exists");
	}
	return name;
};

const loadKitlContents = (state: State): KitlContents => {
	let errorMessage = "";
	let root = newRoot({});
	const data = state.data[0]();
	if (data !== undefined && data.byteLength !== 0) {
		try {
			const j = JSON.parse(new TextDecoder("utf-8").decode(data));
			root = loadRoot(j);
		} catch {
			toastError(s("fileBrowser.toast.invalidKitl"));
			errorMessage = s("fileBrowser.toast.invalidKitl");
		}
	}
	const [getModified, setModified] = createSignal(false);
	const [get, set] = createSignal(root);
	const setWrap: any = (v: any) => {
		setModified(true);
		return set(v);
	};
	return {
		modified: [getModified, setModified],
		errorMessage: createSignal(errorMessage),
		root: [get, setWrap],
	};
};

type ItemProps = {
	state: State;
	contents: KitlContents;
	name: string;
	def: Definition;
};

const DefItemLine: Component<{
	type: string;
	name: string;
	contents: KitlContents;
	label?: string;
	children?: JSX.Element;
	onOpen?: () => void;
}> = props => {
	const [open, setOpen] = createSignal(false);
	let inputRef: HTMLInputElement | undefined;
	const [editingName, setEditingName] = createSignal(false);
	const remove = () => updateDef(props.contents, [removeDefFn(props.name)]);
	const applyRename = () => {
		const newName = verifyDefName(props.contents, inputRef?.value ?? "");
		if (newName !== props.name) {
			updateDef(props.contents, [
				setDefFn(newName, props.contents.root[0]().defs[props.name]),
				removeDefFn(props.name),
			]);
		}
		setEditingName(false);
	};

	return (
		<>
			<InputGroup class="my-1">
				<InputLabel color={DEF_TYPE_COLORS[props.type]}>
					{s(`defType.${props.type}`)}
				</InputLabel>
				<InputText
					class="flex-1"
					value={props.name}
					readonly={!editingName()}
					ref={inputRef}
					onKeyDown={e => {
						if (e.key === "Enter") {
							applyRename();
						}
					}}
					onClick={() => {
						setEditingName(true);
					}}
				/>
				<Show when={props.label !== undefined}>
					<InputLabel color={Color.secondary}>
						{props.label}
					</InputLabel>
				</Show>
				<Show
					when={editingName()}
					fallback={
						<Button color={Color.danger} onClick={remove}>
							<TbTrash />
						</Button>
					}>
					<Button color={Color.primary} onClick={applyRename}>
						<TbCheckbox />
					</Button>
				</Show>
				<Button
					color={Color.secondary}
					onClick={() =>
						props.onOpen ? props.onOpen() : setOpen(b => !b)
					}>
					<Show when={open()} fallback={<TbEdit />}>
						<TbCaretUp />
					</Show>
				</Button>
			</InputGroup>
			<Show when={open()}>{props.children}</Show>
		</>
	);
};

const ValueDefItem: Component<ItemProps> = props => {
	return (
		<DefItemLine
			type="value"
			name={props.name}
			contents={props.contents}
			onOpen={async () => {
				if (props.state.editValueDef) {
					await props.state.editValueDef(
						props.state.path[0](),
						props.name,
					);
					props.state.onClose?.();
				}
			}}
		/>
	);
};

const splitInputValues = (inputRef: HTMLInputElement | undefined): string[] =>
	(inputRef?.value ?? "")
		.split(",")
		.map(normalizedWhitenName)
		.filter(x => x);

const DefTagItem: Component<ItemProps> = props => {
	const def = (): TagDef => props.def as any;
	let inputRef: HTMLInputElement | undefined;
	const apply = () => {
		const newElems = splitInputValues(inputRef);
		updateDef(props.contents, [
			setDefFn(props.name, {
				type: "tag",
				elems: newElems,
			}),
		]);
	};
	return (
		<DefItemLine
			type="tag"
			name={props.name}
			contents={props.contents}
			label={"" + def().elems.length}>
			<InputGroup class="ml-3 my-1">
				<InputLabel color={DEF_TYPE_COLORS[props.def.type]}>
					<TbArrowRight />
				</InputLabel>
				<InputText
					class="flex-1"
					value={def().elems.join(",")}
					ref={inputRef}
				/>
				<Button color={Color.primary} onClick={apply}>
					<TbCheckbox />
				</Button>
			</InputGroup>
		</DefItemLine>
	);
};

const DefTypeItem: Component<ItemProps> = props => {
	const def = (): TypeDef => props.def as any;
	let inputRef: HTMLInputElement | undefined;
	const apply = () => {
		const newUnions = splitInputValues(inputRef);
		updateDef(props.contents, [
			setDefFn(props.name, {
				type: "type",
				unions: newUnions,
			}),
		]);
	};
	return (
		<DefItemLine
			type="type"
			name={props.name}
			contents={props.contents}
			label={"" + def().unions.length}>
			<InputGroup class="ml-3 my-1">
				<InputLabel color={DEF_TYPE_COLORS[props.def.type]}>
					<TbArrowRight />
				</InputLabel>
				<InputText
					class="flex-1"
					value={def().unions.join(",")}
					ref={inputRef}
				/>
				<Button color={Color.primary} onClick={apply}>
					<TbCheckbox />
				</Button>
			</InputGroup>
		</DefItemLine>
	);
};

const DefAliasItem: Component<ItemProps> = props => {
	const def = (): AliasDef => props.def as any;
	let inputRef: HTMLInputElement | undefined;
	const apply = () => {
		const newOrigin = inputRef?.value;
		if (!newOrigin) {
			toastError(s("fileBrowser.toast.invalidDefCreationName"));
			return;
		}
		updateDef(props.contents, [
			setDefFn(props.name, {
				type: "alias",
				origin: newOrigin,
			}),
		]);
	};
	return (
		<DefItemLine type="alias" name={props.name} contents={props.contents}>
			<InputGroup class="ml-3 my-1">
				<InputLabel color={DEF_TYPE_COLORS[props.def.type]}>
					<TbArrowRight />
				</InputLabel>
				<InputText class="flex-1" value={def().origin} ref={inputRef} />
				<Button color={Color.primary} onClick={apply}>
					<TbCheckbox />
				</Button>
			</InputGroup>
		</DefItemLine>
	);
};

const DefItemComponents = {
	type: DefTypeItem,
	tag: DefTagItem,
	value: ValueDefItem,
	alias: DefAliasItem,
};

const BrowserBodyFileKitl: Component<StateWrap> = props => {
	const contents = loadKitlContents(props.state);
	const defs = () =>
		Object.entries(contents.root[0]().defs).sort((a, b) =>
			a[0].localeCompare(b[0]),
		);

	const Header: Component<any> = () => {
		const save = async () => {
			const data = JSON.stringify(contents.root[0]());
			await saveFile(props.state, data);
			contents.modified[1](false);
		};
		return (
			<InputGroup class="my-1">
				<Button
					color={
						contents.modified[0]() ? Color.primary : Color.secondary
					}
					class="flex-1"
					onClick={save}
					disabled={!contents.modified[0]()}>
					<TbDeviceFloppy />
					&nbsp;
					{s("menu.save")}
				</Button>
			</InputGroup>
		);
	};

	const DefCreation: Component<any> = () => {
		const radioButtons: RadioButton<number>[] = Object.entries(
			DEF_TYPE_COLORS,
		).map((entry, idx) => ({
			color: entry[1],
			label: s(`defType.${entry[0]}`),
			value: idx,
			class: "flex-1",
		}));
		let inputRef: HTMLInputElement | undefined;
		const [typeIndex, setTypeIndex] = createSignal(0);
		const add = () => {
			const name = verifyDefName(contents, inputRef?.value ?? "");
			updateDef(contents, [
				setDefFn(name, (emptyDefFns as any)[DEF_TYPES[typeIndex()]]()),
			]);
			inputRef!.value = "";
		};
		return (
			<>
				Creation
				<RadioButtons
					buttons={radioButtons}
					initialValue={0}
					onChange={(idx: number) => {
						setTypeIndex(idx);
					}}
				/>
				<InputGroup class="my-1">
					<InputText
						class="flex-1"
						placeholder={s("term.name")}
						ref={inputRef}
						onKeyDown={e => {
							if (e.key === "Enter") {
								add();
							}
						}}
					/>
					<Button
						color={DEF_TYPE_COLORS[DEF_TYPES[typeIndex()]]}
						onClick={add}>
						<TbSquarePlus />
					</Button>
				</InputGroup>
			</>
		);
	};

	return (
		<>
			<Show when={contents.errorMessage[0]()}>
				{contents.errorMessage[0]()}
			</Show>
			<Header />
			<DefCreation content={contents} />
			<hr />
			<div>
				<For each={defs()}>
					{nameDefPair => (
						<Dynamic
							component={DefItemComponents[nameDefPair[1].type]}
							state={props.state}
							contents={contents}
							name={nameDefPair[0]}
							def={nameDefPair[1]}
						/>
					)}
				</For>
			</div>
		</>
	);
};

export default BrowserBodyFileKitl;
