// Path utils

export type PathString = string;
export type Path = string[];

export const splitPath = (path: PathString): Path => {
	const splitted = path.split(/[\\/]+/),
		isRoot = splitted[0].length <= 0,
		paths = [];
	for (const c of splitted) {
		switch (c) {
			case "":
			case ".":
				break;
			case "..":
				paths.pop();
				break;
			default:
				paths.push(c);
		}
	}
	if (isRoot && paths.length > 0 && paths[0].length > 0) {
		paths.unshift("");
	}
	return paths;
};

export const joinPath = (paths: Path): PathString =>
	paths.length <= 0
		? "."
		: paths.length <= 1 && paths[0].length <= 0
		? "/"
		: paths.join("/");

export const isAbsolutePath = (path: Path): boolean =>
	path.length > 0 && path[0].length <= 0;

export const refinePath = (path: PathString): [PathString, Path] => {
	const chunks = splitPath(path);
	return [joinPath(chunks), chunks];
};
