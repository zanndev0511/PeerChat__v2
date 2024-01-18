
This fork moves "sax" to "devDependencies" and bundles it with
rollup ([rollup-plugin-node-polyfills](https://github.com/ionic-team/rollup-plugin-node-polyfills)).

([rollup-plugin-polyfill-node](https://github.com/snowpackjs/rollup-plugin-polyfill-node) doesn't work, don't know why)

I also removed tests and coverage for faster setup. :sweat_smile:

Applied these [_useful forks_](https://useful-forks.github.io/?repo=nashwaan%2Fxml-js):

- [Escape `&` `<` in attributes](https://github.com/melody-universe/xml-js)
- [Add nativeTypeAttributes type definition](https://github.com/mariuseis/xml-js/commit/aec4986298b3270ee8f429871907d65d9859b0da)
- [Handling errors with onErrorFn instead of throwing exception on first error](https://github.com/drdmitry/xml-js/commit/3476bb3a7917c6a2f7f464427a2dfd8f479d53c3)
- ... Need more? PR on me!

Install: `npm i @netless/xml-js`.

Replace it in **package.json**:

```json
"dependencies": {
  "xml-js": "npm:@netless/xml-js"
}
```

Replace it in **vite.config.js**:

```js
export default defineConfig({
  alias: {
    "xml-js": "@netless/xml-js"
  }
})
````

Replace it in **webpack.config.js**

```js
{
  "resolve": {
    "alias": {
      "xml-js": "@netless/xml-js"
    }
  }
}
````

Other ways: [see how preact does](https://preactjs.com/guide/v8/switching-to-preact/).

## Todo

- Maybe replace sax with [saxes](https://www.npmjs.com/package/saxes).

## Changelog

### 1.6.15

- Transfer to `@netless/`.

### 1.6.14

- Use named export, for tree shaking purpose.

- - -

Read the original [README](https://github.com/nashwaan/xml-js).
