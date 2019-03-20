// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Components
import ControlledEditor from '../../../../../../shared/components/form/TextEditor/ControlledEditor';


class PermissionsModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    fields: PropTypes.instanceOf(Array).isRequired,
    subInstance: PropTypes.instanceOf(Object),
    onSave: PropTypes.func.isRequired,
    newInstance: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    subInstance: {
      id: null,
      fields: [],
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    };
  }

  handleOnOpened = () => {
    const { subInstance, newInstance } = this.props;
    if (newInstance) {
      this.setState({
        ...Object.keys(this.state).reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
        fields: [],
      });
    } else {
      this.setState({
        ...subInstance.fields.reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {}),
        fields: subInstance.fields,
      });
    }
  };

  handleOnChange = (e, name) => {
    try {
      e.persist();
      this.setState(prevState => ({
        [e.target.name]: e.target.value,
        fields: [
          ...prevState.fields.filter(f => f.name !== e.target.name),
          { name: e.target.name, value: e.target.value.toString() },
        ],
      }));
    } catch (err) {
      this.setState(prevState => ({
        [name]: e,
        fields: [
          ...prevState.fields.filter(f => f.name !== name),
          { name, value: e },
        ],
      }));
    }
  };

  renderField = (field, newInstance = null) => {
    const { t } = this.props;
    const {
      name, type, readOnly, options,
    } = field;

    if (readOnly) return null;
    switch (type) {
      case 'text':
        return (
          <div key={name} className="form__form-group">
            <span className="form__form-group-label text-capitalize">{t(name)}</span>
            <div className="form__form-group-field">
              <input
                name={name}
                type={type}
                onChange={this.handleOnChange}
                value={t(this.state[name]) || ''}
              />
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div key={name} className="form__form-group">
            <span className="form__form-group-label text-capitalize">{t(name)}</span>
            <div className="form__form-group-field-editor">
              <div className="text-editor w-100">
                <ControlledEditor
                  name={name}
                  onChange={obj => this.handleOnChange(obj, name)}
                  value={t(this.state[name])}
                  initial={newInstance ? undefined : t(this.state[name])}
                />
              </div>
            </div>
          </div>
        );
      case 'select':
        return (
          <div key={name} className="form__form-group">
            <span className="form__form-group-label text-capitalize">{t(name)}</span>
            <div className="form__form-group-field">
              <select
                className="form__form-group-select"
                name={name}
                onChange={this.handleOnChange}
                value={t(this.state[name]) || ''}
              >
                {options.map(({ label, value }) => (
                  <option value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    // Props
    const {
      isOpen, toggle, fields, onSave, newInstance, t,
    } = this.props;

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          onClosed={this.handleOnClosed}
          size="xl"
          onOpened={this.handleOnOpened}
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
            <h4 className="bold-text  modal__title">{t('Edit')}</h4>
          </div>
          <div className="modal__body">
            <form className="form form--horizontal">
              {fields.map(field => this.renderField(field, newInstance))}
            </form>
            <Button onClick={() => onSave(this.state)}>{t('Save')}</Button>
            <Button onClick={toggle}>{t('Cancel')}</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(withTranslation()(PermissionsModal));
