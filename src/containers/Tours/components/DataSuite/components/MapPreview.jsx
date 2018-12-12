import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactMapGL from 'react-map-gl';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import { connect } from 'react-redux';
import { MapProps } from '../../../../../shared/prop-types/ReducerProps';
import { changeMapHeight, changeMapViewport, changeMapWidth } from '../../../../../redux/actions/mapActions';

class MapPreview extends PureComponent {
  static propTypes = {
    dataSuite: PropTypes.instanceOf(Object).isRequired,
    map: MapProps.isRequired,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeViewport);
    this.resizeViewport();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeViewport);
  }

  resizeViewport = () => {
    this.handleChangeMapWidth('100%');
    this.handleChangeMapHeight('40vh');
  };

  handleChangeMapHeight = newMapHeight => this.props.dispatch(changeMapHeight(newMapHeight));

  handleChangeMapWidth = newMapWidth => this.props.dispatch(changeMapWidth(newMapWidth));

  handleChangeMapViewport = newMapViewport => this.props.dispatch(changeMapViewport(newMapViewport));

  parseJSON = string => JSON.parse(string.replace(/'/g, '"'));

  handleGetFillColor = (f) => {
    const { highlightedFeatureId, openFeature } = this.props.dataSuite.openDataSet;
    if (highlightedFeatureId && !openFeature.editing) {
      return (f.id === highlightedFeatureId ? [255, 255, 255] : [0, 0, 0]);
    }
    if (openFeature && openFeature.editing) return (f.id === openFeature.id ? [255, 255, 255] : [0, 0, 0]);
    return [0, 0, 0];
  };

  renderLayers = () =>
    new GeoJsonLayer({
      id: 'regions',
      data: this.props.dataSuite.openDataSet.data,
      opacity: 2,
      stroked: false,
      filled: true,
      extruded: true,
      wireframe: true,
      getLineColor: [100, 100, 100],
      getFillColor: f => this.handleGetFillColor(f),
      // getFillColor: f => console.log(f.id),
      getElevation: f => this.parseJSON(f.properties.electoralData)['2014'].Presidente['partidoPRD'] / 5, // eslint-disable-line
      // updateTriggers: {
      //   getFillColor: () => [0, 0, 0],
      //   getElevation: f => f.properties.electoralData[2014].Presidente['partidoPRD'] / 5, // eslint-disable-line
      // },
      pickable: true,
      onClick: e => this.handleClick(e),
      transitions: {
        getFillColor: {
          duration: 50,
        },
        getElevation: {
          duration: 500,
        },
      },
    });

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
        />
      </ReactMapGL>
    );
  }
}

export default connect(state => ({
  map: state.map,
  dataSuite: state.studio.dataSuite,
}))(MapPreview);
