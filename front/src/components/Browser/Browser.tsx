import { useState } from "react";
import { ClientManager, Location } from "../../client/client-manager";
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
  clientManager: ClientManager;
  onClose?: (value: string) => void;
};

export type BrowserState = {
  location: Location;
  list: File[];
};

const Browser = async (props: BrowserProps) => {
  const [state, setState] = useState<BrowserState>(() => {
    const location = props.clientManager.parsePath(props.path);
    const list: File[] = [];
    return {
      location,
      list,
    };
  });
  return (
    <>
      <BrowserHeader
      />
      <BrowserList
      />
    </>
  );
};

export default Browser;
