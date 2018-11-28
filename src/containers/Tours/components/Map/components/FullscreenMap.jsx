import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import { FormGroup, Input, Label } from 'reactstrap';
import Resizable from 're-resizable';
import { SidebarProps, MapProps } from '../../../../../shared/prop-types/ReducerProps';
import mapData from './mapData.json';
import { changeMapHeight, changeMapWidth } from '../../../../../redux/actions/mapActions';

class FullscreenMap extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    handleChangeMapViewport: PropTypes.func.isRequired,
    updateMarkerPosition: PropTypes.func.isRequired,
    updateMarker: PropTypes.func.isRequired,
    deleteMarker: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      markerDraggable: true,
      marker: {},
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeViewport);
    this.resizeViewport();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeViewport);
  }

  onViewportChange = (viewport) => {
    this.props.handleChangeMapViewport(viewport);
  };

  onMarkerChange = (e) => {
    e.persist();
    this.setState(prevState => ({
      ...prevState,
      marker: {
        ...this.state.marker,
        [e.target.name]: e.target.value,
      },
    }));
  };

  getStep = stepId => this.props.tours.openTour.steps.filter(elem => elem.id === parseInt(stepId, 10))[0];
  getActiveStep = () =>
    this.props.tours.openTour.steps
      .filter(elem => elem.id === parseInt(this.props.tours.openTour.activeTourStepId, 10))[0];


  handleChangeMapHeight = newMapHeight => this.props.dispatch(changeMapHeight(newMapHeight));

  handleChangeMapWidth = newMapWidth => this.props.dispatch(changeMapWidth(newMapWidth));

  handleToggleUpdateMarker = marker =>
    this.setState(prevState => ({
      ...prevState,
      marker: {
        ...marker,
        updating: !prevState.marker.updating,
      },
    }));

  handleUpdateMarker = (markerIndex) => {
    if (this.state.marker.name && this.state.marker.text) {
      this.props.updateMarker(
        this.state.marker,
        markerIndex,
        this.getStep(),
      );
      this.handleToggleUpdateMarker(this.state.marker);
    }
  };

  handleDeleteMarker = (marker) => {
    this.props.deleteMarker(
      marker,
      this.getActiveStep(),
    );
  };

  handleOnResizeStop = (e, dir, ref, diff, marker, markerIndex) => {
    this.setState({ markerDraggable: true });
    const newMarker = {
      ...marker,
      width: marker.width + diff.width,
      height: marker.height + diff.height,
    };
    this.props.updateMarker(
      newMarker,
      markerIndex,
      this.getActiveStep(),
    );
  };

  resizeViewport = () => {
    const topbarHeight = 60;
    let sidebarWidth = 55;
    if (!this.props.sidebar.collapse) sidebarWidth = 240;
    if (window.innerWidth < 576) sidebarWidth = 0;
    this.handleChangeMapWidth(window.innerWidth - sidebarWidth);
    this.handleChangeMapHeight(window.innerHeight - topbarHeight);
  };

  renderLayers = () =>
    // I have removed some of the color functionality just to make this simpler for now, I will
    // add them in again once I've got this fully up and running. This GeoJsonLayer will be able to accept a
    // variety of data that can differ for each step.
    new GeoJsonLayer({
      id: 'regions',
      data: mapData,
      opacity: 2,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getLineColor: [100, 100, 100],
      getFillColor: () => [0, 0, 0],
        getElevation: f => f.properties.electoralData[2014].Presidente['partidoPRD'] / 5, // eslint-disable-line
      updateTriggers: {
        getFillColor: () => [0, 0, 0],
          getElevation: f => f.properties.electoralData[2014].Presidente['partidoPRD'] / 5, // eslint-disable-line
      },
      pickable: true,
      onClick: e => this.handleClick(e),
      transitions: {
        getFillColor: {
          duration: 500,
        },
        getElevation: {
          duration: 500,
        },
      },
    });

  render() {
    return (
      <div>
        <ReactMapGL
          {...this.props.map.viewport}
          onViewportChange={this.onViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
        >
          <DeckGL
            {...this.props.map.viewport}
            layers={this.renderLayers()}
          />
          {this.props.tours.openTour.activeTourStepId !== -1 && this.getActiveStep().markers.map((marker, index) => (
            <Marker
              key={`marker-${marker.id}`}
              latitude={marker.latitude}
              longitude={marker.longitude}
              draggable={this.state.markerDraggable}
              captureDrag={true} // eslint-disable-line
              onDragEnd={e => this.props.updateMarkerPosition(e, marker, index)}
            >
              <Resizable
                defaultSize={{
                    width: marker.width,
                    height: marker.height,
                  }}
                key={`resizable-box-${marker.id}`}
                onResizeStart={() => this.setState({ markerDraggable: false })}
                onResizeStop={(e, dir, ref, diff) => this.handleOnResizeStop(e, dir, ref, diff, marker, index)}
              >
                <div className="fullscreen-map__marker" data-marker-id={marker.id}>
                  {!(this.state.marker.updating && this.state.marker.id === marker.id) || !this.state.marker ? (
                      <>
                        <h3>{marker.name}</h3>
                        <hr />
                        <p>{marker.text}</p>
                      </>
                    ) : (
                      <>
                        <FormGroup>
                          <Label>Name</Label>
                          <Input
                            type="text"
                            name="name"
                            value={this.state.marker.name}
                            onChange={e => this.onMarkerChange(e)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>Text</Label>
                          <Input
                            type="textarea"
                            name="text"
                            value={this.state.marker.text}
                            onChange={e => this.onMarkerChange(e)}
                          />
                        </FormGroup>
                      </>
                    )}
                  <div className="fullscreen-map__marker__controls">
                    {!this.state.marker.updating ? (
                      <i
                        className="fal fa-fw fa-pen fullscreen-map__marker__control"
                        onClick={() => this.handleToggleUpdateMarker(marker)}
                        role="presentation"
                      />
                      ) : (
                        <i
                          className="fal fa-fw fa-check fullscreen-map__marker__control"
                          onClick={() => this.handleUpdateMarker(index)}
                          role="presentation"
                        />
                      )}
                    <i
                      className="fal fa-fw fa-trash-alt fullscreen-map__marker__control"
                      onClick={() => this.handleDeleteMarker(marker)}
                      role="presentation"
                    />
                  </div>
                </div>
              </Resizable>
            </Marker>
            ))}
        </ReactMapGL>
      </div>
    );
  }
}

export default connect(state => ({
  sidebar: state.sidebar,
  map: state.map,
  tours: state.studio.tours,
}))(FullscreenMap);
