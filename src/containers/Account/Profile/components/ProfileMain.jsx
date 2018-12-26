import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Button } from 'reactstrap';
import MessageTextOutlineIcon from 'mdi-react/MessageTextOutlineIcon';


const ProfileMain = ({ user }) => (
  <Col md={12} lg={12} xl={12}>
    <Card>
      <CardBody className="profile__card">
        <div className="profile__information">
          <div className="profile__avatar">
            <img src={`${process.env.REACT_APP_BASE_URL}${user.profile_picture_url}`} alt="avatar" />
          </div>
          <div className="profile__data">
            <p className="profile__name">{user.name}</p>
            <p className="profile__work">Developer</p>
            <p className="profile__contact">{user.email}</p>
            <p className="profile__contact">07714 308 384</p>
            <Button color="primary" className="icon profile__btn"><p><MessageTextOutlineIcon /> Message</p></Button>
          </div>
        </div>
        <div className="profile__stats">
          <div className="profile__stat">
            <p className="profile__stat-number">05</p>
            <p className="profile__stat-title">Projects</p>
          </div>
          <div className="profile__stat">
            <p className="profile__stat-number">24</p>
            <p className="profile__stat-title">Tasks</p>
          </div>
          <div className="profile__stat">
            <p className="profile__stat-number">12</p>
            <p className="profile__stat-title">Reports</p>
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
);

ProfileMain.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
};

export default ProfileMain;
