// Absolute Imports
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar, Modal } from 'reactstrap';

// Components
import LocationPicker from '../../LocationPicker';

class LocationPickerModal extends PureComponent {
  static defaultProps = {
    title: '',
    message: '',
    colored: false,
    header: false,
  };

  constructor() {
    super();
    this.state = {
      modal: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        size="lg"
      >
        <div id="tooltip" style={{ position: 'absolute', zIndex: 9999, 'pointer-events': 'none' }} />
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
          <h3 className="page-title">Select Position</h3>
          <h3 className="page-subhead subhead">
            Scroll to zoom. Hold <code>CTRL</code> to pan. Click to select a region.
          </h3>
        </div>
        <div className="modal__body">
          <LocationPicker />
        </div>
        <ButtonToolbar className="modal__footer">
          <Button color="success" onClick={this.toggle}>Ok</Button>
          <Button onClick={this.toggle}>Cancel</Button>{' '}
        </ButtonToolbar>
      </Modal>
    );
  }
}

export default LocationPickerModal;
