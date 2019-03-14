/* eslint-disable */
import React, { PureComponent } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class SelectField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ]).isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    placeholder: '',
    options: [],
  };

  handleChange = (selectedOption) => {
    this.props.onChange(selectedOption);
  };
  translateOptions = (options) => {
    const { t } = this.props;
    const translated = options.map(opt => ({'label': t(opt.label), 'value': opt.value}));
    return translated;
  };

  customStyles = {
    control: base => ({
      ...base,
      height: 40,
      minHeight: 40,
      borderColor: '#dce1e9',
      borderRadius: 0,
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
    const {
      value, name, placeholder, options, t,
    } = this.props;

    return (
      <Select
        styles={this.customStyles}
        name={name}
        value={value}
        onChange={this.handleChange}
        options={this.translateOptions(options)}
        clearable={false}
        className="form__form-group-select"
        placeholder={t(placeholder)}
      />
    );
  }
}

export default withTranslation()(SelectField);
