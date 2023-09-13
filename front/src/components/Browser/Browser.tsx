import { useState } from "react";
import clientManager, { Location } from "../../client/client-manager";
import { StorageItem } from "../../client/storage";
import BrowserHeader from "./BrowserHeader";
import BrowserList from "./BrowserList";

export type File = {
  storageItem: StorageItem;
  checked: boolean;
};

export const fileMetaToList = (): File[] => {
  throw new Error("Not implemented");
};

export type BrowserProps = {
  path: string;
  onClose?: (value: string) => void;
};

export enum ListType {
  NotLoaded,
  Directory,
  Image,
  Kitl,
}

export type BrowserState = {
  location: Location;
  type: ListType;
  list: File[];
};

const Browser = (props: BrowserProps) => {
  const [state, setState] = useState<BrowserState>(() => {
    const location = clientManager.parsePath(props.path);
    const list: File[] = [];
    return {
      location,
      type: ListType.NotLoaded,
      list,
    };
  });
  return (
    <>
      <BrowserHeader
        storages={clientManager.clientList()}
        storage={state.location.host}
        path={state.location.path}
        onClose={() => (props.onClose ? props.onClose(".") : undefined)}
      />
    </>
  );
};

export default Browser;
