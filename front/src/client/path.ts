// Internal path

export type Path = {
  kind: string;
  path: string;
};

export const parsePath = (path: string): Path => {
  const idx = path.indexOf(':');
  if (idx === -1) {
    return { kind: '', path };
  }
  return { kind: path.slice(0, idx), path: path.slice(idx + 1) };
};

export const formatPath = (path: Path): string => {
  return path.kind ? `${path.kind}:${path.path}` : path.path;
}