/* eslint-disable react/no-children-prop */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const renderTextField = ({
  input, label, meta: { touched, error }, children,
}) => (
  <TextField
    className="material-form__field"
    label={label}
    error={touched && error}
    {...input}
    children={children}
  />
);

renderTextField.propTypes = {
  input: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  select: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
};

renderTextField.defaultProps = {
  meta: null,
  select: false,
  children: [],
};

class ProfileSettings extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit, reset } = this.props;
    return (
      <form className="material-form" onSubmit={handleSubmit}>
        <div>
          <span className="material-form__label">Name</span>
          <Field
            name="name"
            component={renderTextField}
            placeholder="Name"
          />
        </div>
        <div>
          <span className="material-form__label">Email</span>
          <Field
            name="email"
            component={renderTextField}
            placeholder="example@mail.com"
            type="email"
          />
        </div>
        <div>
          <span className="material-form__label">Bio</span>
          <Field
            name="bio"
            component={renderTextField}
            placeholder="Type message here"
            multiline
            rowsMax="4"
          />
        </div>
        <ButtonToolbar className="form__button-toolbar">
          <Button color="primary" type="submit">Update profile</Button>
          <Button type="button" onClick={reset}>
            Cancel
          </Button>
        </ButtonToolbar>
      </form>
    );
  }
}

const ProfileSettingsWithForm = reduxForm({
  form: 'profile_settings_form', // a unique identifier for this form
})(ProfileSettings);

export default connect(state => ({
  reduxForm: state.form,
  initialValues: state.auth.user,
}))(ProfileSettingsWithForm);
