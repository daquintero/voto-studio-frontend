import { FlyToInterpolator, LinearInterpolator } from 'deck.gl';
import * as d3 from 'd3';

export default (step) => { // eslint-disable-line
  const newStep = step;
  switch (step.viewport.transitionInterpolatorName) {
    case 'FlyToInterpolator':
      newStep.viewport.transitionInterpolator = new FlyToInterpolator();
      break;
    case 'LinearInterpolator':
      newStep.viewport.transitionInterpolator = new LinearInterpolator();
      break;
    default:
      newStep.viewport.transitionInterpolator = null;
  }
  switch (step.viewport.transitionEasingName) {
    case 'd3.easeCubic':
      newStep.viewport.transitionEasing = d3.easeCubic;
      break;
    default:
      newStep.viewport.transitionEasing = null;
  }
  return newStep;
};
