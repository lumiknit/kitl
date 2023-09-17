import { For, type Component } from "solid-js";

import { Localed, s } from "./locales";

import "./block";
import { Button, Color, InputCheck, InputGroup, InputText } from "./block";
import InputLabel from "./block/InputLabel";
import DropdownButton from "./block/DropdownButton";
import {
	default as ToastContainer,
	ToastType,
	toast,
} from "./block/ToastContainer";

const App: Component = () => {
	const colors = Object.values(Color);
	return (
		<Localed>
			<ToastContainer />
			<InputGroup class="shadow-1">
				<InputLabel color={Color.warning}>Test</InputLabel>

				<Button
					color={Color.primary}
					onClick={() => {
						toast("" + Math.random());
					}}>
					Hello
				</Button>
				<DropdownButton
					color={Color.danger}
					list={[
						[
							<a href="#" onClick={() => alert("A")}>
								{" "}
								Hello{" "}
							</a>,
							<a> World </a>,
						],
						[<a> Boom </a>],
					]}>
					Hello
				</DropdownButton>
				<InputText
					class="flex-1"
					placeholder="Hello"
					value={s("hello")}
					onChange={() => {}}
				/>
				<Button
					color={Color.primary}
					outline
					onClick={() =>
						toast(
							"Lorem ipusm hello weorld kasjd qkwejl akd jqwke askdjl qwek jalskdj qwek ajsldk qweka qwkej alksdj kqwej kqw",
							{ type: ToastType.Error },
						)
					}>
					This is test
				</Button>
			</InputGroup>

			<InputGroup class="shadow-1">
				<For each={colors}>
					{(item, index) => <Button color={item}>{item}</Button>}
				</For>
			</InputGroup>
			<InputCheck checked onChange={() => {}}>
				Hello
			</InputCheck>
		</Localed>
	);
};

export default App;
