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

There are two main component-related things you'll touch when writing React code:

1. [`React.ComponentType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f0841a3126737ab117add60b2011d7a7c10022eb/types/react/index.d.ts#L82) is what's in JSX arrow brackets (other than html primitives)
2. [`React.ReactElement`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f0841a3126737ab117add60b2011d7a7c10022eb/types/react/index.d.ts#L146-L150) ([`JSX.Element`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f0841a3126737ab117add60b2011d7a7c10022eb/types/react/index.d.ts#L2942)) is what JSX produces

```tsx
import * as React from "react";

class Test extends React.Component<{ Comp: React.ComponentType }> {
    render() {
        const el: React.ReactElement = <this.props.Comp />;
        return <>{el}</>
    }
}
```

`React.ComponentType` is composed of `React.ComponentClass`, for class-based components, and `React.FunctionComponent`[^1] for functional components.

You might encounter a more "exotic" types of component extending from [`React.ExoticType`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/f0841a3126737ab117add60b2011d7a7c10022eb/types/react/index.d.ts#L355) like forwarded ref components, context providers, and memoized components. These have different behavior restrictions at runtime, so most difficuties you'll encounter are intentional.

## Don't export properties types

As a codebase grows, it makes sense to export these interfaces to reuse in other components and keep things DRY, especially as your codebase expands and as you start making use of [higher-order components](https://reactjs.org/docs/higher-order-components.html) and [composition](https://reactjs.org/docs/composition-vs-inheritance.html).

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

## Nullable or optional props?

```tsx
interface MyComponentProps {
    requiredProp: string;
    optionalProp?: string;
    nullableProp: string | null;
}
```

If a property isn't required, I generally advise making it nullable instead of optional. Optional properties can be fully omitted, which means they're easy to forget. Nullable properties require explicitness, which is especially helpful when introducing a new property into a large codebase---the compiler will tell you if you've missed anything.

Only use optional properties when the property has a default value or if forgetting it won't break the user experience.

Avoid using optional and nullable properties. They have the disadvantages of optionals and make the codebase more complex.

I also recommend not using `undefined` within variable declarations, also because it makes it easy to make accidental mistakes. This also helps avoid needing `nullableProp={value ?? null}`.

## Typing higher-order components

[Higher-order components](https://reactjs.org/docs/higher-order-components.html) are an advanced React pattern to reuse component logic. In TypeScript, higher-order components are usually [generic](https://www.typescriptlang.org/docs/handbook/generics.html) to decouple them from the components being wrapped.

Property typing higher-order components is a pain in the ass.

When writing or refactoring a higher-order component into TypeScript, you need to understand the **parameter component's properties** and **the returned component's properties**. The parameter component's properties can be divided into those that the higher-order component uses, and those that it doesn't. The last of these; those that the higher-order component doesn't need to know about, are generally represented by a generic type: let's call it `P`.


You also occasionally need to know the type of component returned

- three types to consider: A generic one, the props the wrapped component uses that have nothing to do with your extra behavior, the props that the returned component now require, and the props that the hoc interacts with on the returned component
- use widest component type possible, only reason to not do this is for ref forwarding

<!-- 
```tsx
function withExtraFunctionality<P>(
    WrappedComponent: React.ComponentType<P & ExtraFunctionalityProvidesProps>
) {
    return function ExtraFunctionality(props: P & ExtraFunctionalityRequiresProps) {
        // ...
    }
}
``` -->

[Playground link](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAKjgQwM5wEoFNkGN4BmUEIcARFDvmQNwBQdAJlrgDbKVwECuAdvsAi84AcywwAIsFRh2ATwByyEFgAUuEpF5ZeMAFyYqMAHQBRVlhW6AKnLBYAlAdQwowXiPp13MLFAJ4WHCmAB6uyABifAJCyKzAMHIACsQAbsDMqCkQYOgA3nRwRSjOru6ehcUARqVuHvQAvgw+fgG4QaHhUfwwgrxxCXLYAI7cwJRZxLlwBcVwNXAudRVzuLXljQw8PX1wAO4JABadUJHRvbHxiQA8SQB8qpVFAOqnYPaMAMKaQjr6hngTN9wL8bHYsLc4AAyYJhU7dGL9K7JNIZLCTHKoO50JwA-DGYFaP62eyQmEnM47S6DEZjCbZXJ3GZPLjnXYUhEXJGDR5zOZgKaoAxJaGwrps6mJWnjdEM1AshzMvnFAD0KsWhw4WEYABo4C0oNyAF7auCsCAiYC4PVYYwiYws1ZCFxwADayAAunAALx4kzcVBYADKMGQvlUZDIDnoyqKjuKlBg3ENcGur2Q721hNB8GQ3ryyAaM2MJYFmKLKruMeKTTmHIl3MSxkY0lkyEUyiCvoABgcYMc4ZTEQNEqoACR5MSSVvyJQqVTpzNfH7aXQOBoObvVoqJ5PCetUxtyTZMFjsTjbRFwABCaCw2dXMFUZdyBjycEY6w8cA3BmwgOMf98HMSw-i8NU4BFdwCD8ShGDgDQoEofBWDkFB8g-L8RB-OgNF4F1Fw+W9AwfP4fX2I4D2HZFVGI+8Vz+aMGGuOjSN0D9vTIRgyDgSt6DTN4iLvNj4EYTjuPmTiqh43BONwHi+KAA)

```tsx
import * as React from "react";

declare function getDisplayName(component: React.ElementType): string;

interface ExtraFunctionalityProvidesProps {
    a: string;
    b: string;
}

interface ExtraFunctionalityRequiresProps {
    b: string;
    c: string;
}

function withExtraFunctionality<P>(
    WrappedComponent: React.ComponentType<P & ExtraFunctionalityProvidesProps>
): React.ComponentType<P & ExtraFunctionalityRequiresProps> {
    function ExtraFunctionality(
        props: P & ExtraFunctionalityRequiresProps
    ) {
        // shared, internalized logic, e.g.
        const [a] = React.useState("");
        
        return <WrappedComponent a={a} {...props} />;
    }
    ExtraFunctionality.displayName = `withExtraFunctionality(${getDisplayName(WrappedComponent)})`;
    return ExtraFunctionality;
}

declare function BaseComponent(props: { d: string }): React.ReactElement;

// P inferred correctly as { d: string }
const WrappedBaseComponent = withExtraFunctionality(BaseComponent);

<BaseComponent d="d" />;
<WrappedBaseComponent d="d" b="b" c="c" />;
```

A common error I encounter here is some form of

```txt
'P' could be instantiated with an arbitrary type which could be unrelated to…
```

This generally happens when a higher-order component "steals" properties from its wrapped component. It highlights the issue that the properties names might overlap with ones legitimately needed by the wrapped component.
What's happening is that the keys of `ExtraFunctionalityRequiresProps` are being encapsulated within `withExtraFunctionality`, but they _may_ be also used by `P`. 

What this indicates is that while `ExtraFunctionalityRequiresProps` is attempted to be stripped from `P` may contain

Overlapping properties

Higher-order components and typescript can be a pain, but each upgrade of TypeScript seems to make it smoother (or maybe it's just me learning). I'm hopeful that [#10727](https://github.com/microsoft/TypeScript/issues/10727) will address some of the remaining issues and [#9252](https://github.com/microsoft/TypeScript/issues/9252).

## Refs

Refs are another place where typing

---

Gotchas

- returning null from functional components
- using arrays directly within components (return or inside)

`contextTypes`

Statics

Refs

At time of writing, typescript is at v3.9.2

[^1]: Previously called React.SFC (stateless functional component)