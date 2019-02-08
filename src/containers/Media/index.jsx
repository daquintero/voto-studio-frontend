// Absolute Imports
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Container,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

// Components
import Images from './components/Images';


class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
    };
  }

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    return (
      <Container className="mt-3" style={{ overflow: 'hidden' }}>
        <Card>
          <CardBody>
            <div className="tabs tabs--bordered-bottom">
              <div className="tabs__wrap">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: this.state.activeTab === '1' })}
                      onClick={() => {
                        this.toggle('1');
                      }}
                    >
                      Images
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: this.state.activeTab === '2' })}
                      onClick={() => {
                        this.toggle('2');
                      }}
                    >
                      Videos
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: this.state.activeTab === '3' })}
                      onClick={() => {
                        this.toggle('3');
                      }}
                    >
                      Resources
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <Images />
                  </TabPane>
                  <TabPane tabId="2">
                    <p>Videos</p>
                  </TabPane>
                  <TabPane tabId="3">
                    <p>Resources</p>
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default Media;
