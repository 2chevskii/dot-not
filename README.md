# DOT-NOT

[![Logo](logo.png)][repo]

> Another fucking dot notation lib in js?!

## Installation

`npm i @rustworkshop/dot-not`

## Usage

### Import module

```js
import dotnot from '@rustworkshop/dot-not'
// or
const dotnot = require('@rustworkshop/dot-not')
// destructure import works properly only in TypeScript (tested in NodeJS/VSCode)
import { get, set, copy, move, remove, parse } from '@rustworkshop/dot-not'
```

### Paths

This package uses own parser for dot-notation paths handling, it has some rules

  - Nested properties are separated by dot:

    ```js
    'foo.bar.baz' => [ 'foo', 'bar', 'baz' ] =>  { foo: { bar: { baz: <some value> } } }
    ```

  - You can escape dot using backslash (`\`):

    ```js
    'foo\\.bar.baz' => [ 'foo.bar', 'baz' ]
    ```

  - Backslashes are only interpreted as escape characters while they are located before other backslashes or dots

    ```js
    'foo\\bar' == 'foo\\\\bar' => [ 'foo\\bar' ]
    'foo.\\' => [ 'foo', '\\' ]
    ```

  - You can escape backslash by using backslash:

    ```js
    'foo\\\\.bar.baz' => [ 'foo\\', 'bar', 'baz' ]
    ```

  - Empty path segments are interpreted as property with '' key

    ```js
    '' => [ '' ] => { '': <some value> }
    ```

    ```js
    '.' => [ '', '' ] => { '': { '': <some value> } }
    ```

### Receiving values

>Function `get` allows you to get values from objects

```ts
function get (object: object, path: string, defaultValue?: any): any
```

```js
const object = { hello: 'world' };

console.log(get(object, 'hello')); // 'world'
```

>When supplied, 'defaultValue' will be written into target property, if it does not exist

```js
const object = { hello: 'world' };

console.log(get(object, 'foo.bar', 42)); // 42
console.log(object); // { hello: 'world', foo: { bar: 42 } }

```

**Warning:** while writing a default value to the object, it will overwrite all the existing properties that are encountered, if they are not objects or arrays

```js
const object = { hello: 'world' };

console.log(get(object, 'hello.bar', 42)); // 42
console.log(object); // { hello: { bar: 42 } }
```

### Setting values

Function `set` allows you to set values for object properties

```ts
function set (object: object, path: string, value: any, force?: boolean): boolean
```

```js
const object = {};

console.log(set(object, 'foo\\.bar', 42)); // true

console.log(object); // { 'foo.bar': 42 }
```

>By default, `force` argument is set to `true`, so like with `get` function, it will overwrite all encountered properties to match the structure, you can set it to `false`, so your objects are kept intact (function will return `false` as well)

```js
const object = {
    foo: 55
};

console.log(set(object, 'foo\\.bar', 42, false)); //true

console.log(object); // { 'foo.bar': 42, foo: 55 }

console.log(set(object, 'foo.bar', 55, false)); // false

console.log(object); // { 'foo.bar': 42, foo: 55 }

console.log(set(object, 'foo.bar', 55, true)); // true

console.log(object); // { 'foo.bar': 42, foo: { bar: 55 } }
```

### Checking for property existence

Function `has` will simply check, if property exists in the object

```ts
function has (object: object, path: string, type?: string): boolean
```

```js
const object = {
    foo: {
        foo: 55,
        bar: undefined,
        baz: [
            'hello',
            'world'
        ]
    }
};

console.log(has(object, 'foo')); // true

console.log(has(object, 'foo.bar')); // true

console.log(has(object, 'foo.baz.1')); // true

console.log(has(object, 'foo.baz.2')); // false

```

>You can also check if the property matches the type you specify

```js
const object = {
    foo: {
        foo: 55,
        bar: undefined,
        baz: [
            'hello',
            'world'
        ]
    }
};

console.log(has(object, 'foo.foo')); // true

console.log(has(object, 'foo.foo', 'string')); // false
```

### Copying properties

Function `copy` allows you to copy value from one property to another (possibly - to another object)

```ts
function copy (sourceObject: object, sourcePath: string, targetPath: string, targetObject?: object): boolean
```

**Warning:** library does not perform 'deep' copy of objects! That means [arrays] and {objects} will be just a 'link' to the original and will mutate with it

>Returns `false`, if there is nothing to copy from, otherwise - true. Overwrites the target property!

```js
const object = {
    foo: 42
};

copy(object, 'foo', 'bar.foo'); // when 4th argument (target object) is not supplied, it will be the source object itself

console.log(object); // { foo: 42, bar: { foo: 42 } }
```

### Moving properties

Function `move` allows you to remove property from one object, and add it to another

```ts
function move (sourceObject: object, sourcePath: string, targetPath: string, targetObject?: object): boolean
```

```js
const object = {
    foo: 42
};

copy(object, 'foo', 'bar.foo'); // when 4th argument (target object) is not supplied, it will be the source object itself

console.log(object); // { bar: { foo: 42 } }
```

### Deleting properties

Function `remove` allows you to delete object's property

```ts
function remove (object: object, path: string): boolean
```

```js
const object = { foo: 'bar' };

remove(object, 'foo');

console.log(object); // { }
```

### Parsing dotty paths

Function `parse` exposes parser used in the library

```ts
function parse (path: string): string[]
```

```js
console.log(parse('foo.bar..baz\\.\\\\.\\.')); // [ 'foo', 'bar', '', 'baz.', '\\', '.' ]
```

## Building

### Requirements

  - [PowerShell Core][pscore] `>=7.0.0`
  - [NodeJS]

### Steps

  - Clone the source repository

    `git clone https://github.com/2chevskii/dot-not.git`

  - Install all the dependencies

    `npm install`

  - Build the project (with or without `tslib` imports, depends on your wish)

    `npm run build` <=> `npm run build -- -NoTSLib`

  - Optionally - generate a tarball

    `npm pack`

[pscore]: https://github.com/PowerShell/PowerShell/releases
[nodejs]: https://nodejs.org/en/download/current/
[repo]: https://github.com/2chevskii/dot-not.git
