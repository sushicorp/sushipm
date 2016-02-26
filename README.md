# sushipm
Install npm run script snippets

# install 

```sh
$ npm install -g sushipm
```

# Usage

## Show available scripts

```sh
$ sushipm list
```

## Add run-script into package.json

```sh
$ sushipm add run-script-name
```

**example:**

```sh
$ sushipm add build:js
```

### Add dev run-script into package.json

Create `dev` run-script which executes all tasks named "watch" with parallelshell.

For example, when `build:js`, `watch:js`, `watch:css` tasks exists:

```sh
$ sushipm dev
```

will runs `watch:js` and `watch:css`.


## Create single file

```sh
$ sushipm create index.html
```

or

```sh
$ sushipm create main.js
```

or

```sh
$ sushipm create sample.vue
```

bra bra.

