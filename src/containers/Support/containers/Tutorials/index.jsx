// Absolute Imports
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Card, CardBody, Row, Col, Table } from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Components
import T from '../../../../shared/components/T';


const Tutorials = ({ t }) => (
  <Container className="mt-5">
    <Row>
      <Col className="tutorials__sidebar offset-1" xl={2}>
        <ul>
          <li><a href="#introduction">{t('Introduction')}</a></li>
          <li><a href="#getting-started">{t('Getting Started')}</a></li>
        </ul>
      </Col>
      <Col className="tutorials__content" xl={6}>
        <Card className="tutorials__content__card">
          <CardBody>
            {/* Introduction */}
            <div id="introduction" className="tutorials__content__wrapper">
              <h3>
                {t('Introduction')}
              </h3>
              <h3 className="page-subhead subhead">
                {t('What is VotoStudio?')}.
              </h3>
              <T>
                VotoStudio is a tool that can be used to document and present your political research to a wide audience
                all over the world.
              </T>
            </div>

            {/* Getting Started */}
            <div id="getting-started" className="tutorials__content__wrapper">
              <h3>
                {t('Getting Started')}
              </h3>
              <h3 className="page-subhead subhead">
                {t('How to start producing content?')}.
              </h3>
              <T>
                VotoStudio comes with a set of predefined content types, these are listed below
              </T>
              <Table className="mt-5">
                <thead>
                  <td><T>Name</T></td>
                  <td><T>Type</T></td>
                  <td><T>Description</T></td>
                  <td><T>Example</T></td>
                </thead>
                <tbody>
                  <tr>
                    <td><T>Informative Snippet</T></td>
                    <td><T>News/Event</T></td>
                    <td>
                      <T>
                        An Informative Snippet can be thought of as a standalone piece of content that informs people.
                        It can be written in the style of a news article or blog post.
                      </T>
                    </td>
                    <td><a href="/"><T>Example</T></a></td>
                  </tr>
                  <tr>
                    <td><T>Corruption Case</T></td>
                    <td><T>News/Event</T></td>
                    <td>
                      <T>
                        An Informative Snippet can be thought of as a standalone piece of content that informs people.
                        It can be written in the style of a news article or blog post.
                      </T>
                    </td>
                    <td><a href="/"><T>Example</T></a></td>
                  </tr>
                  <tr>
                    <td><T>Financial Item</T></td>
                    <td><T>News/Event</T></td>
                    <td>
                      <T>
                        An Informative Snippet can be thought of as a standalone piece of content that informs people.
                        It can be written in the style of a news article or blog post.
                      </T>
                    </td>
                    <td><a href="/"><T>Example</T></a></td>
                  </tr>
                  <tr>
                    <td><hr /></td>
                    <td><hr /></td>
                    <td><hr /></td>
                    <td><hr /></td>
                  </tr>
                  <tr>
                    <td><T>Individual</T></td>
                    <td><T>Information</T></td>
                    <td>
                      <T>
                        An Informative Snippet can be thought of as a standalone piece of content that informs people.
                        It can be written in the style of a news article or blog post.
                      </T>
                    </td>
                    <td><a href="/"><T>Example</T></a></td>
                  </tr>
                  <tr>
                    <td><T>Organization</T></td>
                    <td><T>Information</T></td>
                    <td>
                      <T>
                        An Informative Snippet can be thought of as a standalone piece of content that informs people.
                        It can be written in the style of a news article or blog post.
                      </T>
                    </td>
                    <td><a href="/"><T>Example</T></a></td>
                  </tr>
                  <tr>
                    <td><T>Organization</T></td>
                    <td><T>Information</T></td>
                    <td>
                      <T>
                        An Informative Snippet can be thought of as a standalone piece of content that informs people.
                        It can be written in the style of a news article or blog post.
                      </T>
                    </td>
                    <td><a href="/"><T>Example</T></a></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

Tutorials.propTypes = {
  // Translations
  t: PropTypes.func.isRequired,
};

export default withTranslation()(Tutorials);
