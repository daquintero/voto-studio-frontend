const validateCreateTourForm = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name field shouldn't be empty";
  }
  if (!values.description) {
    errors.description = "Description field shouldn't be empty";
  }
  return errors;
};

export default validateCreateTourForm;
