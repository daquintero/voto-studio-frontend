import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavLink } from 'reactstrap';

const TourStepControls = props => (
  <div className="tour-step-controls__wrapper">
    <Nav>
      <NavLink className="tour-step__control" onClick={props.toggleCollapse}>
        {props.collapse ? (
          <span><i className="fal fa-angle-up mr-2" />Less</span>
        ) : (
          <span><i className="fal fa-angle-down mr-2" />More</span>
        )}
      </NavLink>
      {props.updatingTourStep ? (
        <NavLink
          className="tour-step__control"
          onClick={() => props.toggleUpdateTourStep(true)}
        >
          <span><i className="fal fa-check mr-2" />Save</span>
        </NavLink>
      ) : (
        <NavLink
          className="tour-step__control"
          onClick={() => props.toggleUpdateTourStep(false)}
        >
          <span><i className="fal fa-pen mr-2" />Edit</span>
        </NavLink>
      )}
      <NavLink
        className="tour-step__control"
        onClick={() => props.deleteTourStep(props.deleteTourStepId)}
      >
        <span><i className="fal fa-trash-alt mr-2" />Delete</span>
      </NavLink>
    </Nav>
  </div>
);

TourStepControls.propTypes = {
  collapse: PropTypes.bool.isRequired,
  toggleCollapse: PropTypes.func.isRequired,
  deleteTourStep: PropTypes.func.isRequired,
  deleteTourStepId: PropTypes.number.isRequired,
  updatingTourStep: PropTypes.bool.isRequired,
  toggleUpdateTourStep: PropTypes.func.isRequired,
};

export default TourStepControls;
