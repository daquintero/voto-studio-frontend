import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import { connect } from 'react-redux';
import { MapProps } from '../../../../../../../shared/prop-types/ReducerProps';
import { changeMapHeight, changeMapViewport, changeMapWidth } from '../../../../../../../redux/actions/mapActions';

class Map extends Component {
  static propTypes = {
    // Redux
    dataSet: PropTypes.instanceOf(Object).isRequired,
    map: MapProps.isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Props
    selectedObject: PropTypes.instanceOf(Object).isRequired,

    // Callbacks
    onClick: PropTypes.func.isRequired,
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

  handleChangeMapHeight = newMapHeight => this.props.dispatch(changeMapHeight(newMapHeight));

  handleChangeMapWidth = newMapWidth => this.props.dispatch(changeMapWidth(newMapWidth));

  handleChangeMapViewport = newMapViewport => this.props.dispatch(changeMapViewport(newMapViewport));

  parseJSON = string => JSON.parse(string.replace(/'/g, '"'));

  handleOnHover = (e) => {
    const { locationIdName } = this.props.workshop.locationPicker;
    if (e.object && e.index !== -1) {
      this.setState({
        locationId: e.object.properties[locationIdName],
        hover: true,
        object: e.object,
        x: e.x,
        y: e.y,
        lngLat: e.lngLat,
      });
    } else {
      this.setState({ hover: false });
    }
  };

  handleGetFillColor = (f) => {
    const { locationId, hover } = this.state;
    const { workshop } = this.props;
    const { locationIdName, selectedObject } = workshop.locationPicker;
    if (selectedObject && f) {
      return (locationId === f.properties[locationIdName] && hover) ||
             (selectedObject.properties[locationIdName] === f.properties[locationIdName]) ? [255, 255, 255] : [0, 0, 0];
    }
    return [0, 0, 0];
  };

  handleGetCursor = () => (this.state.hover ? 'pointer' : 'move');

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

    return new GeoJsonLayer({
      id: 'regions',
      data: this.props.dataSet.geojson,
      opacity: 2,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getLineColor: [100, 100, 100],
      getFillColor: f => handleGetFillColor(f),
      updateTriggers: {
        getFillColor: f => handleGetFillColor(f),
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
      object, x, y, lngLat, hover,
    } = this.state;
    const {
      workshop,
    } = this.props;
    const {
      locationIdName,
    } = workshop.locationPicker;
    return (object && hover) && (
      <div
        className="workshop__location-picker__tooltip__wrapper shadow"
        style={{
          position: 'absolute', zIndex: 1, pointerEvents: 'none', left: x, top: y - 80,
        }}
      >
        <p>{locationIdName}: {object.properties[locationIdName]}</p>
        <p>{lngLat[0]} {lngLat[1]}</p>
      </div>
    );
  };

  render() {
    const { map } = this.props;
    return (
      <ReactMapGL
        {...map.viewport}
        onViewportChange={this.handleChangeMapViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
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
  workshop: state.studio.workshop,
}))(Map);
