import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import renderCheckBoxField from '../../../shared/components/form/CheckBox';
import { loginUser } from '../../../redux/actions/userActions';

class LogInForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
    };
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  submit = (values) => {
    this.props.dispatch(loginUser(values.email, values.password, this.props.history));
  };

  render() {
    const { handleSubmit } = this.props;

    return (
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
            <button
              className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
              onClick={e => this.showPassword(e)}
            ><EyeIcon />
            </button>
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
        <Link className="btn btn-outline-primary account__btn account__btn--small" to="/accounts/signup">
          Create Account
        </Link>
      </form>
    );
  }
}

const reduxFormLogIn = reduxForm({
  form: 'log_in_form',
})(LogInForm);

export default withRouter(connect(state => ({
  errorMessage: state.auth.error,
}))(reduxFormLogIn));
