import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Col, Row, Table, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { listItems } from '../../redux/actions/workshopActions';

class Workshop extends Component {
  static propTypes = {
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(listItems());
  }

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
                    <div className="workshop__button-panel__button" key={item.model_name}>
                      <p className="text-capitalize">
                        <i className="fal fa-plus" /> {item.verbose_name}
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
                <div key={item.model_label} className="mb-5">
                  <h3 className="page-title--not-last text-capitalize mb-2 d-inline">
                    {item.verbose_name_plural}
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
                        <tr key={o.table_values.id} className="table-row__no-pointer">
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
                            <Link
                              to={this.buildUrl(item.app_label, item.model_name, o.table_values.id)}
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
