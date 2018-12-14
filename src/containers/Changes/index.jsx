import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Container, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import ChangesList from './components/ChangesList';
import { getChangeList, commitChange } from '../../redux/actions/changesActions';

class Changes extends PureComponent { // eslint-disable-line
  static propTypes = {
    changes: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(getChangeList());
  }

  handleCommitChanges = (e) => {
    e.preventDefault();
    this.props.dispatch(commitChange(e.target.dataset.selected));
  };

  render() {
    const { changes } = this.props;
    return (
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            <h3 className="page-title">Changes Panel</h3>
            <h3 className="page-subhead subhead">
              This is where you can view and commit changes
            </h3>
            <Card>
              <CardBody>
                <ChangesList action={changes.actions.LIST_CHANGES} commitChanges={this.handleCommitChanges} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(state => ({
  changes: state.studio.changes,
}))(Changes);
