// Absolute Imports
import React, { Component } from 'react';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Components
import Gallery from './components/Gallery';


class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ButtonToolbar>
          <Button color="success" size="sm">Upload</Button>
        </ButtonToolbar>
        <Gallery />
      </div>
    );
  }
}

export default Images;
