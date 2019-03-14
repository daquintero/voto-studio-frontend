/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class FileInputField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    accept: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string,
      }),
      PropTypes.string,
    ]),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    accept: null,
  };

  render() {
    const {
      onChange, name, value, accept, t,
    } = this.props;

    return (
      <div className="form__form-group-file">
        <label htmlFor={name}>{t('Choose the file')}</label>
        <span>{value.name}</span>
        <input
          accept={accept}
          type="file"
          name={name}
          id={name}
          onChange={
            (e) => {
              e.preventDefault();
              // convert files to an array
              const files = [...e.target.files];
              onChange({ file: files[0], name: files[0].name });
            }
          }
        />
      </div>
    );
  }
}

export default withTranslation()(FileInputField);
