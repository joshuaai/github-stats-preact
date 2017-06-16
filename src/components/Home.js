import { h } from 'preact';
import { route } from 'preact-router';

function search(query) {
  //encode the query so it is a valid URL
  route(`/profile/${encodeURIComponent(query)}`);
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