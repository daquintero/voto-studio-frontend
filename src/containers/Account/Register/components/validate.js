const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Name field shouldn’t be empty';
  }
  if (!values.email) {
    errors.email = 'Email field shouldn’t be empty';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Password field shouldn’t be empty';
  }
  if (!values.passwordRepeat) {
    errors.passwordRepeat = 'Please repeat your password';
  }
  if (values.passwordRepeat && values.password !== values.passwordRepeat) {
    errors.password = 'Both passwords must match';
  }
  return errors;
};

export default validate;
