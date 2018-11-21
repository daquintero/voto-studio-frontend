import React, { Component } from 'react';
import ReactMapGL, { FlyToInterpolator, LinearInterpolator, Marker } from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { FormGroup, Input, Label } from 'reactstrap';
import Resizable from 're-resizable';
import { SidebarProps, MapProps, ToursProps } from '../../../../../shared/prop-types/ReducerProps';
import mapData from './mapData.json';

class FullscreenMap extends Component {
  static propTypes = {
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    handleChangeMapWidth: PropTypes.func.isRequired,
    handleChangeMapHeight: PropTypes.func.isRequired,
    handleChangeMapViewport: PropTypes.func.isRequired,
    tours: ToursProps.isRequired,
    activeTourStepId: PropTypes.number.isRequired,
    markers: PropTypes.instanceOf(Array).isRequired,
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

  // componentDidUpdate() {
  //   const activeStep = this.props.tours.newTour.steps.filter(step => step.id === this.props.activeTourStepId)[0];
  //   this.setState(prevState => ({
  //     ...prevState,
  //     markers: [
  //       ...activeStep.markers,
  //     ],
  //   }));
  // }

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
        this.props.tours.newTour.steps.filter(step => step.id === this.props.activeTourStepId)[0],
      );
      this.handleToggleUpdateMarker(this.state.marker);
    }
  };

  handleDeleteMarker = (marker) => {
    this.props.deleteMarker(
      marker,
      this.props.tours.newTour.steps.filter(step => step.id === this.props.activeTourStepId)[0],
    );
  };

  resizeViewport = () => {
    const topbarHeight = 60;
    let sidebarWidth = 55;
    if (!this.props.sidebar.collapse) sidebarWidth = 240;
    if (window.innerWidth < 576) sidebarWidth = 0;
    this.props.handleChangeMapWidth(window.innerWidth - sidebarWidth);
    this.props.handleChangeMapHeight(window.innerHeight - topbarHeight);
    this.renderLayers = this.renderLayers.bind(this);
    this.mapTour = this.mapTour.bind(this);
  };

  mapTour = () => {
    // These transitions will have to be provided by the backend.
    // So we will store in json format a list of objects such as below
    // that describes a list of transitions. Also an additional popover/html overlay
    // will display information about each transition, ie "this is where this person did this".
    // (Zooms will have to be different for desktop and mobile versions)
    // I'm going to look into a more efficient way of changing the viewport state, I have a feeling
    // this is suboptimal.
    // Some weird things happen with the fill (it leaves only the line fill) when the zoom is changed
    // sufficiently, not sure why.
    const mapTourData = [
      {
        ...this.props.map.viewport,
        latitude: 8,
        longitude: -82.3,
        zoom: 8,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      },
      {
        ...this.props.map.viewport,
        latitude: 8.565458950146304,
        longitude: -81.94139469428158,
        zoom: 8,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      },
      {
        ...this.props.map.viewport,
        latitude: 8,
        longitude: -81,
        zoom: 8,
        bearing: 40,
        transitionDuration: 2000,
        transitionInterpolator: new LinearInterpolator(['bearing', 'zoom', 'latitude', 'longitude']),
        transitionEasing: d3.easeCubic,
      },
      {
        ...this.props.map.viewport,
        latitude: 8,
        longitude: -78.5,
        zoom: 8,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic,
      },
      {
        ...this.props.map.viewport,
        latitude: 8,
        longitude: -81,
        zoom: 6,
        bearing: -20,
        transitionDuration: 3950,
        transitionInterpolator: new LinearInterpolator(['bearing', 'zoom', 'latitude', 'longitude']),
        transitionEasing: d3.easeCubic,
      },
    ];
    // Start of the first transition
    this.props.handleChangeMapViewport(mapTourData[0]);
    let c = 1;
    const mapTourInterval = setInterval(() => {
      // Use an interval to loop through the remaining transitions every 4 seconds.
      // Additional actions and overlays can also be trigger/sequenced in here
      this.props.handleChangeMapViewport(mapTourData[c]);
      c += 1;
      // Clear the interval when the last transition is done
      if (c > mapTourData.length - 1) clearInterval(mapTourInterval);
    }, 4000);
  };

  renderLayers() {
    // I have removed some of the color functionality just to make this simpler for now, I will
    // add them in again once I've got this fully up and running. This GeoJsonLayer will be able to accept a
    // variety of data that can differ for each step.
    return [
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
      }),
    ];
  }
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
          {this.props.activeTourStepId !== -1 && (
            <>
              {this.props.tours.newTour.steps
                .filter(s => s.id === this.props.activeTourStepId)[0].markers
                .map((marker, index) => (
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
                        width: 200,
                        height: '100%',
                      }}
                      key={`resizable-box-${marker.id}`}
                      onResizeStart={() => this.setState({ markerDraggable: false })}
                      onResizeStop={() => this.setState({ markerDraggable: true })}
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
            </>
          )}
        </ReactMapGL>
      </div>
    );
  }
}

export default FullscreenMap;
