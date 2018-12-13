import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, ButtonToolbar, Button } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
// import CheckIcon from 'mdi-react/CheckIcon';
import { updateFeatureProperties } from '../../../../../redux/actions/dataSuiteActions';
import asyncLoading from '../../../../../shared/components/asyncLoading';
import JsonEditor from './JsonEditor';

class Editor extends Component {
  static propTypes = {
    form: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    dataSuite: PropTypes.instanceOf(Object).isRequired,
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      jsonEditorOpen: false,
    };
  }

  handleToggleEditJsonEditor = (e) => {
    e.persist();
    const { dataSuite } = this.props;
    this.setState(prevState => ({
      jsonEditorOpen: !prevState.jsonEditorOpen,
      property: dataSuite.openDataSet.openFeature.properties[e.target.dataset.key],
      propertyKey: e.target.dataset.key,
    }));
  };

  handleSaveProperty = newFeature =>
    this.props.dispatch(updateFeatureProperties(newFeature, newFeature.properties));

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form, dataSuite } = this.props;
    const { openFeature } = dataSuite.openDataSet;
    dispatch(updateFeatureProperties(openFeature.id, form.openFeature.values));
  };

  render() {
    const { dataSuite, reset } = this.props;
    const { properties } = dataSuite.openDataSet.openFeature;
    return (
      <>
        <div className="data-suite__editor__wrapper">
          {dataSuite.openDataSet.openFeature.editing && (
            <Col xl={12}>
              <form className="form form--horizontal" onSubmit={this.handleSubmit}>
                {Object.keys(properties).map(key => (
                  <div key={key}>
                    {typeof properties[key] !== 'object' ? (
                      <div className="form__form-group">
                        <span className="form__form-group-label">{key}</span>
                        <div className="form__form-group-field">
                          <Field
                            name={key}
                            component="input"
                            type="text"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="form__form-group">
                        <span className="form__form-group-label">{key}</span>
                        <div className="form__form-group-field">
                          <Button
                            size="sm"
                            className="mt-3"
                            data-key={key}
                            onClick={this.handleToggleEditJsonEditor}
                          >
                            Edit nested data
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <ButtonToolbar className="form__button-toolbar">
                  <Button color="primary" type="submit">Save</Button>
                  <Button type="button" onClick={reset}>
                    Cancel
                  </Button>
                </ButtonToolbar>
              </form>
            </Col>
          )}
        </div>
        <JsonEditor
          isOpen={this.state.jsonEditorOpen}
          property={this.state.property}
          propertyKey={this.state.propertyKey}
          openFeature={dataSuite.openDataSet.openFeature}
          toggleJsonEditor={this.handleToggleEditJsonEditor}
          saveProperty={this.handleSaveProperty}
        />
      </>
    );
  }
}

const EditorWithConnect = connect(state => ({
  dataSuite: state.studio.dataSuite,
  form: state.form,
}))(Editor);

const EditorWithAsyncLoading = asyncLoading('load__card')(EditorWithConnect);

export default reduxForm({
  form: 'openFeature',
})(EditorWithAsyncLoading);
