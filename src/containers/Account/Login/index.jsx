import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import LoginForm from './components/LoginForm';

const viLogo = `${process.env.PUBLIC_URL}/img/vi-logo.svg`;


const Login = () => (
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
        <LoginForm />
      </div>
    </div>
  </div>
);

export default Login;

// if you want to add select, date-picker and time-picker in your app you need to uncomment the first
// four lines in /scss/components/form.scss to add styles
