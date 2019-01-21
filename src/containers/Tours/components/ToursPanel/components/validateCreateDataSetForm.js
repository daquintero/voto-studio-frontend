const validateCreateDataSetForm = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name field shouldn't be empty";
  }
  if (!values.description) {
    errors.description = "Description field shouldn't be empty";
  }
  if (!values.data) {
    errors.data = 'Please upload a file or select "build from scratch"';
  }
  if (values.data && !values.data.name.split('.').pop().match(/^(json|geojson)$/)) {
    errors.data = 'Please upload either a .json or .geojson file';
  }
  return errors;
};

export default validateCreateDataSetForm;
