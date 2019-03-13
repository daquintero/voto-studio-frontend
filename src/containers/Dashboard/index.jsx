/* eslint-disable */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Row, Card, CardBody } from 'reactstrap';

import { withTranslation } from 'react-i18next';


class Dashboard extends PureComponent {
  getColDims = () => ({
    xs: 12, sm: 12, md: 3, lg: 3, xl: 3,
  });

  render() {
    const { t } = this.props;
    return (
      <Container className="mt-4">
        <Row>
          <Col>
            <h3 className="page-title">Dashboard</h3>
            <h3 className="page-subhead subhead m-0">
              {t('Contribuye a que todos tengan un Voto Informado aquí.')}
            </h3>
            <h3 className="page-subhead subhead">
              {t('Todo contenido publicado es revisado por Praxis contra los Fake News.')}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col {...this.getColDims()}>
            <Link to="/workshop" className="dashboard__icon">
              <Card>
                <CardBody className="text-center">
                  <i className="fal fa-6x fa-wrench mb-3" />
                  <h3>{t('Workshop')}</h3>
                  <p>{t('Propose information here')}</p>
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
                  <h3 className="m-0">{t('Tours')}</h3>
                  <p><i className="fal fa-toolbox p-2" />{t('In Construction')}</p>
                </CardBody>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withTranslation()(Dashboard);
