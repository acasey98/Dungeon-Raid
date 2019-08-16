import React from 'react';
import {
  Link,
} from 'react-router-dom';

class youWin extends React.Component {
  render() {
    return (
    <div className="youWin">
      <h1>YOU WIN!!!</h1>
      <p> If you'd like to make a new character and try again, click</p>
        <h2>
          <Link to={'/base'}>
            HERE
          </Link>
        </h2>
    </div>
    );
  }
}

export default youWin;
