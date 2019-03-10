/* eslint-disable */
// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

// Components
import LocationPickerModal from './components/LocationPickerModal';


class LocationPicker extends Component {
  static propTypes = {
    // Form
    value: PropTypes.instanceOf(Object),

    // Callbacks
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // Form
    value: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      value: {
        locationIdName: '',
        locationId: '',
      },
    };
  }

  handleToggle = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  handleOnChange = (e) => {
    const { value: { locationIdName, locationId } }  = this.state;
    const { onChange } = this.props;

    e.persist();

    let changeData;
    if (e.target.name === 'locationIdName') {
      changeData = {
        locationId,
        locationIdName: e.target.value,
      };
    } else if (e.target.name === 'locationId') {
      changeData = {
        locationIdName,
        locationId: e.target.value,
      };
    }

    this.setState({
      value: changeData,
    }, onChange(changeData));
  };

  handleOnSave = () => {
    const { value: { locationIdName, locationId } } = this.state;
    const { onChange } = this.props;

    onChange({
      locationIdName,
      locationId,
    });
  };

  handleOnCancel = () => {
    this.handleToggle();
  };

  render() {
    // State
    const {
      isOpen,
    } = this.state;

    // Props
    const {
      value: { locationIdName, locationId },
    } = this.props;

    return (
      <>
        <LocationPickerModal
          isOpen={isOpen}
          locationIdName={locationIdName}
          locationId={locationId}

          // Callbacks
          toggle={this.handleToggle}
          onChange={this.handleOnChange}
          onCancel={this.handleOnCancel}
        />
        <div className="form__form-group">
          <span className="form__form-group-label text-capitalize">{locationIdName}</span>
          <div className="form__form-group-field">
            <input
              name="locationId"
              value={locationId}
              onChange={this.handleOnChange}
              disabled={locationIdName === 'national'}
              placeholder={locationIdName === 'national' ? 'National' : ''}
            />
            <select
              name="locationIdName"
              value={locationIdName}
              onChange={this.handleOnChange}
            >
              <option value="national">National</option>
              <option value="circuito">Circuito</option>
              <option value="district">District</option>
            </select>
            <Button
              className="ml-3 mb-0"
              onClick={this.handleToggle}
            >
              Select location
            </Button>
          </div>
        </div>
      </>
    );
  }
}


const renderLocationPickerField = props => (
  <LocationPicker
    {...props.input}
  />
);

export default renderLocationPickerField;
