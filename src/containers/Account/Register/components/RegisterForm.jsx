import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import MailRuIcon from 'mdi-react/MailRuIcon';
import UserIcon from 'mdi-react/UserIcon';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../../../redux/actions/userActions';


class RegisterForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    errorMessage: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    };

    this.showPassword = this.showPassword.bind(this);
  }

  showPassword(e) {
    e.preventDefault();
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  submit = (values) => {
    if (values.email && values.password === values.passwordRepeat) {
      this.props.dispatch(registerUser(values, this.props.history));
    } else {
      // Do something here to tell the user the passwords don't match
    }
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
            <span className="form__form-group-label">Name</span>
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <UserIcon />
              </div>
              <Field
                name="name"
                component="input"
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
                component="input"
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
          </div>
          <div className="form__form-group form__form-group--forgot">
            <div className="form__form-group-field">
              <div className="form__form-group-icon">
                <KeyVariantIcon />
              </div>
              <Field
                name="passwordRepeat"
                component="input"
                type={this.state.showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
              />
            </div>
          </div>
          <div className="account__btns">
            <Button className="btn btn-primary account__btn" type="submit">Sign Up</Button>
          </div>
        </form>
      </>
    );
  }
}

const reduxFormSignup = reduxForm({
  form: 'register_form', // a unique identifier for this form
})(RegisterForm);

export default withRouter(connect(state => ({
  errorMessage: state.auth.error,
}))(reduxFormSignup));
