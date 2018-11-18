import PropTypes from 'prop-types';

const {
  string, shape,
} = PropTypes;

export const SidebarProps = shape({
  show: PropTypes.bool,
  collapse: PropTypes.bool,
});

export const ThemeProps = shape({
  className: string,
});

export const MapProps = shape({
  viewport: PropTypes.object,
});

export const ToursProps = shape({
  tours: PropTypes.array,
  newTourModal: PropTypes.bool,
});

export const TourProps = shape({
  id: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  zoom: PropTypes.number,
  transitionDuration: PropTypes.number,
  transitionEasing: PropTypes.func,
});
