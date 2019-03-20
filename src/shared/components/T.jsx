// Absolute Imports
import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';


const T = ({ t, children }) => (
  <p>{t(children)}</p>
);


T.propTypes = {
  children: PropTypes.node.isRequired,

  // Translations
  t: PropTypes.func.isRequired,
};

export default withTranslation()(T);
