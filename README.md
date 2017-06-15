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
import User from './User';

const users = [
  {
    image: "https://avatars1.githubusercontent.com/u/22121420?v=3&s=200",
    name: "Joshua A I"
  },
  {
    image: "https://avatars2.githubusercontent.com/u/13587838?v=3&s=200",
    name: "Charles Agyemang"
  }
]

export function App() {
  return (
    <div class="app">
      {users.map(user => <User {...user} key={user.name}/>)}
    </div>
  );
}

export default App;
```

The spread operator `{...user}` encapsulates all the keys/props of each user object. Alternatively, we could have passed the props individually like so:
```js
{ users.map( user => <User name={user.name} image={user.image} /> ) }
``` 

## Define Stateful Components
This allows us to tap into the component life cycle events and we can also use it to store some internal state. Our `App.js` now looks this way:
```js
import { h, Component } from 'preact';
import User from './User'

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true
    }
  }

  componentDidMount() {
    fetch(this.props.config.urls.user)
      .then(resp => resp.json())
      .then(user => {
        setTimeout(() => {
          this.setState({
            user,
            loading: false
          });
        }, 2000)
      })
      .catch(err => console.error(err));
    })
  }

  render() {
    return (
      <div class="app">
        { this.state.loading 
          ? <p>Getting your info..</p> 
          : <User name={this.state.user.name} 
                  image={this.state.user.avatar_url} /> 
        }
      </div>
    );
  }
}

export default App;
```

We get the component's props from the `index.js` file config function and we pass props from this component to the `User` component inside the render method.

## Passing State and Props in Component render() Function
Instead of always calling `this.state` like in React, in Preact, the render method can take `props` and `state` as arguments and eliminate the need for `this.state` in the render() function. The `App.js` render method is then:
```js
render({config}, {loading, user}) {
  return (
    <div class="app">
      { loading 
        ? <p>Getting {config.urls.user}</p> 
        : <User name={user.name} 
                image={user.avatar_url} /> 
      }
    </div>
  );
}
```
In the code above, we only get what we need from the state as an object, `{loading, user}` and from the props too as, `{config}`.
