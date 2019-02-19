// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  ButtonToolbar,
  Modal,
} from 'reactstrap';

// Actions
import { getLocationPickerDataSet } from '../../../../../../redux/actions/workshopActions';
import {
  TOGGLE_LOCATION_PICKER,
  SELECT_POSITION,
} from '../../../../../../redux/actionCreators/workshopActionCreators';

// Components
import Map from './components/Map';
import Loader from '../../../../../../shared/components/Loader';


class LocationPicker extends Component {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getLocationPickerDataSet());
  }

  toggle = () => {
    this.props.dispatch({
      type: TOGGLE_LOCATION_PICKER,
    });
  };

  handleOnClick = (e) => {
    this.props.dispatch({
      type: SELECT_POSITION,
      selectedObject: e.object,
    });
  };

  handleSavePosition = () => {
    this.toggle();
  };

  handleCancel = () => {
    this.toggle();
  };

  render() {
    // Props
    const {
      workshop,
    } = this.props;

    // Workshop
    const {
      locationPicker,
    } = workshop;
    const {
      selectedObject,
    } = locationPicker;

    return (
      <Modal
        isOpen={locationPicker.open}
        toggle={this.toggle}
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
          {workshop.actions.GET_LOCATION_PICKER_DATA_SET.loaded ? (
            <Map
              dataSet={locationPicker.dataSet}
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

export default connect(state => ({
  workshop: state.studio.workshop,
}))(LocationPicker);
