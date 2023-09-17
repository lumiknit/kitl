import { type Component } from "solid-js";

import { Localed, s } from "./locales";

const App: Component = () => {
	return (
		<Localed>
			{s("node.literal")}
		</Localed>
	);
};

export default App;
