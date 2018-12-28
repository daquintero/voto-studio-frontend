import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Container, Col, Row, Table, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { listItems } from '../../redux/actions/workshopActions';

class Workshop extends Component {
  static propTypes = {
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(listItems());
  }

  handleCreateItem = (e) => {
    e.persist();
    const [appLabel, modelName] = e.currentTarget.dataset.modellabel.split('.');
    this.props.history.push(`/workshop/editor/${appLabel}/${modelName}/new/`);
  };

  buildUrl = (appLabel, modelName, id) => `/workshop/editor/${appLabel}/${modelName}/${id}/`;

  render() {
    const { workshop } = this.props;
    const { items } = workshop;
    return (
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Workshop</h3>
            <h3 className="page-subhead subhead">
              Build the core informational content of VotoInformado
            </h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Card>
              <CardBody>
                <div className="workshop__button-panel__wrapper">
                  {items.map(item => (
                    <div
                      className="workshop__button-panel__button"
                      key={item.modelName}
                      role="presentation"
                      data-modellabel={item.modelLabel}
                      onClick={this.handleCreateItem}
                    >
                      <p className="text-capitalize">
                        <i className="fal fa-plus" /> {item.verboseName}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <CardBody>
                <h3 className="page-title">Content Items</h3>
                <h3 className="page-subhead subhead">
                  Here are all of the content items that you have created.
                </h3>
                {items.map(item => Boolean(item.count) && (
                <div key={item.modelLabel} className="mb-5">
                  <h3 className="page-title--not-last text-capitalize mb-2 d-inline">
                    {item.verboseNamePlural}
                  </h3>
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
                      {item.values && item.values.map(o => (
                        <tr key={o.tableValues.id} className="table-row__no-pointer">
                          <td>{o.tableValues.id}</td>
                          <td>{o.tableValues.descriptor}</td>
                          <td>
                            {o.tableValues.userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                              <a href="/">You</a>
                          ) : (
                            <a href="/">{o.tableValues.userEmail}</a>
                          )}
                          </td>
                          <td>
                            <Link
                              to={this.buildUrl(item.appLabel, item.modelName, o.tableValues.id)}
                            >
                              <i className="fal fa-fw fa-edit" /> Edit
                            </Link>
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
        </Row>
      </Container>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(Workshop);
