import React from 'react';
import { Container, Row } from 'reactstrap';
import DropFiles from './components/DropFiles';

const FormDropzone = () => (
  <Container>
    <Row>
      <DropFiles />
    </Row>
  </Container>
);

export default FormDropzone;
