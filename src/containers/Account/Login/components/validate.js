import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
// TODO UNDERSTAND WHY NOT WORKING

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = t("Email field shouldn't be empty");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = t('Invalid email address');
  }
  if (!values.password) {
    errors.password = t("Password field shouldn't be empty");
  }
  return errors;
};

export default validate;
