import React, { Component } from 'react';
import { Card, CardBody, Col, Badge, Table } from 'reactstrap';
import { ToursProps } from '../../../../../shared/prop-types/ReducerProps';

class MapDataPanel extends Component {
  static propTypes = {
    tours: ToursProps.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      // There should be a refresh button in the top right as another user may upload a new
      // data set whilst one user is waiting and they shouldn't have to refresh the whole page.
      // Potential use case for django channels... collaborative Voto Map Studio?!?!?!?
      <Col md={12} lg={12} xl={6}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Map Data Sets</h5>
              <h5 className="subhead">Here are the data sets that can be used in the Map Studio</h5>
            </div>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Username</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.props.tours.mapData.sets.map(set => (
                  <tr key={set.id}>
                    <td>{this.props.tours.mapData.idCode}{set.id}</td>
                    <td>{set.name}</td>
                    <td>{set.size}</td>
                    <td>@dragon</td>
                    <td><Badge color="success">Live</Badge></td>
                    <td>
                      <i
                        className="fal fa-pen tours-panel__edit"
                        role="presentation"
                        // onClick={() => this.props.editTour(tour.id)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </Table>
            <span
              className="tours-panel__new"
              role="presentation"
              // onClick={this.props.toggleCreateTourForm}
            >
              <i className="fal fa-cloud-upload mr-2" />
              Upload new data set
            </span>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default MapDataPanel;
