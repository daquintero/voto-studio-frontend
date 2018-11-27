import React, { Component } from 'react';
import { Badge, Table } from 'reactstrap';
import { ToursProps } from '../../../../../shared/prop-types/ReducerProps';
import asyncLoading from '../../../../../shared/components/asyncLoading';

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
      // Potential use case for django channels... collaborative Voto Studio?!?!?!?
      <>
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
            {this.props.tours.mapDataList.sets.map(set => (
              <tr key={set.id}>
                <td>{this.props.tours.mapDataList.idCode}{set.id}</td>
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
      </>
    );
  }
}

export default asyncLoading('card')(MapDataPanel);
