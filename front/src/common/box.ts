// box.ts

/*
Wrap and Box are used to make a variable to replace a value without changing the address.
Wrap is used to wrap a value, and box is emptiable wrap.
They are used to extract values from a closure or component.
*/

export type Wrap<T> = [T];
export type Box<T> = Wrap<T | undefined>;

export type Wrap2<S, T> = [S, T];
export type Box2<S, T> = Wrap2<S | undefined, T | undefined>;
