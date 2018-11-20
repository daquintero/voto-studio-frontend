import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ToursProps } from '../../../shared/prop-types/ReducerProps';

const MapPopover = (props) => {
  const activeTourStep = props.newTour.steps.filter(step => step.id === props.activeTourStepIndex)[0];
  return (
    <>
      {props.activeTourStepIndex !== -1 &&
      <div className="map-popover__wrapper">
        <Row>
          <Col>
            <h3>{activeTourStep.name}</h3>
            <p>{activeTourStep.text}</p>
            <hr />
          </Col>
        </Row>
        <Row>
          <Pagination className="map-popover__control" size="lg" aria-label="Page navigation example">
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            {props.newTour.steps.map((tourStep, index) => (
              <PaginationItem
                key={`pagination-item-${tourStep.id}`}
                active={tourStep.id === activeTourStep.id}
              >
                <PaginationLink
                  key={`pagination-link-${tourStep.id}`}
                  onClick={() => props.changeToStepViewport(tourStep.id)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
          </Pagination>
        </Row>
      </div>
      }
    </>
  );
};

MapPopover.propTypes = {
  activeTourStepIndex: PropTypes.number.isRequired,
  newTour: ToursProps.isRequired,
  changeToStepViewport: PropTypes.func.isRequired,
};

export default MapPopover;
