import React from 'react';
import PropTypes from 'prop-types';

const Loader = ({ elemClass }) => (
  <div className={elemClass}>
    <div className="load__icon-wrap">
      <svg className={`load__icon ${elemClass}`}>
        <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
      </svg>
    </div>
  </div>
);

Loader.propTypes = {
  elemClass: PropTypes.string.isRequired,
};

export default Loader;
