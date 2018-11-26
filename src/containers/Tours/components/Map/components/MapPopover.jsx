import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ToursProps } from '../../../../../shared/prop-types/ReducerProps';
import asyncLoading from '../../../../../shared/components/asyncLoading';

const MapPopover = (props) => {
  const activeTourStep = props.openTour.steps.filter(step => step.id === props.activeTourStepId)[0];
  const getAdjacentStep = (dir) => {
    const [...steps] = props.openTour.steps;
    const currentIndex = steps.indexOf(steps.filter(step => step.id === props.activeTourStepId)[0]);
    if (currentIndex >= steps.length - 1 && dir === 1) {
      return steps[0];
    }
    if (currentIndex === 0 && dir === -1) {
      return steps[steps.length - 1];
    }
    return steps[currentIndex + dir];
  };
  return (
    <>
      {props.activeTourStepId !== -1 &&
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
              <PaginationLink
                previous
                onClick={() => props.changeToStepViewport(getAdjacentStep(-1).id)}
              />
            </PaginationItem>
            {props.openTour.steps.map((tourStep, index) => (
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
              <PaginationLink
                next
                onClick={() => props.changeToStepViewport(getAdjacentStep(1).id)}
              />
            </PaginationItem>
          </Pagination>
        </Row>
      </div>
      }
    </>
  );
};

MapPopover.propTypes = {
  activeTourStepId: PropTypes.number.isRequired,
  openTour: ToursProps.isRequired,
  changeToStepViewport: PropTypes.func.isRequired,
};

export default asyncLoading(true)(MapPopover);
