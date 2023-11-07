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
	if (isRoot) {
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

// Host:Path utils

export const splitHostPath = (hostPath: string): [string, PathString] => {
	const sep = hostPath.indexOf(":");
	if (sep === -1) {
		return ["local", hostPath];
	} else {
		return [hostPath.slice(0, sep), hostPath.slice(sep + 1)];
	}
};

export const refineHostPath = (
	hostPath: string,
): [string, PathString, Path] => {
	const [host, path] = splitHostPath(hostPath);
	const [refinedPath, chunks] = refinePath(path);
	return [host, refinedPath, chunks];
};

// Filename helper

export const filename = (path: PathString): string => {
	const [, , chunks] = refineHostPath(path);
	return chunks[chunks.length - 1];
};

export const splitFilenameExt = (filename: string): [string, string] => {
	const sep = filename.lastIndexOf(".");
	if (sep === -1) {
		return [filename, ""];
	}
	return [filename.slice(0, sep), filename.slice(sep + 1)];
};
