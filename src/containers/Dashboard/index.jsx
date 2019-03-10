import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Row, Card, CardBody } from 'reactstrap';

class Dashboard extends PureComponent {
  getColDims = () => ({
    xs: 12, sm: 12, md: 3, lg: 3, xl: 3,
  });

  render() {
    return (
      <Container className="mt-4">
        <Row>
          <Col>
            <h3 className="page-title">Dashboard</h3>
            <h3 className="page-subhead subhead">
              This is where you can control the data that is viewable by the users of VotoInformado
            </h3>
          </Col>
        </Row>
        <Row>
          <Col {...this.getColDims()}>
            <Link to="/workshop" className="dashboard__icon">
              <Card>
                <CardBody className="text-center">
                  <i className="fal fa-6x fa-wrench mb-3" />
                  <h3>Workshop</h3>
                </CardBody>
              </Card>
            </Link>
          </Col>
          <Col {...this.getColDims()}>
            <Link to="/media" className="dashboard__icon">
              <Card>
                <CardBody className="text-center">
                  <i className="fal fa-6x fa-image mb-3" />
                  <h3>Media</h3>
                </CardBody>
              </Card>
            </Link>
          </Col>
          <Col {...this.getColDims()}>
            <Link to="/tours" className="dashboard__icon">
              <Card>
                <CardBody className="text-center">
                  <i className="fal fa-6x fa-map mb-3" />
                  <h3>Tours</h3>
                </CardBody>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
