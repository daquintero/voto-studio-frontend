import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Container, Col, Row, Card, CardBody, ButtonToolbar, Button, Input, FormGroup, Table } from 'reactstrap';
import { buildForm, getRelatedFields } from '../../../../redux/actions/workshopActions';
import Loader from '../../../../shared/components/Loader';

class Editor extends Component {
  static propTypes = {
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { appName, modelName, id } = match.params;
    dispatch(buildForm(appName, modelName, id));
  }

  onChange = (e) => {
    e.persist();
    const values = e.target.selectedOptions[0].value.split('.');
    this.props.dispatch(getRelatedFields(values[0], values[1].toLowerCase()));
  };

  handleUpdateRelatedField = (instance, index) => {
    console.log(instance, index);
  };

  render() {
    const { workshop, reset } = this.props;
    const { form } = workshop;
    const { loading, loaded, error } = workshop.actions.BUILD_FORM;
    return (
      <Container className="mt-4">
        {loading ? (
          <Loader elemClass="load__card mb-3" />
        ) : (
          <>
            {loaded ? (
              <>
                <Row>
                  <Col md={12}>
                    <h3 className="page-title text-capitalize">
                      {form.new ? 'Create' : 'Edit'} {form.parent_model.name}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <form className="form form--horizontal" onSubmit={this.handleSubmit}>
                          {Object.keys(form.basic_fields).map(f => (
                            <div className="form__form-group" key={f}>
                              <span className="form__form-group-label text-capitalize">{f.replace(/_/g, ' ')}</span>
                              <div className="form__form-group-field">
                                <Field
                                  name={f}
                                  component="input"
                                  type={form.basic_fields[f].type}
                                  placeholder="My new data set"
                                />
                              </div>
                            </div>
                          ))}
                          <ButtonToolbar className="form__button-toolbar">
                            <Button color="primary" type="submit">Submit</Button>
                            <Button type="button" onClick={reset}>
                              Cancel
                            </Button>
                          </ButtonToolbar>
                        </form>
                        {Object.keys(form.related_fields)
                          .map(f => Boolean(form.related_fields[f].related_instances.length) && (
                          <div key={f}>
                            <h3 className="page-title text-capitalize">{f.replace(/_/g, ' ')}</h3>
                            <Table responsive hover>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Description</th>
                                  <th>User</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {form.related_fields[f].related_instances.map((o, index) => (
                                  <tr key={o.table_values.id}>
                                    <td>{o.table_values.id}</td>
                                    <td>{o.table_values.descriptor}</td>
                                    <td>
                                      {o.table_values.user_email === JSON.parse(localStorage.getItem('user')).email ? (
                                        <a href="/">You</a>
                                      ) : (
                                        <a href="/">{o.table_values.user_email}</a>
                                      )}
                                    </td>
                                    <td>
                                      <a
                                        href="/"
                                        className="text-danger"
                                        onClick={() => this.handleUpdateRelatedField(o, index)}
                                      >
                                        <i className="fal fa-fw fa-minus-circle" /> Remove
                                      </a>
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                            </Table>
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card>
                      <CardBody>
                        <h3 className="page-title text-capitalize">Add Related Fields</h3>
                        <h3 className="page-subhead subhead">
                          Search for and add any related content.
                        </h3>
                        <FormGroup>
                          <Input
                            type="select"
                            name="transitionEasing"
                            id="transitionEasing"
                            onChange={e => this.onChange(e)}
                            value={this.state.transitionEasing}
                          >
                            {Object.keys(form.related_fields).map(f => (
                              <option
                                key={f}
                                className="text-capitalize"
                                value={form.related_fields[f].model_label}
                              >
                                {f.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                        <Table responsive hover>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Description</th>
                              <th>User</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.relatedFieldOptions && form.relatedFieldOptions.map(o => (
                              <tr>
                                <td>{o.id}</td>
                                <td>{o.table_values.descriptor}</td>
                                <td>
                                  {o.table_values.user_email === JSON.parse(localStorage.getItem('user')).email ? (
                                    <a href="/">You</a>
                                  ) : (
                                    <a href="/">{o.table_values.user_email}</a>
                                  )}
                                </td>
                                <td><a href="/"><i className="fal fa-fw fa-plus" />Add</a></td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                {error && (
                  <>
                    Error
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    );
  }
}

const EditorWithForm = reduxForm({
  form: 'workshop_form',
})(Editor);

export default withRouter(connect(state => ({
  workshop: state.studio.workshop,
  initialValues: state.studio.workshop.form.default_values,
}))(EditorWithForm));
