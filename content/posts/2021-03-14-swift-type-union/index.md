---
title: "Type Unions in Swift"
date: 2021-03-14
tags: ["tech", "tutorial", "swift"]
slug: type-unions-in-swift
---

Type unions are one of my favorite patterns to enforce stricter typing in a codebase. The basic idea is to allow a single type to represent a value that is one of a set of different, distinct types.

One of my frequent use cases is iteration over a collection of varied objects. A type union allows me to avoid complicated merging and ordering logic and use simple conditional logic within the iteration body. It’s also used commonly in APIs I interact with, where a single resource can produce different but similar things, or [I want to reduce ambiguity between conditional fields](/posts/2020-04-03-typing-tricks-to-reduce-ambiguity/#type-unions).

Type unions can be a stronger pattern than inheritance. In class-based inheritance, the possible set of types is unbounded, while type unions have an explicit set known at compile time. In languages like TypeScript (and Swift, as we’ll see), sub-types of a type union can be unrelated and have distinct inheritance chains.

## In other languages

Type unions are simple in weakly typed languages like JavaScript or Python[^3] since a variable can contain any value. Strongly typed languages take different approaches to support them.

### TypeScript

TypeScript has first-class support with [union types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types). Type narrowing is done with [type predicates and custom functions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates).

```typescript
interface Rabbit {
	name: string;
	eat(food: Carrot): void;
}
class Dog {
	name: string;
	pet() {}
}
interface Turtle {
	name: "turtle"
}

type Pet = Rabbit | Dog | Turtle

function whatIsIt(pet: Pet) {
	if (typeof pet == "string") {
		return "turtle"
	} else if (pet instanceof Dog) {
		pet.pet()
		return "dog"
	} else {
		return "rabbit"
	}
}
```

TypeScript is nice because it automatically casts the inspected variable's type: within the conditional blocks, `pet` assumes the narrowed type. TypeScript automatically infers common attributes of the sub-types, allowing access to the common `name` property (`pet.name`).

### Kotlin

Kotlin supports type unions with [sealed classes](https://kotlinlang.org/docs/sealed-classes.html). Type narrowing is done with [when expressions](https://kotlinlang.org/docs/sealed-classes.html#sealed-classes-and-when-expression).

```kotlin
sealed class Pet()
data class Rabbit(
	val name: String,
	val carrot: Double
) : Pet() {
	fun eat(food: Carrot) {}
}
class Dog(val name: String) : Pet() {
	fun pet() {}
}
object Turtle : Pet() {
	val name: String = "turtle"
}

fun whatIsIt(pet: Pet): String =
	when (pet) {
		is Rabbit -> "rabbit"
		is Dog -> {
			pet.pet()
			"dog"
		}
		is Turtle -> "turtle"
	}
```

Like TypeScript, variable types are automatically narrowed. Kotlin does not automatically infer common attributes, but they can be defined on the base sealed class, following standard inheritance patterns.

## In Swift

The core construct for a type union in Swift is an [enumeration with associated values](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html#ID148). Type narrowing is done with `case` statements.

```swift
protocol Rabbit {
	var name: String { get }
	func eat(food: Carrot)
}
struct Dog {
	var name: String
	func pet() {}
}
typealias Turtle = String

enum Pet {
	case rabbit(Rabbit)
	case dog(Dog)
	case turtle(Turtle)
}

func whatIsIt(pet: Pet) -> String {
	switch pet {
	case .rabbit:
		return "rabbit"
	case .dog(let dog):
		dog.pet()
		return "dog"
	case .turtle:
		return "turtle"
	}
}
```

Notice that to get a variable of the narrowed type, a new variable is directly defined within the case expression (`let dog`).

A more concise form of type narrowing is also possible within an `if` statement[^2].

```swift
if case .rabbit(let rabbit) = pet {
	// ...
}
```

The main downside to Swift’s form of type unions is that the value is nested within another. It’s not possible to directly use attributes on a `Pet` variable. To work around that, you need to define accessors on the enum itself[^1].

```swift
enum Pet {
	case rabbit(Rabbit)
	case dog(Dog)
	case turtle(Turtle)
	
	var name: String {
		switch self {
		case .rabbit(let rabbit):
			return rabbit.name
		case .dog(let dog):
			return dog.name
		case .turtle:
			return turtle
		}
	}
}

func example(pet: Pet) {
	pet.name
}
```

If the different sub-types share a [protocol](https://docs.swift.org/swift-book/LanguageGuide/Protocols.html), you can define a single accessor to access the protocol.

```swift
protocol Mammal {
	var furColor: String { get }
}

enum Pet {
	case rabbit(Rabbit)
	case dog(Dog)
	case turtle(Turtle)
	
	var mammal: Mammal? {
		switch self {
		case .rabbit(let mammal as Mammal), .dog(let mammal as Mammal):
			return mammal
		case .turtle:
			return nil
		}
	}
}

func example(pet: Pet) {
	pet.mammal?.furColor
}
```

Taking this further, if _all_ sub-types share a protocol, you can extend the enum itself from that protocol and delegate to that accessor.

```swift
protocol Animal {
	func sleep()
}

enum Pet: Animal {
	case rabbit(Rabbit)
	case dog(Dog)
	case turtle(Turtle)
	
	private var animal: Animal {
		switch self {
		case .rabbit(let animal as Animal),
			 .dog(let animal as Animal),
			 .turtle(let animal as Animal):
			return animal
		}
	}
	
	func sleep() {
		animal.sleep()
	}
}

func example(pet: Pet) {
	pet.sleep()
}
```

I find type unions significantly simplify my code and prevent mistakes by strengthening my type semantics. I hope this helps you out as well.

[^1]: There's some [discussion on the Swift forums](https://forums.swift.org/t/extract-payload-for-enum-cases-having-associated-value/27606) about proposed syntax changes to make it easier to access the associated value within an enum, so keep your eyes out for changes in this space.

[^2]: [Here's another good article about working with Swift enums](https://sarunw.com/posts/lesser-known-ways-of-using-swift-enums/)

[^3]: Unless you're using [Python 3.5 type hinting](https://docs.python.org/3/library/typing.html#typing.Union).
