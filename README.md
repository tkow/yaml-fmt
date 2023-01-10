## Yaml

Configurable Yaml formatter.

### Install

```shell
npm i -g yaml-fmt
```

### Usage

```shell
yaml-fmt fmt $gropPaths... [-c [configpath]] [-i [indent]] [-a (sort all object properties)]
```
### Config File

The configuration file is json.

- targets: Record<string, Array<string> | true>: set target properties you want to sort value, if specifying string array, the key is priotized.
- root: Array<string> | true: If you set boolean flag to it, sort root properties, and if specifying string array, the key is priotized.
- indent: set indent number of output yaml
- all: sort all properties before applying sort by configuration.

```json
{
  "targets": {
    "properties": ["id"]
  }
}
```

#### Array Sort

```json
{
  "targets": {
    "properties.enumValue.enum.[]": true,
  }
}
```

target file
```yaml
properties:
  id:
    type: 'number'
  enumValue:
    type: object
    enum: ['b', 'c', 'a'],
```

sorted
```yaml
properties:
  id:
    type: 'number'
  enumValue:
    type: object
    enum: ['b', 'c', 'a'],
```


Limitation: To sort values in array needs explicit configurations.

#### Wild Card

You can specify wild card in same depth property. You need

```json
{
  "targets": {
    "*.target": true
  }
}
```

target file

```yaml
a:
  target:
    b: 1
    a: 2
b:
  target:
    b: 1
    a: 2
```

sorted

```yaml
a:
  target:
    a: 2
    b: 1
b:
  target:
    a: 2
    b: 1
```
