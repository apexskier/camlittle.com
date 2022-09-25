---
title: Simple `struct` dependency mocking in Go
date: 2022-09-25
tags: [tech, tutorial]
---

I work with many people using Go for the first time, and one of the common struggles I see is testing code that depends on external `struct` types.

Let's start with a simple (though contrived) example. I'm writing some code that depends on the [go-github](https://github.com/google/go-github) library to interact with the GitHub API.

```go
package before

import (
	"context"
	"fmt"

	"github.com/google/go-github/v47/github"
)

type obj struct {
	user string
	gh   *github.OrganizationsService
}

func New(user string) obj {
	return obj{
		user: user,
		gh:   github.NewClient(nil).Organizations,
	}
}

func (m *obj) CountOrganizations(ctx context.Context) (int, error) {
	orgs, _, err := m.gh.List(ctx, m.user, nil)
	if err != nil {
		return 0, fmt.Errorf("couldn't list organizations: %w", err)
	}
	return len(orgs), nil
}

func (m *obj) IsMemberOf(ctx context.Context, org string) (bool, error) {
	result, _, err := m.gh.IsMember(ctx, org, m.user)
	if err != nil {
		return false, fmt.Errorf("couldn't call IsMember: %w", err)
	}
	return result, nil
}
```

How do you test this? `github.OrganizationsService` is a `struct` type, so we're required to have a direct instance of it to pass type checking. In many cases, this will force your tests to make network calls. Usually, you can pass `http.Client` and override its behavior, but that gets messy fast.

## Setup

The key to testing this behavior is to depend on an `interface` type instead of the `struct`. Go makes this easy, which you may not know if you're used to other languages. In Go, an interface describes behavior that both your code _or dependency code_ can implement. This feature means we can define an interface in our code that `github.OrganizationService` implements and the compiler will recognize it.

```go
type githubOrganizations interface {
}

type obj struct {
	user string
	gh   githubOrganizations
}

```

I usually start with an empty interface and add methods as needed. Doing this helps keep my interface as clean as possible, which makes understanding code when refactoring or changing dependencies later easier.

Swapping `*github.OrganizationsService` for `githubOrganizations` works because all structs conform to the empty interface. However, I now see errors wherever I use `.gh`: `m.gh.List undefined (type githubOrganizations has no field or method List)`.

We need to add each of the undefined methods to the interface. If I'm too lazy to look at the docs, I'll temporarily swap `githubOrganizations` back to `*github.OrganizationsService`, jump to the definition of the previously undefined method and port it over.

![Filling example](https://content.camlittle.com/2022-09-24-go-mocking-interface-filling.mp4)

```go
type githubOrganizations interface {
	List(ctx context.Context, user string, opts *github.ListOptions) ([]*github.Organization, *github.Response, error)
	IsMember(ctx context.Context, org, user string) (bool, *github.Response, error)
}
```

## Writing a test

Now let's use this interface to write a test verifying `CountOrganizations` works as expected.

```go
func TestCountOrganizations(t *testing.T) {
	obj := obj{
		gh: mockGHList{},
	}

	c, err := obj.CountOrganizations(context.Background())
	if err != nil {
		t.Fatal(err)
	}
	if c != 3 {
		t.Fatalf("unexpected number of organizations: %d", c)
	}
}
```

Here's the real magic: `mockGHList` is a `struct` that embeds a pointer to `github.OrganizationsService`, which we originally depended on.

```go
type mockGHList struct {
	*github.OrganizationsService
}
```

Go pointer semantics and struct embedding rules mean all methods of `*github.OrganizationsService` can be called on `mockGHList`, even when the embedded value is `nil`. This allows us to run the test without compilation issues, but because `github.OrganizationService` is `nil`, the test panics.

```
--- FAIL: TestCountOrganizations (0.00s)
...
github.com/google/go-github/v47/github.(*OrganizationsService).List
```

A `nil` pointer was found when trying to call `.List` on the `nil` `*github.OrganizationsService`. Go struct embedding rules mean that methods defined on the `mockGHList` object override those on the nested `*github.OrganizationsService` object. This rule lets us write our mock method.


```go
func (mockGHList) List(context.Context, string, *github.ListOptions) ([]*github.Organization, *github.Response, error) {
	return []*github.Organization{{}, {}, {}}, nil, nil
}
```

Rerun the test, and it passes!

```go
--- PASS: TestCountOrganizations (0.00s)
```

## Benefits

### Single-use, minimal mocks

By wrapping the original struct, we only need to implement the methods our tests directly depend on. This encourages single-use, minimal mock objects instead of manually maintaining large shared mocks.

Any hardcoded mock codifies its expectations of how specific scenarios behave, usually the first tests it's used in. Those expectations make it harder to use for new tests. As the codebase grows, it either doesn't thoroughly test new behavior or combinatorially increases in complexity (by introducing [boolean flags](https://martinfowler.com/bliki/FlagArgument.html, for example). At some point, the mock deserves its own tests to track what it's doing.

### Fail-by-default

This pattern fails when executed code makes unexpected method calls, which can help catch accidental changes.

### Mocking libraries

I've also successfully used this pattern with third-party mocking libraries.

Here's an example of use with [`"github.com/stretchr/testify/mock"`](https://github.com/stretchr/testify#mock-package).

```go
type mockGHIsMember struct {
	mock.Mock
	*github.OrganizationsService
}

func (m *mockGHIsMember) IsMember(ctx context.Context, org, user string) (bool, *github.Response, error) {
	args := m.Called(ctx, org, user)
	return args.Bool(0), args.Get(1).(*github.Response), args.Error(2)
}

func TestIsMember(t *testing.T) {
	gh := mockGHIsMember{}
	obj := obj{
		user: "apexskier",
		gh:   &gh,
	}

	gh.On("IsMember", mock.MatchedBy(func(context.Context) bool { return true }), "org", obj.user).Return(true, (*github.Response)(nil), nil)

	result, err := obj.IsMemberOf(context.Background(), "org")
	require.NoError(t, err)
	assert.True(t, result)
}
```

I still only need to mock the method being called.

## Caveats

* Defining an interface does not work when using struct fields since interfaces can only declare methods.
* Auto-complete won't show other methods available on the original `struct` type. https://pkg.go.dev is your friend, or you can manually declare a variable of the original type and use auto-complete on that.

---

You can view the code from this post at https://github.com/apexskier/go-struct-mocking-demo/.
