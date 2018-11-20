import React, { Component } from 'react';
import StaticMap, { FlyToInterpolator, LinearInterpolator } from 'react-map-gl';  // eslint-disable-line
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { SidebarProps, MapProps } from '../../../shared/prop-types/ReducerProps';
import mapData from './mapData.json';

class FullscreenMap extends Component {
  static propTypes = {
    sidebar: SidebarProps.isRequired,
    map: MapProps.isRequired,
    handleChangeMapWidth: PropTypes.func.isRequired,
    handleChangeMapHeight: PropTypes.func.isRequired,
    handleChangeMapViewport: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeViewport);
    this.resizeViewport();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeViewport);
  }

  onViewPortChange = (viewport) => {
    this.props.handleChangeMapViewport(viewport.viewState);
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
    // (Zooms will have to different for desktop and mobile versions)
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
    // add them in again once I've got this fully up and running
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
        <DeckGL
          layers={this.renderLayers()}
          viewState={this.props.map.viewport}
          controller={true}   // eslint-disable-line
          onViewStateChange={this.onViewPortChange}
        >
          <StaticMap
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN}
          />
        </DeckGL>
      </div>
    );
  }
}

export default FullscreenMap;
