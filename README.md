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

## Use Link State to Automatically Handle State Changes
When building components that contain forms, we can use the components internal state to track the value of those form fields. The component, and not  the DOM, then becomes the source of truth always for the input data.

Typically in React, we will write this like so in `Form.js`:
```js
import { h, Component } from 'preact';
import linkState from 'limkstate';

export class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    this.setText = this.setState.bind(this);
    this.submit = this.submit.bind(this);
  }

  setText(e) {
    this.setState({
      text: e.target.value
    })
  }

  submit() {
    console.log(this.state.text);
  }

  render(props, { text = ''}) {
    return (
      <div>
        <form onSubmit={this.submit} action="javascript:" >
          <input type="text" value={this.state.text} 
                 onInput={ linkState(this, 'text') } />
        </form>
        <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
      </div>
    )
  }
}
```

However, the `Link` state in Preact allows us eliminate a lot of the code above, by passing props and state to the render method.
* We de-structure the state by creating a empty `text` attribute in it.
* We install the Preact `linkstate` package with `yarn add linkstate` and import `linkState` in our component.
* In the `onInput` method, we pass the component, `this` and the state property we want, `text` to the linkState() method.
Dependencies the allow this work can be installed as:
```bash
yarn add --dev babel-preset-es2015 babel-preset-stage-0
```
Then to the `webpack.config.js`, add the presets to the babel-loader:
```js
options: {
  presets: ['env', 'es2015', 'stage-0'],
  ...
}
```

## React App to Preact
This will reduce the size of the app. If using `create-react-app`, run:
```bash
yarn run eject
```
This creates a config directory with the Webpack configuration.
```bash
yarn add preact preact-compat
```
In the `webpack.config.dev.js` and `webpack.config.prod.js` files in the `config` folder, find the `alias` key under `resolve` and add:
```js
'react': 'preact-compat',
'react-dom': 'preact-compat'
```
The above causes Webpack to use Preact as the alias for react and react-dom wherever they are imported. This reduces the generated bundle file size by just over 70%. The removed code is basically the react library and its dependencies.

## Simple Routing with Preact Router
```bash
yarn add preact-router
```
The components look this way with `preact-router`:

*App.js*
```js
import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Home from './Home'; 
import Profile from './Profile';

export class App extends Component {
  render() {
    return (
      <div class="app">
        <Router>
          <Home path="/" />
          <Profile path="/profile/:user" />
        </Router>
      </div>
    );
  }
}

export default App;
```

*Home.js*
```js
import { h } from 'preact';
import { route } from 'preact-router';

function search(query) {
  if (query !== "") {
    //encode the query so it is a valid URL
    route(`/profile/${encodeURIComponent(query)}`);
  }
}

export default function Home() {
  return (
    <section>
      <p>Enter a Github Username</p>
      <input type="search"
             placeholder="eg: joshuaai"
             onSearch={ e => search(e.target.value) } 
      />
    </section>
  )
}
```

*Profile.js*
```js
import { h, Component } from 'preact';
import User from './User';

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true
    }
  }

  componentDidMount() {
    fetch(`https://api.github.com/users/${this.props.user}`)
      .then( resp => resp.json() )
      .then( user => {
        this.setState({
          user,
          loading: false
        });
      })
      .catch( err => console.error(err) );
  }

  render( {}, {loading, user} ) {
    return (
      <div class="app">
        { loading 
          ? <p>Fetching...</p>
          : <User image={user.avatar_url}
                  name={user.name} />
        }
      </div>
    )
  }
}

export default Profile;
```

In handling unmatched routes, we can add an `Error.js` component:
```js
import { h } from 'preact';

export default function Error() {
  return (
    <div>
      <p>Error!</p>
      <p><a href="/">Home</a></p>
    </div>
  )
}
```
and set it as the default in the `App` component like so: 
```js
<ErrorComponent default />
```
This will render the `Error` component for every unmatched route.

## Routing with React Router
```bash
yarn add preact-compat react-router-dom
```
Add the alias in the `webpack.config.js` file, above the `devtool` key:
```js
resolve: {
  alias: {
    'react': 'preact-compat',
    'react-dom': 'preact-compat'
  }
}
```
The components are changed as follows:

*App.js*
```js
import { h, Component } from 'preact';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home'; 
import Profile from './Profile';
import ErrorComponent from './Error';

export class App extends Component {
  render() {
    return (
      <div class="app">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile/:user" component={Profile} />
            <Route component={ErrorComponent} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
```

*Home.js*
```js
import { h } from 'preact';
import { withRouter } from 'react-router-dom';

function search(router, query) {
  //encode the query so it is a valid URL
  router.history.push(`/profile/${encodeURIComponent(query)}`);
}

//const Home is the result of calling a higher order component with our component, The HOC gives us access to the router.
const Home = withRouter((router) => {
  return (
    <section>
      <p>Enter a Github Username</p>
      <input type="search"
             placeholder="eg: joshuaai"
             onSearch={ e => search(router, e.target.value) } 
      />
    </section>
  );
});

export default Home;
```

*Profile.js*
```js
componentDidMount() {
  const username = this.props.match.params.user;

  fetch(`https://api.github.com/users/${username}`)
    .then( resp => resp.json() )
    .then( user => {
      this.setState({
        user,
        loading: false
      });
    })
    .catch( err => console.error(err) );
}
```

*Error.js*:
```js
import { h } from 'preact';
import { Link } from 'react-router-dom';

export default function Error() {
  return (
    <div>
      <p>Error!</p>
      <p><Link to="/">Home</Link></p>
    </div>
  )
}
```
