import React from 'react';
import { Container, Card, CardBody, Row, Col } from 'reactstrap';


const Tutorials = () => (
  <Container className="mt-5">
    <Row>
      <Col className="tutorials__sidebar" xl={2}>
        <ul>
          <li><a href="#introduction">Introduction</a></li>
        </ul>
      </Col>
      <Col className="tutorials__content" xl={10}>
        <Card className="tutorials__content__card">
          <CardBody>
            <div id="introduction">
              Hi
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Tutorials;
