import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import asyncLoading from '../../../../../shared/components/asyncLoading';

class ToursList extends Component {
  static propTypes = {
    tourList: PropTypes.instanceOf(Array).isRequired,
    toursIdCode: PropTypes.string.isRequired, // This really isn't needed tbh
    openTour: PropTypes.func.isRequired,
    toggleCreateTourForm: PropTypes.func.isRequired,
    createTourForm: PropTypes.bool.isRequired,
    createTour: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
    };
  }
  onChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <>
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>No. Steps</th>
              <th>Username</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.tourList.map((tour, index) => (
              <tr key={tour.id}>
                <td>{this.props.toursIdCode}{tour.id}</td>
                <td>{tour.name}</td>
                <td>{tour.step_count}</td>
                <td>@dragon</td>
                <td><Badge color="success">Live</Badge></td>
                <td>
                  <i
                    className="fal fa-pen tours-panel__edit"
                    role="presentation"
                    onClick={() => this.props.openTour(tour.id, index)}
                  />
                </td>
              </tr>
                ))}
          </tbody>
        </Table>
        {!this.props.createTourForm ? (
          <span
            className="tours-panel__new"
            role="presentation"
            onClick={this.props.toggleCreateTourForm}
          >
            <i className="fal fa-plus mr-2" />
                  Add new tour
          </span>
        ) : (
          <Form>
            <FormGroup>
              <Label for="newTourName">Name</Label>
              <Input
                type="text"
                name="name"
                id="newTourName"
                placeholder="My new tour"
                onChange={this.onChange}
                value={this.state.name}
              />
            </FormGroup>
            <FormGroup>
              <Label for="newTourDescription">Description (Optional)</Label>
              <Input
                type="textarea"
                name="description"
                id="newTourDescription"
                placeholder="This tour is about..."
                onChange={this.onChange}
                value={this.state.description}
              />
            </FormGroup>
            <Button color="primary" onClick={() => this.props.createTour(this.state)}>Create</Button>
            <Button onClick={this.props.toggleCreateTourForm}>Cancel</Button>
          </Form>
        )}
      </>
    );
  }
}

export default asyncLoading(true)(ToursList);
