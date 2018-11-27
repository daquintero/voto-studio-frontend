import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Loader = ({ elemType }) => {
  // Give the parent div the correct css based on its type. This is needed as
  // the positioning of the loader is different if it is in a card than if it were
  // in the map for example.
  const classes = classNames({
    load: elemType === 'page',
    load__card: elemType === 'card',
    load__map: elemType === 'map',
    load__panel: elemType === 'panel',
    load__step: elemType === 'step',
  });
  return (
    <div className={classes}>
      <div className="load__icon-wrap">
        <svg className="load__icon">
          <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
        </svg>
      </div>
    </div>
  );
};

Loader.propTypes = {
  elemType: PropTypes.string.isRequired,
};

export default Loader;
