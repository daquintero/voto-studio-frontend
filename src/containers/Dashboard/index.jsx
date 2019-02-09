import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Row, Card, CardBody } from 'reactstrap';

class Dashboard extends PureComponent {
  getColDims = () => ({
    xs: 12, sm: 12, md: 4, lg: 3, xl: 2,
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
            <Card>
              <CardBody className="text-center">
                <Link to="/workshop">
                  <i className="fal fa-6x fa-wrench mb-3" />
                  <h3>Workshop</h3>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col {...this.getColDims()}>
            <Card>
              <CardBody className="text-center">
                <Link to="/media">
                  <i className="fal fa-6x fa-image mb-3" />
                  <h3>Media</h3>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col {...this.getColDims()}>
            <Card>
              <CardBody className="text-center">
                <Link to="/tours">
                  <i className="fal fa-6x fa-map mb-3" />
                  <h3>Tours</h3>
                </Link>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
