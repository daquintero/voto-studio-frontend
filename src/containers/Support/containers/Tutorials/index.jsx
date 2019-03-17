import React from 'react';
import { Container, Card, CardBody, Row, Col } from 'reactstrap';


const Tutorials = () => (
  <Container className="mt-5">
    <Row>
      <Col className="tutorials__sidebar" xl={2}>
        <ul>
          <li>Introduction</li>
        </ul>
      </Col>
      <Col className="tutorials__content" xl={10}>
        <Card className="tutorials__content__card">
          <CardBody>
            Hi2
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Tutorials;
