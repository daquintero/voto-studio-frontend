import React from 'react';
import PropTypes from 'prop-types';
import SelectField from './SelectField';

const renderSelectField = props => (
  <div className="form__form-group-input-wrap">
    <SelectField
      {...props.input}
      options={props.options}
      placeholder={props.placeholder}
    />
    {props.meta.touched && props.meta.error && <span className="form__form-group-error">{props.meta.error}</span>}
  </div>
);

renderSelectField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  placeholder: PropTypes.string,
};

renderSelectField.defaultProps = {
  meta: null,
  options: [],
  placeholder: '',
};

export default renderSelectField;
