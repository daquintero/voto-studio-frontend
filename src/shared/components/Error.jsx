import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ error }) => (
  <div className="error__wrapper text-center">
    <i className="fal fa-10x fa-poo-storm mb-5" />
    <h1>{error.message}</h1>
  </div>
);

Error.propTypes = {
  error: PropTypes.instanceOf(Object).isRequired,
};

export default Error;
