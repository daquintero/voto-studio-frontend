import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import MailRuIcon from 'mdi-react/MailRuIcon';
import UserIcon from 'mdi-react/UserIcon';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../../../redux/actions/userActions';
import validate from './validate';


class RegisterForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    errorMessage: PropTypes.string,
    type: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),
  };

  static defaultProps = {
    errorMessage: '',
    type: 'text',
    meta: null,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }


  handleSubmit = (values) => {
    if (values.email && values.name && values.password && values.password === values.passwordRepeat) {
      this.props.dispatch(registerUser(values, this.props.history));
    }
  };

  renderField = ({
    input, placeholder, type, meta: { touched, error },
  }) => (
    <div className="form__form-group-input-wrap">
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
  );

  render() {
    const { handleSubmit, auth } = this.props;
    const registerUserAction = auth.actions.REGISTER_USER;
    return (
      <>
        {registerUserAction.error && (
          <div className="mb-3">
            {Object.keys(registerUserAction.error.response.data).map(k => (
              <p className="text-danger" key={k}>
                <span className="text-capitalize">{k}</span>: {registerUserAction.error.response.data[k]}
              </p>
            ))}
          </div>
        )}
        <form className="form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="form__form-group">
            <span className="form__form-group-label">Name</span>
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <UserIcon />
              </div>
              <Field
                name="name"
                component={this.renderField}
                type="text"
                placeholder="John Doe"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">E-mail</span>
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <MailRuIcon />
              </div>
              <Field
                name="email"
                component={this.renderField}
                type="email"
                placeholder="example@mail.com"
              />
            </div>
          </div>
          <div className="form__form-group form__form-group--forgot">
            <span className="form__form-group-label">Password</span>
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <KeyVariantIcon />
              </div>
              <Field
                name="password"
                component={this.renderField}
                type="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="form__form-group form__form-group--forgot">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <KeyVariantIcon />
              </div>
              <Field
                name="passwordRepeat"
                component={this.renderField}
                type="password"
                placeholder="Repeat password"
              />
            </div>
          </div>
          <div className="account__btns">
            <Button className="btn btn-primary account__btn text-white" type="submit">
              {!auth.actions.REGISTER_USER.loading ? (
                <span>Create account</span>
              ) : (
                <span><i className="fal fa-spinner fa-spin" /> Creating account...</span>
              )}
            </Button>
          </div>
        </form>
      </>
    );
  }
}

const reduxFormSignup = reduxForm({
  form: 'register_form', // a unique identifier for this form
  validate,
})(RegisterForm);

export default withRouter(connect(state => ({
  auth: state.auth,
}))(reduxFormSignup));
