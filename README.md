# Simple Preact App with Github API
Basic packages:
* *webpack* - generates the `bundle.js` that will be run in the browser from the source files.
* *webpack-dev-server* - lightweight development server, regenerates the bundle (incrementally) when files change, so the file isn't written to disk again on each change.
* *babel-core* - transforms JS features for browser compatibility.
* *babel-loader* - get webpack and babel talking.
* *babel-preset-env* - gets the right features for the different browsers.
* *babel-plugin-transform-react-jsx* - transforms jsx to browser js.

## Adding the initial dependencies
```bash
yard add --dev webpack webpack-dev-server babel-core babel-loader babel-preset-env babel-plugin-transform-react-jsx
```
```bash
yarn add preact
```

## Configure Webpack 2 and Babel for Preact
```bash
touch webpack.config.js
```
The module config file can be divided into five parts:
* *input* - specify entry point for the app `entry: './src'`. It will point to `src/index.js` resource as the entry point. Alternatively use the `path` variable to support different OS environments as follows: 
```js 
const path = require('path');
path.join(__dirname, 'build') 
```
* *output* - current directory, `__dirname` + an auto generated `'/build'` folder.

Run `./node_modules/.bin/webpack` or `node_modules\.bin\webpack` for windows at this point to see that the bundle file is generated inside a build directory.

* *transformations* - under the `module` key we provide `rules` and an object for the configuration of our loader.  

## Define Functional Components
Functional components receive `props` arguments and returns `jsx` - it does not maintain any internal state therefore. This is used for static components such as the `User.js`:
```js
import { h } from 'preact';

export function User(props) {
  return (
    <div class="user">
      <figure class="user__image">
        <img src={props.image} />
      </figure>
      <p class="user__name">{props.name}</p>
    </div>
  );
}

export default User;
```
Now pass the props as simple attributes in the container component, `App.js`:
```js
import { h } from 'preact';
import User from './User'

export function App() {
  return (
    <div class="app">
      <User image="hey.png" name="name" />
    </div>
  );
}

export default App;
```