---
title: "Typing tricks to reduce ambiguity"
date: 2020-04-03T08:11:00+02:00
tags: ["tech", "philosophy", "typescript", "go", "kotlin", "api-design"]
toc: true
---

<!--
A few notes on interactivity here
- no js, all toggling of language examples is done with css
- most of the controls text is set via css pseudo elements. this prevents
  it from showing up in certain contexts, like copying and scraping
-->

One of the fundamentals of programming is defining interfaces, or contracts between parts of systems. Interfaces create layers of abstraction and allow scaling code beyond the complexity a single person can hold in their head. They appear at the level of function signatures, to dependency signatures, up to service-to-service network calls.

There are almost always grey areas within an individual interface; areas where behavior isn't explicitly defined. This causes a couple problems. Interpretations of behavior can differ between people or over time, leading to subtle bugs due to drifting behavior in different modules. It also requires overhead and more error handling in each consumer, as you'll see below.

In a strongly typed language there are some not-immediately-obvious techniques to reduce this ambiguity and create a more intuitive design.

I'll provide code examples throughout this post, available in several different languages.

<!-- no <p> --> <input type="radio" name="lang" id="lang-ts" value="ts" /> <label for="lang-ts">Typescript</label><br />
<!-- no <p> --> <input type="radio" name="lang" id="lang-kt" value="kt" /> <label for="lang-kt">Kotlin</label><br />
<!-- no <p> --> <input type="radio" name="lang" id="lang-go" value="go" /> <label for="lang-go">Go</label><br />
<!-- no <p> --> <input type="radio" name="lang" id="lang-openapi" value="openapi" checked /> <label for="lang-openapi">OpenAPI Specification</label><br />
<!-- no <p> --> <input type="radio" name="lang" id="lang-all" value="all" /> <label for="lang-all">All of the above</label><br />

## The basics: Comments

As the author, the easiest way to avoid ambiguity is through documenting your code.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
interface Foo {
  type: string; // describes how foo should be represented
}

interface Bar {
  discount?: number;
  discountApplied?: boolean; // indicates if `discount` is possible, or actually applied, not present if no discount
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
data class Foo(
  val type: String // describes how foo should be represented
)

data class Bar(
  val discount: String?,
  val discountApplied: Boolean? // indicates if `discount` is possible, or actually applied, not present if no discount
)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type Foo struct {
	Type string // describes how foo should be represented
}

type Bar struct {
	Discount        *string
	DiscountApplied *bool // indicates if `discount` is possible, or actually applied, not present if no discount
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    Foo:
      type: object
      properties:
        type:
          type: string
          description: describes how foo should be represented
    Bar:
      type: object
      properties:
        discount:
          type: string
          nullable: true
        discountApplied:
          type: boolean
          nullable: true
          description: indicates if `discount` is possible, or actually applied, not present if no discount
```

</div>

This helps, but couples you to additional tooling within your editor to expose without reading the source. Comments don't protect against human issues, such as misinterpretation or plain laziness, and conformance can't automatically be verified by build tooling.

## Taking advantage of typing

### Enums

A simple pattern is to use enumeration values. Explicit enumerations can reduce the need for inline error handling and allows for self-documentation through good naming.
This sounds simple, but I see people forget about enums often. The key question to ask is:

> Do I care about how the consumer _uses_ this value?

If the answer is yes, a string type doesn't capture the correct nuance.

<!--
<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>
-->

<div class="example-code full-width" data-lang="ts">
<div class="code-comparison">
<div>

**Before**

```ts
interface Foo {
  type: string;
}

function convertFooTypeToX(x: Foo): string {
  switch (x.type) {
    case "a":
      return "1";
    case "b":
      return "2";
    case "c":
      return "3";
    default:
      throw new Error(`unknown type: ${x.type}`);
  }
}
```

</div>
<div>

**After**

```ts
enum FooType {
  a = "a",
  b = "b",
  c = "c"
}

interface Foo {
  type: FooType;
}

function convertFooTypeToX(x: Foo): string {
  switch (x.type) {
    case FooType.a:
      return "1";
    case FooType.b:
      return "2";
    case FooType.c:
      return "3";
    // no default is required to satisfy type checking
  }
}
```

</div>
</div>
</div>

<div class="example-code full-width" data-lang="kt">
<div class="code-comparison">
<div>

**Before**

```kt
data class Foo(
    var type: String
)

fun convertFooTypeToX(x: Foo): String = when (x.type) {
    "a" -> "1"
    "b" -> "2"
    "c" -> "3"
    else -> throw Exception("unknown type: ${x.type}")
}
```

</div>
<div>

**After**

```kt
enum class FooType {
    a,
    b,
    c,
}

data class Foo(
    val type: FooType
)

fun convertFooTypeToX(x: Foo): String = when (x.type) {
    FooType.a -> "1"
    FooType.b -> "2"
    FooType.c -> "3"
    // no else is required to satisfy type checking
}
```

</div>
</div>
</div>

<div class="example-code full-width" data-lang="go">
<div class="code-comparison">
<div>

**Before**

```go
type Foo struct {
	Type string
}

func ConvertFooTypeToX(x Foo) string {
	switch x.Type {
	case "a":
		return "1"
	case "b":
		return "2"
	case "c":
		return "3"
	}
	panic(fmt.Sprintf("unknown type: %s", x.Type))
}
```

<!-- [Playground](https://play.golang.org/p/LPKcE9TPvvT) -->

</div>

<div>

**After**

```go
type FooType string

const (
	FooTypeA FooType = "a"
	FooTypeB         = "b"
	FooTypeC         = "c"
)

type Foo struct {
	Type FooType
}

func ConvertFooTypeToX(x Foo) string {
	switch x.Type {
	case FooTypeA:
		return "1"
	case FooTypeB:
		return "2"
	case FooTypeC:
		return "3"
  }
  // unfortunately, without real enums in go, we still need this
	panic(fmt.Sprintf("unknown type: %s", x.Type))
}
```

<!-- [Playground](https://play.golang.org/p/W6Zrdrp4OQt) -->

</div>
</div>
</div>

<div class="example-code full-width" data-lang="openapi">
<div class="code-comparison">
<div>

**Before**

```yml
components:
  schemas:
    Foo:
      schema:
        type: string
```

</div>

<div>

**After**

```yml
components:
  schemas:
    Foo:
      schema:
        type: string
        enum: [a, b, c]
```

</div>
</div>
</div>

### String formats

Enums work well, but only work for explicit sets of values---they can't be applied if I don't know the full set of values. If I do know, adding anything new breaks backwards compatibility.

To get around this, I can use a type alias to provide more semantic information.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code" data-lang="ts">

```ts
type HtmlType = string;
```

</div>

<div class="example-code" data-lang="kt">

```kt
typealias HtmlType = String
```

</div>

<div class="example-code" data-lang="go">

```go
type HtmlType string
```

</div>

<div class="example-code" data-lang="openapi">

```yaml
components:
  schemas:
    Foo:
      schema:
        type: string
        format: html
```

</div>

There's a loophole: The consumer could create their own string and pass it in place of `HtmlType`. Depending on the serialization library and language, it can be possible to discourage this with custom deserialization of a non-constructable type.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code" data-lang="ts">

```ts
type HtmlType = string & { __t: "html_type" }

function read(response: Response): HtmlType {
  return response.body as HtmlType;
}
```

</div>

<div class="example-code" data-lang="kt">

```kt
class HtmlTypeDeserializer extends JsonDeserializer<HtmlType> {
  @Override
  fun deserialize(JsonParser jp, DeserializationContext ctx) throws IOException, JsonProcessingException {
    // read contents of jp...
    return HtmlType(content)
  }
}

@JsonDeserialize(using = HtmlTypeDeserializer::class)
class HtmlType private constructor(private val content: String)
```

</div>

<div class="example-code" data-lang="go">

```go
// no example in this language
```

</div>

<div class="example-code" data-lang="openapi">

```yml
# no example in this language
```

</div>

In the real world, it's risky to migrate to a format from an existing enumeration. There's often logic in the client that depends on knowledge of a specific value, and all that logic needs to be transformed into an api driven model. It's tempting to keep it in the client, but that makes _removal_ of the value not-backwards compatible and undocumented.

### Nested nullables

A common pattern I see when designing api responses is to use a flat structure like the following.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
interface Workout {
  swim_id: string | null;
  swim_miles: number | null;
  swim_time: Time | null;
  bike_id: string | null;
  bike_miles: number | null;
  bike_time: Time | null;
  run_id: string | null;
  run_miles: number | null;
  run_time: Time | null;
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
import kotlin.time.Duration;

data class Workout(
    var swim_id: String?,
    var swim_miles: String?,
    var swim_time: Duration?,
    var bike_id: String?,
    var bike_miles: Double?,
    var bike_time: Duration?,
    var run_id: String?,
    var run_miles: Double?,
    var run_time: Duration?
)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type Workout struct {
	SwimID    *string
	SwimMiles *float64
	SwimTime  *time.Duration
	BikeID    *string
	BikeMiles *float64
	BikeTime  *time.Duration
	RunID     *string
	RunMiles  *float64
	RunTime   *time.Duration
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    Workout:
      type: object
      properties:
        swim_id:
          type: string
          nullable: true
        swim_miles:
          type: number
          nullable: true
        swim_time:
          type: number
          nullable: true
        bike_id:
          type: string
          nullable: true
        bike_miles:
          type: number
          nullable: true
        bike_time:
          type: number
          nullable: true
        run_id:
          type: string
          nullable: true
        run_miles:
          type: number
          nullable: true
        run_time:
          type: number
          nullable: true
```

</div>

This leads to open questions: What happens a mix of `id`, `miles`, and `time` is present? Should I always expect `miles` to be present if `id` is present? How does `time` relate to `miles`?

By breaking up the flat structure these can be answered.

Here, it's clear that an `id` is always paired with `miles` and `time`, and each type of activity might be missing:

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
interface Segment {
  id: string;
  miles: number;
  time: Time;
}

interface Workout {
  swim: Segment | null;
  bike: Segment | null;
  run: Segment | null;
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
import kotlin.time.Duration;

data class Segment(
    val id: String,
    val miles: Double,
    val time: Duration
)

data class Workout(
    var swim: Segment?,
    var bike: Segment?,
    var run: Segment?
)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type Segment struct {
	ID    string
	Miles float64
	Time  time.Duration
}

type Workout struct {
	Swim *Segment
	Bike *Segment
	Run  *Segment
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    Segment:
      type: object
      properties:
        id:
          type: string
        miles:
          type: number
        time:
          type: number
    Workout:
      type: object
      properties:
        swim:
          $ref: "#/components/schemas/Segment"
          nullable: true
        bike:
          $ref: "#/components/schemas/Segment"
          nullable: true
        run:
          $ref: "#/components/schemas/Segment"
          nullable: true
```

</div>

With this alternate structure, I can see that the other fields might be missing:

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
interface Segment {
  id: string;
  miles: number | null;
  time: Time | null;
}

interface Workout {
  swim: Segment | null;
  bike: Segment | null;
  run: Segment | null;
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
import kotlin.time.Duration;

data class Segment(
    val id: String,
    val miles: Double?,
    val time: Duration?
)

data class Workout(
    var swim: Segment?,
    var bike: Segment?,
    var run: Segment?
)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type Segment struct {
	ID    string
	Miles *float64
	Time  *time.Duration
}

type Workout struct {
	Swim *Segment
	Bike *Segment
	Run  *Segment
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    Segment:
      type: object
      properties:
        id:
          type: string
        miles:
          type: number
          nullable: true
        time:
          type: number
          nullable: true
    Workout:
      type: object
      properties:
        swim:
          $ref: "#/components/schemas/Segment"
          nullable: true
        bike:
          $ref: "#/components/schemas/Segment"
          nullable: true
        run:
          $ref: "#/components/schemas/Segment"
          nullable: true
```

</div>

And here, I understand that the statistics might be missing, but are tied together:

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
interface Segment {
  id: string;
  stats: {
    miles: number;
    time: Time;
  } | null;
}

interface Workout {
  swim: Segment | null;
  bike: Segment | null;
  run: Segment | null;
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
import kotlin.time.Duration;

data class Stats(
    val miles: Double,
    val time: Duration
)

data class Segment(
    val id: String,
    val stats: Stats?
)

data class Workout(
    var swim: Segment?,
    var bike: Segment?,
    var run: Segment?
)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type Stats struct {
	Miles float64
	Time  time.Duration
}

type Segment struct {
	ID    string
	Stats *Stats
}

type Workout struct {
	Swim *Segment
	Bike *Segment
	Run  *Segment
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    Stats:
      type: object
      properties:
        miles:
          type: number
        time:
          type: number
    Segment:
      type: object
      properties:
        id:
          type: string
        stats:
          $ref: "#/components/schemas/Stats"
          nullable: true
    Workout:
      type: object
      properties:
        swim:
          $ref: "#/components/schemas/Segment"
          nullable: true
        bike:
          $ref: "#/components/schemas/Segment"
          nullable: true
        run:
          $ref: "#/components/schemas/Segment"
          nullable: true
```

</div>

This avoids type asserations and null pointer errors<span class="example-code" data-lang="ts">: `workout.swim_id!`</span><span class="example-code" data-lang="kt">: `workout.swim_id!!`</span><span class="example-code" data-lang="go">: `panic: runtime error: invalid memory address or nil pointer dereference`</span><span class="example-code" data-lang="openapi">.</span>

### Type unions

Another type structure that can reduce ambiguity is a union type. Union types allow representing "exclusive or" in the interface and avoid locking in an inheritance structure. <span class="example-code full-width" data-lang="kt">Kotlin's [sealed classes](https://kotlinlang.org/docs/reference/sealed-classes.html) are a good way to implement these.</span> <span class="example-code full-width" data-lang="ts">This is a [first class feature in Typescript](https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types).</span>

For example, say I want to represent a figure on my site.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
interface Figure {
  source: string;
  attr: string;
  height?: number;
  width?: number;
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
data class Figure(
    val source: String,
    val attr: String,
    val height: Int?,
    val width: Int?
)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type Figure struct {
	Source string
	Attr   string
	Height *int
	Width  *int
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    Figure:
      type: object
      properties:
        source:
          type: string
        attr:
          type: string
        height:
          type: number
          nullable: true
        width:
          type: number
          nullable: true
```

</div>

This works, but allows for accidentally distorting the image by specifying a height and width that doesn't match the aspect ratio. A type union can prevent this.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
type Size = {} | { height: number } | { width: number };

interface UnsizedFigure {
  source: string;
  attr: string;
}

type Figure = UnsizedFigure & Size;
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
sealed class Figure(
    open val source: String,
    open val attr: String
)

class UnsizedFigure(
    override val source: String,
    override val attr: String
): Figure(source, attr)

class HeightSizedFigure(
    override val source: String,
    override val attr: String,
    val height: Int
): Figure(source, attr)

class WidthSizedFigure(
    override val source: String,
    override val attr: String,
    val width: Int
): Figure(source, attr)
```

</div>

<div class="example-code full-width" data-lang="go">

```go
type UnsizedFigure struct {
	Source string
	Attr   string
}

type HeightSizedFigure struct {
	UnsizedFigure
	Height int
}

type WidthSizedFigure struct {
	UnsizedFigure
	Width int
}

type Figure interface{}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
components:
  schemas:
    UnsizedFigure:
      type: object
      properties:
        source:
          type: string
        attr:
          type: string
    Size:
      oneOf:
        - type: object
          properties:
            height:
              type: number
        - type: object
          properties:
            width:
              type: number
    SizedFigure:
      allOf:
        - $ref: "#/components/schemas/UnsizedFigure"
        - $ref: "#/components/schemas/Size"
    Figure:
      oneOf:
        - $ref: "#/components/schemas/UnsizedFigure"
        - $ref: "#/components/schemas/SizedFigure"
```

</div>

Type unions force explicit checking of which type is used. They're possible in many languages, but not all.

<nav class="lang-controls">
<label for="lang-ts"></label>
<label for="lang-kt"></label>
<label for="lang-go"></label>
<label for="lang-openapi"></label>
</nav>

<div class="example-code full-width" data-lang="ts">

```ts
function isHeightSized(x: Size): x is { height: number } {
  return (x as { height?: number }).height != null;
}

function isWidthSized(x: Size): x is { width: number } {
  return (x as { width?: number }).width != null;
}
```

</div>

<div class="example-code full-width" data-lang="kt">

```kt
fun eval(figure: Figure): Int = when (figure) {
    is UnsizedFigure -> 0
    is HeightSizedFigure -> 1
    is WidthSizedFigure -> 2
}
```

</div>

<div class="example-code full-width" data-lang="go">

```go
func eval(figure Figure) int {
	switch t := figure.(type) {
	case UnsizedFigure:
		return 0
	case HeightSizedFigure:
		return 1
	case WidthSizedFigure:
		return 2
	default:
		panic(fmt.Sprintf("Unknown type: %v", t))
	}
}
```

</div>

<div class="example-code full-width" data-lang="openapi">

```yml
# See other languages for reference implementations.
```

</div>

## In the real world

These techniques can give great build-time safety when applied within a single codebase, but it's harder to apply that safety across different codebases (e.g. calling an api, or using a typescript dependency in a javascript codebase). Responsibility for conforming to the contract has been absolved from the consumer and has been shifted explicitly to the producer. Since there's less incentive for explicit protection through validation in client code, errors caused by backwards incompatibility are harder to track down. Documenting changes through the use of techniques like semver make this easy to avoid.

### Introducing into an existing system

In a well-established environment it's sometimes not possible to apply these patterns in the producer; especially when dealing with legacy systems or other teams. In these cases these patterns can be introduced in the middle of the stack, either within a fronting service or a module within the consuming client. This gives an explicit place to add validation and audit that the contract is being followed.

<p>&nbsp;</p>

To summarize: Introducing more complexity into your interface; be it a function call, library, or api; makes it harder for consumers to make the wrong assumptions without asking them to think about logic outside of their business domain.
