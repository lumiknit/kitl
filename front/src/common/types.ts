/*
Wrap and Box are used to make a variable to replace a value without changing the address.
Wrap is used to wrap a value, and box is emptiable wrap.
They are used to extract values from a closure or component.
*/

export type Wrap<T> = [T];
export type Box<T> = Wrap<T | undefined>;

export const emptyBox = <T>(): Box<T> => [undefined];

export type Wrap2<S, T> = [S, T];
export type Box2<S, T> = Wrap2<S | undefined, T | undefined>;

export const emptyBox2 = <S, T>(): Box2<S, T> => [undefined, undefined];

/*
Getter & Updater are used for state management. e.g. createSignal
*/

export type Getter<T> = () => T;
export type Update<T> = (old: T) => T;
export type Updater<T> = (update: T | Update<T>) => void;

/*
SWrap & SBox are helper to pass state to other (as react)
*/

export type SWrap<T> = Wrap2<T, Updater<T>>;
export type SBox<T> = Box2<T, Updater<T>>;

/*
VWrap & VBox are helper to pass signal to other (as solid)
*/

export type VWrap<T> = Wrap2<Getter<T>, Updater<T>>;
export type VBox<T> = Box2<Getter<T>, Updater<T>>;
