import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Badge, Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ToursProps } from '../../../../../shared/prop-types/ReducerProps';

class ToursList extends Component {
  static propTypes = {
    tours: ToursProps.isRequired,
    editTour: PropTypes.func.isRequired,
    toggleCreateTourForm: PropTypes.func.isRequired,
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
      <Col md={12} lg={12} xl={6}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Your Tours</h5>
              <h5 className="subhead">Here are the tours you have created</h5>
            </div>
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
                {this.props.tours.tours.map(tour => (
                  <tr key={tour.id}>
                    <td>T{tour.id}</td>
                    <td>{tour.name}</td>
                    <td>{tour.steps.length}</td>
                    <td>@dragon</td>
                    <td><Badge color="success">Live</Badge></td>
                    <td>
                      <i
                        className="fal fa-pen tours-panel__edit"
                        role="presentation"
                        onClick={() => this.props.editTour(tour.id)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </Table>
            {!this.props.tours.newTourModal ? (
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
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ToursList;
