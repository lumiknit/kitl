import { type Component } from "solid-js";

import { Localed } from "./locales";

import "./block";
import { default as ToastContainer } from "./block/ToastContainer";
import { EditorMain } from "./components/editor-root";

const App: Component = () => {
	return (
		<Localed>
			<ToastContainer />
			<EditorMain />
		</Localed>
	);
};

export default App;
