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
    selected: PropTypes.instanceOf(Array).isRequired,

    // Redux
    media: PropTypes.instanceOf(Object).isRequired,

    // Callbacks
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Props
    const {
      media, onClick, selected,
    } = this.props;

    return (
      <Row>
        {media.images.instances.map(image => (
          <Col className="mb-4" key={image.id} xl={2}>
            <div
              className="gallery__img__wrapper shadow"
              role="presentation"
              onClick={onClick}
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
