---
title: "React and TypeScript"
date: 2020-07-03T18:53:48+02:00
tags: ["tech", "web"]
draft: true
---

I recently saw [a tweet](https://twitter.com/_dte/status/1278941464588890115) from [Daniel Eden](https://daneden.me).

<!-- {{< tweet 1278941464588890115 >}} -->

Here are some of my tips and best practices, mostly coming from experience working in a large-scale, real world React/TypeScript codebase.

Lets start with a basic example of creating and using a component.

```tsx
interface HelloProps {
    readonly compiler: string;
    readonly framework: string;
}

export function Hello({ compiler, framework }: HelloProps) {
    return (
        <h1>Hello from {compiler} and {framework}!</h1>
    )
}
```

```tsx
import { Hello } from "./hello"

function App() {
    return <Hello compiler="TypeScript" framework="React" />;
}
```

Here, `HelloProps` is an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) that describes exactly what properties the component accepts and requires. This replaces [`PropTypes`](https://reactjs.org/docs/typechecking-with-proptypes.html), but doesn't require running the code to discover problems and allows you to be more specific and refined.

### Don't export properties types

As a codebase grows, it makes sense to export these interfaces to reuse in other components and keep things DRY, especially as your codebase expands and as you start making use of [higher order components](https://reactjs.org/docs/higher-order-components.html) and [composition](https://reactjs.org/docs/composition-vs-inheritance.html).

```tsx
import { ButtonProps } from "../props";

export function FooButton(props: ButtonProps) {
    // ...
}
```

```tsx
import { ButtonProps } from "../props";

export function BarButton(props: ButtonProps) {
    // ...
}
```

This is a pattern I used commonly in the past, but it increases coupling and information sharing. If `FooButton` doesn't need a property from `ButtonProps`, you can't remove it without affecting `BarButton`. If `BarButton` needs a new property, you need to supply it everywhere you're using `FooButton`.

Instead, **each component should own its own properties**.

```tsx
interface FooButtonProps {
    // ...
}

export function FooButton(props: FooButtonProps) {
    // ...
}
```

```tsx
interface BarButtonProps {
    // ...
}

export function BarButton(props: FooButtonProps) {
    // ...
}
```

Now, changes to `BarButton` don't affect `FooButton` unless actually necessary.

In the following example, the new property `b` on `FooButton` doesn't require adding a `b` property to `BarButton`.

```tsx
import * as React from "react";

interface FooButtonProps {
    a: number;
    b: number; // this is a new property
}

declare function FooButton(props: FooButtonProps): React.ReactElement;

interface BarButtonProps {
    a: number;
}

declare function BarButton(props: FooButtonProps): React.ReactElement;

declare const conditional: boolean;

function Test() {
    const Button = conditional ? FooButton : BarButton;
    return <Button a={123} b={456} />;
}
```

[Playground link](https://www.typescriptlang.org/play/?jsx=2&ssl=1&ssc=1&pln=21&pc=2#code/JYWwDg9gTgLgBAKjgQwM5wEoFNkGN4BmUEIcARFDvmQNwBQdwAdjFlAXlnAGIQQBCAVxgwITAArEw6AN504ClAC44TQSABGbeorgaVazdrgB6E3BgALYOhspVWAO5wwUtjACedAL4MAJli4ADbIlHAEgkz4wGI8fEIiYgAUrhDSKrwCwqISUqgAlCrYeDAAdMX4AKJBWCBYLPSMLGwcuFz8oQk5kmmy8orIBupaUPS+dAHBoVwRUTAxTHAdUF3JqelxWYm5vYWYVGUVMNW19TCNkyFhuGKo8DdMfsDzYshBKhp8NchMjbPRsQAKlg7kl8nA5LoHncltlYgBeOAPJ4vJhvOAAfk2q0WKmWOJ0ikoMEEUEWAB4cSh4TIAIwAJgAzN49DSACwAVgAbCyTAA+MZAA)

Sharing interfaces is especially attractive to those coming from an object-oriented world. Try to avoid habitutally using inheritance and conformance; in TypeScript type checking "focuses on the _shape_ that values have".

---

Different Component Types

HOCs

higher order components and typescript have had a bit of a rocky road, but typing has been getting better and better, notably with recent changes around spread typing (todo: get link to issues) 

- three types to consider: A generic one, the props the wrapped component uses that have nothing to do with your extra behavior, the props that the returned component now require, and the props that the hoc interacts with on the returned component
- use widest component type possible, only reason to not do this is for ref forwarding

```tsx
function withExtraFunctionality<P>(WrappedComponent: React.ComponentType<P & ExtraFunctionalityProvidesProps>) {
    return function ExtraFunctionality(props: P & ExtraFunctionalityRequiresProps) {

    }
}
```

Nullable vs optional props

Gotchas

- returning null from functional components
- using arrays directly within components (return or inside)

`contextTypes`