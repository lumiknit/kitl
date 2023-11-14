// Path utils

export type PathString = string;
export type Path = string[];

export const splitPath = (path: PathString): Path => {
	const splitted = path.split(/[\\/]+/),
		isRoot = splitted[0].length < 1,
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
	paths.length < 1
		? "."
		: paths.length <= 1 && paths[0].length < 1
		  ? "/"
		  : paths.join("/");

export const isAbsolutePath = (path: Path): boolean =>
	path.length > 0 && path[0].length < 1;

export const refinePath = (path: PathString): [PathString, Path] => {
	const chunks = splitPath(path);
	return [joinPath(chunks), chunks];
};

// Host:Path utils

export const splitHostPath = (hostPath: string): [string, PathString] => {
	const sep = hostPath.indexOf(":");
	if (sep < 0) return ["local", hostPath];
	return [hostPath.slice(0, sep), hostPath.slice(sep + 1)];
};

export const refineHostPath = (
	hostPath: string,
): [string, PathString, Path] => {
	const [host, path] = splitHostPath(hostPath);
	const [refinedPath, chunks] = refinePath(path);
	return [host, refinedPath, chunks];
};

// Filename helper

export const extractFilename = (path: PathString): string => {
	const [, , chunks] = refineHostPath(path);
	return chunks[chunks.length - 1];
};

export const splitFilenameExt = (filename: string): [string, string] => {
	let sep = filename.lastIndexOf(".");
	if (sep < 0) sep = filename.length;
	return [filename.slice(0, sep), filename.slice(sep + 1)];
};

export const addIndexToFilename = (filename: string, index: number): string => {
	if (index < 1) return filename;
	let idx = filename.indexOf(".");
	if (idx < 0) idx = filename.length;
	return `${filename.slice(0, idx)}-${index}${filename.slice(idx)}`;
};

// Extensions

export enum FileType {
	Unknown,
	Kitl,
	Image,
}

const FILE_TYPE_LIST = new Map([
	[FileType.Kitl, ["kitl"]],
	[FileType.Image, ["png", "jpg", "jpeg", "gif", "svg", "webp"]],
]);

export const FILE_TYPE_MAP: { [ext: string]: FileType } = {};
FILE_TYPE_LIST.forEach((exts, type) => {
	for (const ext of exts) {
		FILE_TYPE_MAP[ext] = type;
	}
});

export const getFileType = (ext: string): FileType =>
	FILE_TYPE_MAP[ext] || FileType.Unknown;
