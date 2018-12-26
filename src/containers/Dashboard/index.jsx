import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Container, Col, Row } from 'reactstrap';

class Dashboard extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Dashboard</h3>
            <h3 className="page-subhead subhead">
              This is where you can control the data that is viewable by the users of VotoInformado
            </h3>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
