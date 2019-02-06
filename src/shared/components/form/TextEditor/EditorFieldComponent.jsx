import React from 'react';
import PropTypes from 'prop-types';


import ControlledEditor from './ControlledEditor';

const EditorFieldComponent = (props) => {
  const {
    placeholder, input: { onChange, value }, meta: { initial },
  } = props;

  return (
    <ControlledEditor
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      initial={initial}
    />
  );
};

EditorFieldComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  input: PropTypes.instanceOf(Object).isRequired,
  meta: PropTypes.instanceOf(Object).isRequired,
};

export default EditorFieldComponent;
