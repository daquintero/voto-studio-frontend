/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';

import CheckBoxField from './CheckBoxField';

const renderCheckBoxField = props => (
  <CheckBoxField
    {...props.input}
    label={props.label}
    defaultChecked={props.defaultChecked}
    disabled={props.disabled}
    className={props.className}
    color={props.color}
  />
);

renderCheckBoxField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
  label: PropTypes.string,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
};

renderCheckBoxField.defaultProps = {
  label: '',
  defaultChecked: false,
  disabled: false,
  className: '',
  color: '',
};

export default renderCheckBoxField;
