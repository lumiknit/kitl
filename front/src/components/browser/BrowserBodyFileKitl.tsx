import { Component, For, Show, createSignal } from "solid-js";
import { State, StateWrap, saveFile } from "./state";
import { s } from "@/locales";
import { ToastType, toast } from "@/block/ToastContainer";
import {
	DEF_TYPES,
	DefAlias,
	DefTag,
	DefType,
	Definition,
	Root,
	emptyDefFns,
	loadRoot,
	newRoot,
} from "@/common/kitl";
import { Dynamic } from "solid-js/web";
import { VWrap } from "@/common";
import { Button, Color, InputGroup, InputText } from "@/block";
import {
	TbArrowRight,
	TbCaretUp,
	TbCheckbox,
	TbDeviceFloppy,
	TbEdit,
	TbSquarePlus,
	TbTrash,
} from "solid-icons/tb";
import InputLabel from "@/block/InputLabel";
import { normalizedWhitenName } from "@/common/name";

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

const loadKitlContents = (state: State): KitlContents => {
	let errorMessage = "";
	let root = newRoot({});
	const data = state.data[0]();
	if (data !== undefined && data.byteLength !== 0) {
		try {
			const j = JSON.parse(new TextDecoder("utf-8").decode(data));
			root = loadRoot(j);
		} catch {
			toast(s("fileBrowser.toast.invalidKitl"), {
				type: ToastType.Error,
			});
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

const Warning: Component<KitlContents> = props => {
	return <Show when={props.errorMessage}>{props.errorMessage[0]()}</Show>;
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
	openState: () => boolean;
	toggle: () => void;
	label?: string;
}> = props => {
	let inputRef: HTMLInputElement | undefined;
	const editingName = createSignal(false);
	const remove = () => {
		props.contents.root[1]((root: Root) => {
			const newDefs = { ...root.defs };
			delete newDefs[props.name];
			return {
				...root,
				defs: newDefs,
			};
		});
	};
	const applyRename = () => {
		const newName = normalizedWhitenName(inputRef?.value ?? "");
		console.log(newName);
		if (newName === props.name) {
			editingName[1](false);
			return;
		}
		if (!newName) {
			toast(s("fileBrowser.toast.invalidDefCreationName"), {
				type: ToastType.Error,
			});
			return;
		}
		if (props.contents.root[0]().defs[newName]) {
			toast(s("fileBrowser.toast.defAlreadyExists"), {
				type: ToastType.Error,
			});
			return;
		}
		props.contents.root[1]((root: Root) => {
			const newDefs = { ...root.defs };
			newDefs[newName] = newDefs[props.name];
			delete newDefs[props.name];
			return {
				...root,
				defs: newDefs,
			};
		});
		editingName[1](false);
	};

	return (
		<InputGroup class="my-1">
			<InputLabel color={DEF_TYPE_COLORS[props.type]}>
				{s(`defType.${props.type}`)}
			</InputLabel>
			<InputText
				class="flex-1"
				value={props.name}
				readonly={!editingName[0]()}
				ref={inputRef}
				onKeyDown={e => {
					if (e.key === "Enter") {
						applyRename();
					}
				}}
				onClick={() => {
					editingName[1](true);
				}}
			/>
			<Show when={props.label !== undefined}>
				<InputLabel color={Color.secondary}>{props.label}</InputLabel>
			</Show>
			<Show
				when={editingName[0]()}
				fallback={
					<Button color={Color.danger} onClick={remove}>
						<TbTrash />
					</Button>
				}>
				<Button color={Color.primary} onClick={applyRename}>
					<TbCheckbox />
				</Button>
			</Show>
			<Button color={Color.secondary} onClick={props.toggle}>
				<Show when={props.openState()} fallback={<TbEdit />}>
					<TbCaretUp />
				</Show>
			</Button>
		</InputGroup>
	);
};

const DefValueItem: Component<ItemProps> = props => {
	return (
		<>
			<DefItemLine
				type="value"
				name={props.name}
				contents={props.contents}
				openState={() => false}
				toggle={() => {}}
			/>
		</>
	);
};

const DefTagItem: Component<ItemProps> = props => {
	const def = (): DefTag => props.def as any;
	let inputRef: HTMLInputElement | undefined;
	const [open, setOpen] = createSignal(false);
	const apply = () => {
		const v = inputRef?.value ?? "";
		const newElems = v
			.split(",")
			.map(normalizedWhitenName)
			.filter(x => x);
		props.contents.root[1]((root: Root) => {
			const newDefs = { ...root.defs };
			newDefs[props.name] = {
				type: "tag",
				elems: newElems,
			};
			return {
				...root,
				defs: newDefs,
			};
		});
	};
	return (
		<>
			<DefItemLine
				type="tag"
				name={props.name}
				contents={props.contents}
				openState={open}
				toggle={() => setOpen(o => !o)}
				label={"" + def().elems.length}
			/>
			<Show when={open()}>
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
			</Show>
		</>
	);
};

const DefTypeItem: Component<ItemProps> = props => {
	const def = (): DefType => props.def as any;
	let inputRef: HTMLInputElement | undefined;
	const [open, setOpen] = createSignal(false);
	const apply = () => {
		const v = inputRef?.value ?? "";
		const newUnions = v
			.split(",")
			.map(normalizedWhitenName)
			.filter(x => x);
		props.contents.root[1]((root: Root) => {
			const newDefs = { ...root.defs };
			newDefs[props.name] = {
				type: "type",
				unions: newUnions,
			};
			return {
				...root,
				defs: newDefs,
			};
		});
	};
	return (
		<>
			<DefItemLine
				type="type"
				name={props.name}
				contents={props.contents}
				openState={open}
				toggle={() => setOpen(o => !o)}
				label={"" + def().unions.length}
			/>
			<Show when={open()}>
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
			</Show>
		</>
	);
};

const DefAliasItem: Component<ItemProps> = props => {
	const def = (): DefAlias => props.def as any;
	let inputRef: HTMLInputElement | undefined;
	const [open, setOpen] = createSignal(false);
	const apply = () => {
		const newOrigin = inputRef?.value;
		if (!newOrigin) {
			toast(s("fileBrowser.toast.invalidDefCreationName"), {
				type: ToastType.Error,
			});
			return;
		}
		props.contents.root[1]((root: Root) => {
			const newDefs = { ...root.defs };
			newDefs[props.name] = {
				type: "alias",
				origin: newOrigin,
			};
			return {
				...root,
				defs: newDefs,
			};
		});
	};
	return (
		<>
			<DefItemLine
				type="alias"
				name={props.name}
				contents={props.contents}
				openState={open}
				toggle={() => setOpen(o => !o)}
			/>
			<Show when={open()}>
				<InputGroup class="ml-3 my-1">
					<InputLabel color={DEF_TYPE_COLORS[props.def.type]}>
						<TbArrowRight />
					</InputLabel>
					<InputText
						class="flex-1"
						value={def().origin}
						ref={inputRef}
					/>
					<Button color={Color.primary} onClick={apply}>
						<TbCheckbox />
					</Button>
				</InputGroup>
			</Show>
		</>
	);
};

const DefItemComponents = {
	type: DefTypeItem,
	tag: DefTagItem,
	value: DefValueItem,
	alias: DefAliasItem,
};

const BrowserBodyFileKitl: Component<StateWrap> = props => {
	const contents = loadKitlContents(props.state);
	const defs = () => {
		const entries = Object.entries(contents.root[0]().defs);
		// Sort
		entries.sort((a, b) => {
			const [nameA] = a;
			const [nameB] = b;
			return nameA.localeCompare(nameB);
		});
		return entries;
	};

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
					{s("fileBrowser.menu.save")}
				</Button>
			</InputGroup>
		);
	};

	const DefCreation: Component<any> = () => {
		let inputRef: HTMLInputElement | undefined;
		const [typeIndex, setTypeIndex] = createSignal(0);
		const nextType = () => {
			setTypeIndex((typeIndex() + 1) % DEF_TYPES.length);
		};
		const add = () => {
			const def: Definition = (emptyDefFns as any)[
				DEF_TYPES[typeIndex()]
			]();
			const name = normalizedWhitenName(inputRef?.value ?? "");
			if (!name) {
				toast(s("fileBrowser.toast.invalidDefCreationName"), {
					type: ToastType.Error,
				});
				return;
			}
			if (contents.root[0]().defs[name]) {
				toast(s("fileBrowser.toast.defAlreadyExists"), {
					type: ToastType.Error,
				});
				return;
			}
			contents.root[1]((root: Root) => ({
				...root,
				defs: {
					...root.defs,
					[name]: def,
				},
			}));
			inputRef!.value = "";
		};
		return (
			<InputGroup class="my-1">
				<Button
					color={DEF_TYPE_COLORS[DEF_TYPES[typeIndex()]]}
					onClick={nextType}>
					{s(`defType.${DEF_TYPES[typeIndex()]}`)}
				</Button>
				<InputText
					class="flex-1"
					placeholder="Name"
					ref={inputRef}
					onKeyDown={e => {
						if (e.key === "Enter") {
							add();
						}
					}}
					value=""
				/>
				<Button color={Color.primary} onClick={add}>
					<TbSquarePlus />
				</Button>
			</InputGroup>
		);
	};

	return (
		<>
			<Warning {...contents} />
			<Header />
			<DefCreation content={contents} />
			<hr />
			<div>
				<For each={defs()}>
					{x => {
						const [name, def] = x;
						return (
							<Dynamic
								component={DefItemComponents[def.type]}
								state={props.state}
								contents={contents}
								name={name}
								def={def}
							/>
						);
					}}
				</For>
			</div>
		</>
	);
};

export default BrowserBodyFileKitl;
