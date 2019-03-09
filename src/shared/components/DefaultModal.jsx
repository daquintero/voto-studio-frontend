import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Modal } from 'reactstrap';


class PermissionsModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
  };

  render() {
    // State
    const {
      isOpen,
    } = this.props;

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={this.toggle}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
            <h4 className="bold-text  modal__title">Test</h4>
          </div>
          <div className="modal__body">
            Test
          </div>
          <ButtonToolbar className="modal__footer">
            <Button onClick={this.toggle}>Add</Button>{' '}
            <Button onClick={this.toggle}>Cancel</Button>
          </ButtonToolbar>
        </Modal>
      </div>
    );
  }
}

export default PermissionsModal;
