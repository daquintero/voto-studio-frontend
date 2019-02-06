import React from 'react';
import { Field } from 'redux-form';
import EditorFieldComponent from './EditorFieldComponent';

const EditorField = props => <Field {...props} component={EditorFieldComponent} />;

export default EditorField;
