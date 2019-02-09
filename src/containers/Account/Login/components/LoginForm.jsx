import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import renderCheckBoxField from '../../../../shared/components/form/CheckBox';
import { loginUser } from '../../../../redux/actions/userActions';
import validate from './validate';


class LoginForm extends PureComponent {
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

  constructor() {
    super();
    this.state = {};
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };

  submit = (values) => {
    this.props.dispatch(loginUser(values, this.props.history));
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
    const loginUserAction = auth.actions.LOGIN_USER;
    return (
      <>
        {loginUserAction.error && (
          <div className="mb-3">
            {Object.keys(loginUserAction.error.response.data).map(k => (
              <p className="text-danger" key={k}>
                <span className="text-capitalize">{k}</span>: {loginUserAction.error.response.data[k]}
              </p>
            ))}
          </div>
        )}
        <form className="form" onSubmit={handleSubmit(this.submit)}>
          <div className="form__form-group">
            <span className="form__form-group-label">Email</span>
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <AccountOutlineIcon />
              </div>
              <Field
                name="email"
                component={this.renderField}
                type="email"
                placeholder="mail@example.com"
              />
            </div>
          </div>
          <div className="form__form-group">
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
            <div className="account__forgot-password">
              <a href="/">Forgot password?</a>
            </div>
          </div>
          <div className="form__form-group">
            <div className="form__form-group-field">
              <Field
                name="remember_me"
                component={renderCheckBoxField}
                label="Remember me"
              />
            </div>
          </div>
          <Button className="btn btn-primary account__btn text-white" type="submit">
            {!loginUserAction.loading ? (
              <span>Login</span>
            ) : (
              <span><i className="fal fa-spinner fa-spin" /> Logging in...</span>
            )}
          </Button>
          <Link className="btn btn-outline-primary account__btn account__btn--small" to="/account/signup">
            Create Account
          </Link>
        </form>
      </>
    );
  }
}

const reduxFormLogin = reduxForm({
  form: 'login_form',
  validate,
})(LoginForm);

export default withRouter(connect(state => ({
  auth: state.auth,
}))(reduxFormLogin));
