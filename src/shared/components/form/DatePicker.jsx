import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DatePickerField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className="date-picker">
        <DatePicker
          dropdownMode=""
          className="form__form-group-datepicker"
          selected={moment(this.props.value) || null}
          onChange={this.props.onChange}
          dateFormat="DD/MM/YYYY"
        />
      </div>
    );
  }
}

const renderDatePickerField = props => (
  <DatePickerField
    {...props.input}
  />
);

renderDatePickerField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
};

export default renderDatePickerField;
