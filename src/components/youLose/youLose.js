import React from 'react';
import {
  Link,
} from 'react-router-dom';

class youLose extends React.Component {
  render() {
    return (
    <div className="youLose">
      <h1>You Died!</h1>
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

export default youLose;
