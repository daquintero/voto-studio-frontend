import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import RegisterForm from './components/RegisterForm';

const viLogo = `${process.env.PUBLIC_URL}/img/vi-logo.svg`;

const Register = () => (
  <div className="account">
    <div className="account__wrapper">
      <div className="account__card">
        <div className="account__head">
          <Container>
            <Row noGutters>
              <Col xs={12}>
                <a href="http://www.votoinformado2019.com">
                  <img className="rounded mx-auto enlarge" src={viLogo} alt="Error" />
                </a>
                <h2 className="p-2">Voto Studio</h2>
              </Col>
            </Row>
          </Container>
        </div>
        <h4 className="p-2">Solicita una cuenta.</h4>
        <RegisterForm />
        <div className="account__have-account">
          <p>Already have an account? <Link to="/account/login">Login</Link></p>
        </div>
      </div>
    </div>
  </div>
);

export default Register;
