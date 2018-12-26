import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import ProfileMain from './components/ProfileMain';
import ProfileTabs from './components/ProfileTabs';

class Index extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(Object).isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { user } = this.props;
    return (
      <Container className="mt-4">
        <div className="profile">
          <Row>
            <Col md={12} lg={12} xl={4}>
              <Row>
                <ProfileMain user={user} />
              </Row>
            </Col>
            <ProfileTabs />
          </Row>
        </div>
      </Container>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
}))(Index);
