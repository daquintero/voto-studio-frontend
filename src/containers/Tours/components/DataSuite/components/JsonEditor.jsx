import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

class JsonEditor extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleJsonEditor: PropTypes.func.isRequired,
    property: PropTypes.instanceOf(Object).isRequired,
    propertyKey: PropTypes.string.isRequired,
    openFeature: PropTypes.instanceOf(Object).isRequired,
    saveProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { newFeature: {} };
  }

  handleOnChange = (e) => {
    console.log(e);
    const { openFeature } = this.props;
    const newFeature = {
      ...openFeature,
      properties: {
        ...openFeature.properties,
        [this.props.propertyKey]: e.jsObject,
      },
    };
    this.setState({ newFeature });
  };

  render() {
    const {
      isOpen, toggleJsonEditor, property, propertyKey, openFeature, saveProperty,
    } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggleJsonEditor} size="lg">
          <ModalHeader toggle={this.toggle}>
            Edit property <code>{propertyKey}</code> of feature with ID {openFeature && openFeature.id}
          </ModalHeader>
          <ModalBody>
            <JSONInput
              locale={locale}
              width="100%"
              placeholder={property}
              onChange={this.handleOnChange}
            />
          </ModalBody>
          <ModalFooter>
            {/* TODO: Is there a way to avoid using an arrow function here? */}
            <Button color="primary" onClick={() => saveProperty(this.state.newFeature)}>Save</Button>{' '}
            <Button color="secondary" onClick={toggleJsonEditor}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

    );
  }
}

export default JsonEditor;
