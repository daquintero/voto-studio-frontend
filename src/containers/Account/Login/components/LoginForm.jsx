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

class LoginForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    errorMessage: '',
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
    };
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

  render() {
    const { handleSubmit } = this.props;

    return (
      <>
        {this.props.errorMessage && (
          <h4 className="form__invalid-login mb-2">{this.props.errorMessage}</h4>
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
                component="input"
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
                component="input"
                type={this.state.showPassword ? 'text' : 'password'}
                placeholder="Password"
              />
            </div>
            <div className="account__forgot-password">
              <a href="/">Forgot a password?</a>
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
          <Button className="btn btn-primary account__btn account__btn--small" type="submit">Sign In</Button>
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
})(LoginForm);

export default withRouter(connect(state => ({
  errorMessage: state.auth.error,
}))(reduxFormLogin));