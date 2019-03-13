// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import { connect } from 'react-redux';

// Actions
import { changeMapHeight, changeMapViewport, changeMapWidth } from '../../../../../redux/actions/mapActions';


class LocationPickerMap extends Component {
  static propTypes = {
    locationIdName: PropTypes.string,
    locationId: PropTypes.string,

    // Redux
    map: PropTypes.instanceOf(Object).isRequired,

    // Callbacks
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    locationIdName: '',
    locationId: '',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }


  componentDidMount() {
    window.addEventListener('resize', this.resizeViewport);
    this.resizeViewport();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeViewport);
  }

  getProperty = (obj, property) => {
    let ret;
    ret = obj[property];
    if (ret === undefined) {
      ret = obj[property.toUpperCase()];
    }

    return ret;
  };

  handleChangeMapHeight = (newMapHeight) => {
    const { dispatch } = this.props;
    dispatch(changeMapHeight(newMapHeight));
  };

  handleChangeMapWidth = (newMapWidth) => {
    const { dispatch } = this.props;
    dispatch(changeMapWidth(newMapWidth));
  };

  handleChangeMapViewport = (newMapViewport) => {
    const { dispatch } = this.props;
    dispatch(changeMapViewport(newMapViewport));
  };

  handleOnHover = ({
    object, x, y, lngLat, index,
  }) => {
    if (object && index !== -1) {
      this.setState({
        hoveredObject: object,
        hover: true,
        x,
        y,
        lngLat,
      });
    } else {
      this.setState({
        hover: false,
      });
    }
  };

  handleGetFillColor = (polygonObject, colorRange) => {
    const { hover, hoveredObject } = this.state;
    const { locationIdName, locationId } = this.props;

    const selectedLocationId = locationId;
    const polygonLocationId = this.getProperty(polygonObject.properties, locationIdName);

    if (polygonLocationId === selectedLocationId) {
      return [255, 255, 255];
    }

    if (polygonObject && hoveredObject) {
      const hoveredLocationId = this.getProperty(hoveredObject.properties, locationIdName);

      return ((polygonLocationId === hoveredLocationId) && hover) ? [215, 215, 215] : colorRange[0];
    }

    return colorRange[0];
  };

  handleGetCursor = () => {
    const { hover } = this.state;

    return hover ? 'pointer' : 'move';
  };

  resizeViewport = () => {
    this.handleChangeMapWidth('100%');
    this.handleChangeMapHeight('40vh');
  };

  renderLayers = () => {
    const {
      handleOnHover, handleGetFillColor,
    } = this;

    const {
      onClick,
    } = this.props;

    const lightSettings = {
      lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.2,
      lightsStrength: [0.8, 0.0, 0.8, 0.0],
      numberOfLights: 2,
    };

    const colorRange = [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78],
    ];

    return new GeoJsonLayer({
      id: 'regions',
      data: this.props.dataSet.geojson,
      lightSettings,
      colorRange,
      opacity: 2,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getLineColor: [0, 0, 0],
      getFillColor: f => handleGetFillColor(f, colorRange),
      updateTriggers: {
        getFillColor: f => handleGetFillColor(f, colorRange),
      },
      pickable: true,
      onHover: e => handleOnHover(e),
      onClick: e => onClick(e),
      transitions: {
        getFillColor: {
          duration: 10,
        },
        getElevation: {
          duration: 500,
        },
      },
    });
  };

  renderTooltip = () => {
    const {
      hoveredObject, x, y, lngLat, hover,
    } = this.state;
    const {
      locationIdName,
    } = this.props;

    return (hoveredObject && hover) && (
      <div
        className="workshop__location-picker__tooltip__wrapper shadow"
        style={{
          position: 'absolute', zIndex: 1, pointerEvents: 'none', left: x, top: y - 80,
        }}
      >
        <p>{locationIdName}: {this.getProperty(hoveredObject.properties, locationIdName)}</p>
        <p>{lngLat[0]} {lngLat[1]}</p>
      </div>
    );
  };

  render() {
    // Props
    const {
      map,
    } = this.props;

    return (
      <ReactMapGL
        {...map.viewport}
        onViewportChange={this.handleChangeMapViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
        mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
      >
        <DeckGL
          {...map.viewport}
          layers={this.renderLayers()}
          getCursor={this.handleGetCursor}
        >
          {this.renderTooltip()}
        </DeckGL>
      </ReactMapGL>
    );
  }
}

export default connect(state => ({
  map: state.map,
}))(LocationPickerMap);
