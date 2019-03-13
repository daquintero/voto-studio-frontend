// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { withTranslation } from 'react-i18next';

// Components
import FileExplorer from './components/FileExplorer';

// Actions
import { SELECT_TAB } from '../../redux/actionCreators/mediaActionCreators';


class Media extends Component {
  static propTypes = {
    // Redux
    dispatch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'media.Image',
    };
  }

  toggle = (tab) => {
    const { dispatch } = this.props;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
      dispatch({
        type: SELECT_TAB,
        activeTab: tab,
      });
    }
  };

  render() {
    const { t } = this.props;

    // State
    const {
      activeTab,
    } = this.state;

    return (
      <Container className="mt-3" style={{ overflow: 'hidden' }}>
        <Card>
          <CardBody>
            <div className="tabs tabs--bordered-bottom">
              <div className="tabs__wrap">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: activeTab === 'media.Image' })}
                      onClick={() => {
                        this.toggle('media.Image');
                      }}
                    >
                      {t('Images')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: activeTab === 'media.Video' })}
                      onClick={() => {
                        this.toggle('media.Video');
                      }}
                    >
                      {t('Videos')}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: activeTab === 'media.Resource' })}
                      onClick={() => {
                        this.toggle('media.Resource');
                      }}
                    >
                      {t('Resources')}
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="media.Image">
                    {activeTab === 'media.Image' && <FileExplorer modelLabel={activeTab} />}
                  </TabPane>
                  <TabPane tabId="media.Video">
                    {activeTab === 'media.Video' && <FileExplorer modelLabel={activeTab} />}
                  </TabPane>
                  <TabPane tabId="media.Resource">
                    {activeTab === 'media.Resource' && <FileExplorer modelLabel={activeTab} />}
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

export default connect()(withTranslation()(Media));
