import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input,
} from 'reactstrap';
import { ToursProps } from '../../../shared/prop-types/ReducerProps';

class NewTourModal extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    toggleModal: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.tours.newTourModal} toggle={this.props.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.props.toggleModal}>Modal title</ModalHeader>
          <ModalBody>
            <div>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>Tour name</InputGroupText>
                </InputGroupAddon>
                <Input />
              </InputGroup>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggleModal}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default NewTourModal;
