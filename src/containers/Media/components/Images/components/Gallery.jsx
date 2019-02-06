// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Row,
  Col,
} from 'reactstrap';

// Functions
import imageUrl from '../../../../../shared/utils/imageUrl';

class Gallery extends Component {
  static propTypes = {
    // Redux
    // dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,

    // Callbacks
    selectImage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
  }

  handleOnClick = (e) => {
    const { selectImage } = this.props;
    const { selected } = this.state;
    const { id } = e.currentTarget.dataset;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected }, selectImage(newSelected));
  };

  render() {
    // State
    const {
      selected,
    } = this.state;

    // Props
    const {
      media,
    } = this.props;

    return (
      <Row>
        {media.images.instances.map(image => (
          <Col className="mb-4" key={image.id} xl={2}>
            <div
              className="gallery__img__wrapper shadow"
              role="presentation"
              onClick={this.handleOnClick}
              data-id={image.id}
            >
              {selected.indexOf(image.id.toString()) !== -1 && (
                <div className="gallery__img__selected">
                  <p><i className="fal fa-2x fa-check-square" /></p>
                </div>
              )}
              <img className="gallery__img" src={imageUrl(image.url)} alt={image.title} />
              <div className="gallery__img__info">
                <p className="gallery__img__title">{image.title}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    );
  }
}

export default connect(state => ({
  media: state.studio.media,
}))(Gallery);
