import { h } from 'preact';
import User from './User'

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
      {users.map(user => <User {...user} key={user.name} />)}
    </div>
  );
}

export default App;