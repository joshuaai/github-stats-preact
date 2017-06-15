import { h, Component } from 'preact';
import linkState from 'linkstate';

export class Form extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    console.log(this.state.text);
  }

  render(props, { text = '' }) {
    return (
      <div>
        <form onSubmit={this.submit} action="javascript:" >
          <input type="text" value={text} 
                 onInput={ linkState(this, 'text') } />
        </form>
        <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre>
      </div>
    )
  }
}

export default Form;