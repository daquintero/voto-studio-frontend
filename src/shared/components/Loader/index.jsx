import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ elemClass }) => (
  <div className={elemClass}>
    <div className="load__icon-wrap">
      <div className={`load__icon ${elemClass} lds-ellipsis`}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);

Loader.propTypes = {
  elemClass: PropTypes.string.isRequired,
};

export default Loader;
