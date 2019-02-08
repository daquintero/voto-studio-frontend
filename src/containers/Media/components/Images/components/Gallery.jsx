// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Col,
} from 'reactstrap';
import {
  DragDropContext,
  Droppable,
} from 'react-beautiful-dnd';

// Actions
import { updateMediaOrder } from '../../../../../redux/actions/workshopActions';

// Components
import Image from './Image';

class Gallery extends PureComponent {
  static propTypes = {
    selected: PropTypes.instanceOf(Array),
    images: PropTypes.instanceOf(Array),
    imageDims: PropTypes.instanceOf(Object),
    controls: PropTypes.bool,
    draggable: PropTypes.bool,

    // Callbacks
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func,

    // Redux
    dispatch: PropTypes.func.isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,
  };

  static defaultProps = {
    selected: [],
    images: null,
    imageDims: {
      xs: 12, sm: 6, md: 4, lg: 3, xl: 2,
    },
    controls: false,
    draggable: false,
    onRemove: () => {},
  };

  onDragEnd = (result) => {
    const { dispatch, workshop } = this.props;
    const { modelLabel, id } = workshop.form.parentModel;

    dispatch(updateMediaOrder({
      modelLabel,
      id,
      result,
      mediaType: 'images',
    }));
  };

  render() {
    // Props
    const {
      onClick, selected, images, imageDims, controls, draggable, onRemove,
    } = this.props;

    return images.length ? (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {provided => (
            <div
              className="row"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {images.map((image, index) => (
                <Col
                  className="mb-4"
                  key={image.id}
                  {...imageDims}
                >
                  <Image
                    onClick={onClick}
                    image={image}
                    isSelected={selected.indexOf(image.id.toString()) !== -1}
                    controls={controls}
                    draggable={draggable}
                    innerRef={provided.innerRef}
                    index={index}
                    onRemove={onRemove}
                  />
                  {provided.placeholder}
                </Col>
                ))}
            </div>
            )}
        </Droppable>
      </DragDropContext>
    ) : (
      <h4>No images</h4>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(Gallery);
