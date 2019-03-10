// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  Modal,
} from 'reactstrap';

// Components
import LocationPickerMap from './LocationPickerMap';
import Loader from '../../../../../shared/components/Loader';


class LocationPickerModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,

    // Callbacks
    toggle: PropTypes.func.isRequired,

    // Redux
    action: PropTypes.instanceOf(Object).isRequired,
    dataSet: PropTypes.instanceOf(Object).isRequired,
  };

  handleOnClick = () => {};

  handleSavePosition = () => {};

  handleCancel = () => {};

  render() {
    // Props
    const {
      isOpen, dataSet, action, toggle,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="lg"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
          <h3 className="page-title">Select Position</h3>
          <h3 className="page-subhead subhead">
            Scroll to zoom. Hold <code>CTRL</code> to pan. Click to select a region.
          </h3>
        </div>
        <div className="modal__body">
          {action.loaded ? (
            <LocationPickerMap
              dataSet={dataSet}
              onClick={this.handleOnClick}
              selectedObject={selectedObject}
            />
          ) : (
            <Loader elemClass="load__card" />
          )}
          <h3 className="page-title my-2">Selected: {selectedObject.properties[locationPicker.locationIdName]}</h3>
        </div>
        <ButtonToolbar className="modal__footer">
          <Button
            color="success"
            onClick={this.handleSavePosition}
            disabled={selectedObject.properties[locationPicker.locationIdName] === null}
          >
            Save position
          </Button>
          <Button onClick={this.handleCancel}>Cancel</Button>{' '}
        </ButtonToolbar>
      </Modal>
    );
  }
}


const mapStateToProps = (state) => {
  const { workshop } = state.studio;

  return {
    action: workshop.actions.GET_LOCATION_PICKER_DATA_SET,
  };
};

export default connect(mapStateToProps)(LocationPickerModal);
