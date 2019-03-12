// Absolute Imports
import React, { Component } from 'react';
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

// Actions
import { getLocationPickerDataSet } from '../../../../../redux/actions/workshopActions';
import { GET_LOCATION_PICKER_DATA_SET } from '../../../../../redux/actionCreators/workshopActionCreators';


class LocationPickerModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    locationIdName: PropTypes.string.isRequired,
    locationId: PropTypes.string.isRequired,

    // Callbacks
    toggle: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,

    // Redux
    action: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSet: {},
      currentLocationIdName: props.locationIdName,
    };
  }

  componentDidMount() {
    const { locationIdName, dispatch } = this.props;

    dispatch(getLocationPickerDataSet({
      locationIdName,
    }))
      .then((action) => {
        if (this.unmounted) return;
        if (action.type === GET_LOCATION_PICKER_DATA_SET.SUCCESS) {
          this.setState({
            dataSet: action.response.dataSet,
          });
        }
      });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handleOnOpened = () => {
    const { currentLocationIdName } = this.state;
    const { locationIdName, dispatch } = this.props;

    if (locationIdName !== currentLocationIdName) {
      // Get new data set
      dispatch(getLocationPickerDataSet({
        locationIdName,
      }))
        .then((action) => {
          if (action.type === GET_LOCATION_PICKER_DATA_SET.SUCCESS) {
            this.setState({
              dataSet: action.response.dataSet,
              currentLocationIdName: locationIdName,
            });
          }
        });
    }
  };

  render() {
    // State
    const {
      dataSet,
    } = this.state;

    // Props
    const {
      isOpen, action, toggle, onClick, onChange, onCancel, locationIdName, locationId,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="lg"
        onOpened={this.handleOnOpened}
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
          <h3 className="page-title">Select Position</h3>
          <h3 className="page-subhead subhead">
            Scroll to zoom. Hold <code>CTRL</code> to pan. Click to select a region.
          </h3>
        </div>
        <div className="modal__body">
          {action.loaded ? (
            <LocationPickerMap
              dataSet={dataSet}
              onClick={onClick}
              locationIdName={locationIdName}
              locationId={locationId}
            />
          ) : (
            <Loader elemClass="load__card" />
          )}
          <h3 className="page-title my-2">Selected: {locationId}</h3>
        </div>
        <ButtonToolbar className="modal__footer">
          <Button
            color="success"
            onClick={onChange}
          >
            Save position
          </Button>
          <Button onClick={onCancel}>Cancel</Button>{' '}
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
