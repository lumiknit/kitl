import { Component, JSXElement, Match, Switch, createResource } from "solid-js";
import { loadStrings, getLocale } from "./s";

type LocaledProps = {
	language?: string;
	children: JSXElement;
};

const Localed: Component<LocaledProps> = props => {
	const [loaded] = createResource(
		async () => await loadStrings(props.language),
	);
	const locale = getLocale();
	return (
		<Switch fallback="Unk">
			<Match when={loaded()}>{props.children}</Match>
			<Match when={locale === ""}>Failed to load locale.</Match>
			<Match when={locale === undefined}>Loading...</Match>
		</Switch>
	);
};

export default Localed;
