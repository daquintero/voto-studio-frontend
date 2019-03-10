// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

// Components
import LocationPickerModal from './components/LocationPickerModal';


class LocationPicker extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
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

  handleOnClick = () => {};

  handleOnSave = () => {
    const { value: { locationIdName, locationId } } = this.state;
    const { onChange } = this.props;

    onChange({
      locationIdName,
      locationId,
    });
  };

  handleCancel = () => {};

  render() {
    // State
    const {
      isOpen, value, value: { locationIdName, locationId },
    } = this.state;

    return (
      <>
        <LocationPickerModal
          isOpen={isOpen}
          dataSet={{}}
          value={value}

          // Callbacks
          toggle={this.handleToggle}
        />
        <div className="form__form-group">
          <span className="form__form-group-label text-capitalize">{locationIdName}</span>
          <div className="form__form-group-field">
            <Input
              name="locationId"
              value={locationId}
            />
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
