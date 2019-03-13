// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import Select from 'react-select';

// Components
import LocationPickerModal from './components/LocationPickerModal';


class LocationPicker extends Component {
  static propTypes = {
    // Form
    value: PropTypes.instanceOf(Object),
    // initial: PropTypes.instanceOf(Object),

    // Callbacks
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // Form
    value: {},
    // initial: {},
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

  handleOnChange = ({ value }, name) => {
    const { value: { locationIdName, locationId } } = this.state;
    const { onChange } = this.props;

    let changeData;
    if (name === 'locationIdName') {
      changeData = {
        locationId,
        locationIdName: value,
      };
    } else if (name === 'locationId') {
      changeData = {
        locationIdName,
        locationId: value,
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

  customStyles = {
    control: base => ({
      ...base,
      height: 40,
      minHeight: 40,
      borderColor: '#dce1e9',
      borderRadius: 0,
      width: 130,
    }),
    placeholder: provided => ({
      ...provided,
      color: 'rgba(140, 140, 140, 1)',
    }),
    option: provided => ({
      ...provided,
      borderRadius: 0,

    }),
    menu: provided => ({
      ...provided,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: provided => ({
      ...provided,
      padding: 0,
    }),
  };

  render() {
    // State
    const {
      isOpen,
    } = this.state;

    // Props
    const {
      value: { locationIdNameOption, locationIdName, locationId },
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
              value={locationIdName === 'national' ? 'National' : locationId}
              onChange={e => this.handleOnChange(e.target, 'locationId')}
              disabled={locationIdName === 'national'}
              placeholder={locationIdName === 'national' ? 'National' : ''}
            />
            <Select
              styles={this.customStyles}
              name="locationIdName"
              onChange={selected => this.handleOnChange(selected, 'locationIdName')}
              className="ml-3"
              defaultValue={locationIdNameOption}
              options={[
                { label: 'National', value: 'national' },
                { label: 'Circuito', value: 'circuito' },
                { label: 'District', value: 'district' },
              ]}
            />
            <Button
              className="ml-3 mb-0"
              style={{ width: '50%' }}
              onClick={this.handleToggle}
              disabled={locationIdName === 'national'}
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
