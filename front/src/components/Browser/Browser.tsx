/*import { useEffect, useState } from "react";
import BrowserHeader from "./BrowserHeader";
import BrowserList from "./BrowserList";*/

export type File = {
  name: string;
  type: string;
  checked: boolean;
};

export const fileMetaToList = (): File[] => {
  throw new Error("Not implemented");
};

export type BrowserProps = {
  onClose: () => void;
};

export type BrowserState = {
  storage: string;
  path: string;
  pathType: string;
  list: File[];
};

const Browser = (props: BrowserProps) => {
  props;
  /*
  const [state, setState] = useState<BrowserState>({
    storage: Object.keys(storageManager.storages)[0],
    path: "",
    pathType: "not_loaded",
    list: [],
  });

  const changeStorage = (value: string) => {
    setState({
      ...state,
      storage: value,
    });
  };

  const changePath = async (path: string) => {
    path = cd(path);
    const fullPath = `${state.storage}:${path}`;
    try {
      const ft = await storageManager.getFileType(fullPath);
      if (ft === "directory") {
        // Read directory contents
        const contents = await storageManager.list(fullPath);
        const list = fileMetaToList(contents);
        list.sort((a, b) => {
          if (a.type === b.type) {
            return a.name.localeCompare(b.name);
          } else {
            return a.type.localeCompare(b.type);
          }
        });
        console.log(list);
        setState({
          ...state,
          path,
          pathType: "directory",
          list,
        });
      } else if (ft === "file" && fullPath.endsWith(".kitl")) {
        setState({
          ...state,
          path,
          pathType: "file-kitl",
        });
      }
    } catch (e) {
      setState({
        ...state,
        path,
        pathType: "unknown",
      });
    }
  };

  const checkItem = (name: string) => {
    const list = state.list.map(item => {
      if (item.name === name) {
        return {
          ...item,
          checked: !item.checked,
        };
      }
      return item;
    });
    setState({
      ...state,
      list,
    });
  };

  const checkAll = () => {
    const toCheck = state.list.length > 0 && !state.list[0].checked;
    const list = state.list.map(item => ({
      ...item,
      checked: toCheck,
    }));
    setState({
      ...state,
      list,
    });
  };

  const newFile = async () => {
    console.log("newFile");
    let newFileName = "";
    let cnt = 0;
    do {
      cnt += 1;
      newFileName = `new_file_${cnt}`;
    } while (state.list.find(item => item.name === newFileName) !== undefined);
    console.log(newFileName);
    await storageManager.write(
      `${state.storage}:${state.path}/${newFileName}`,
      "",
    );
    await changePath(state.path);
  };

  const newFolder = async () => {
    console.log("newFile");
    let newFileName = "";
    let cnt = 0;
    do {
      cnt += 1;
      newFileName = `new_folder_${cnt}`;
    } while (state.list.find(item => item.name === newFileName) !== undefined);
    console.log(newFileName);
    await storageManager.mkdir(`${state.storage}:${state.path}/${newFileName}`);
    await changePath(state.path);
  };

  const deleteItems = async () => {
    const toDelete = state.list.filter(item => item.checked);
    for (const item of toDelete) {
      await storageManager.delete(
        `${state.storage}:${state.path}/${item.name}`,
      );
    }
    await changePath(state.path);
  };

  const renameItems = async () => {
    for (const item of state.list) {
      if (item.checked) {
        const result = prompt(`Rename ${item.name} to:`);
        if (result !== null) {
          await storageManager.rename(
            `${state.storage}:${state.path}/${item.name}`,
            `${state.storage}:${state.path}/${result}`,
          );
        }
      }
    }
    await changePath(state.path);
  };

  useEffect(() => {
    if (state.pathType === "not_loaded") {
      changePath("/");
    }
  });

  return (
    <>
      <BrowserHeader
        storage={state.storage}
        path={state.path}
        pathType={state.pathType}
        onClose={props.onClose}
        changeStorage={changeStorage}
        changePath={changePath}
        newFile={newFile}
        newFolder={newFolder}
        cut={() => {}}
        copy={() => {}}
        paste={() => {}}
        delete={deleteItems}
        rename={renameItems}
      />
      <BrowserList
        type={state.pathType}
        path={state.path}
        list={state.list}
        checkItem={checkItem}
        checkAll={checkAll}
        clickItem={(name: string) => changePath(`${state.path}/${name}`)}
      />
    </>
  );
  */
  return <span></span>;
};

export default Browser;
