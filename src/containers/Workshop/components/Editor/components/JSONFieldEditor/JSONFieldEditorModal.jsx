// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'reactstrap';

// Components
import ControlledEditor from '../../../../../../shared/components/form/TextEditor/ControlledEditor';


class PermissionsModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    field: PropTypes.instanceOf(Object).isRequired,
    onSave: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    };
  }

  handleOnChange = (e, name) => {
    try {
      e.persist();
      this.setState(prevState => ({
        fields: [
          ...prevState.fields.filter(f => f.name !== e.target.name),
          { name: e.target.name, value: e.target.value.toString() },
        ],
      }));
    } catch (err) {
      this.setState(prevState => ({
        fields: [
          ...prevState.fields.filter(f => f.name !== name),
          { name, value: e },
        ],
      }));
    }
  };

  render() {
    // Props
    const {
      isOpen, toggle, field, onSave,
    } = this.props;

    return (
      <div>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          onClosed={this.handleOnClosed}
          size="xl"
        >
          <div className="modal__header">
            <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
            <h4 className="bold-text  modal__title">Edit</h4>
          </div>
          <div className="modal__body">
            <form className="form form--horizontal">
              {field.schema.fields.map(input => !input.readOnly && (
                <div className="form__form-group">
                  <span className="form__form-group-label text-capitalize">{input.name}</span>
                  {input.type !== 'textarea' ? (
                    <div className="form__form-group-field">
                      <input
                        name={input.name}
                        type={input.type}
                        onChange={this.handleOnChange}
                        value={this.state[input.name]}
                      />
                    </div>
                  ) : (
                    <div className="form__form-group-field-editor">
                      <div className="text-editor w-100">
                        <ControlledEditor
                          name={input.name}
                          placeholder="<p>Test</p>"
                          onChange={obj => this.handleOnChange(obj, input.name)}
                          value={this.state[input.name]}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </form>
            <Button onClick={() => onSave(this.state.fields)}>Save</Button>
            <Button onClick={toggle}>Cancel</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(PermissionsModal);
