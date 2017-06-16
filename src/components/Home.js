import { h } from 'preact';
import { withRouter } from 'react-router-dom';

function search(router, query) {
  //encode the query so it is a valid URL
  router.history.push(`/profile/${encodeURIComponent(query)}`);
}

//const Home is the result of calling a higher order component with our component
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