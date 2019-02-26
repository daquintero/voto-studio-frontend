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
import { updateMediaOrder } from '../../../redux/actions/workshopActions';

// Components
import File from './File';
import Loader from '../../../shared/components/Loader';


class FileGallery extends PureComponent {
  static propTypes = {
    selected: PropTypes.instanceOf(Array),
    files: PropTypes.instanceOf(Array),
    fileDims: PropTypes.instanceOf(Object),
    controls: PropTypes.bool,
    draggable: PropTypes.bool,
    modelLabel: PropTypes.string.isRequired,

    // Callbacks
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func,

    // Redux
    dispatch: PropTypes.func.isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,
    media: PropTypes.instanceOf(Object).isRequired,
  };

  static defaultProps = {
    selected: [],
    files: [],
    fileDims: {
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
      onClick, selected, media, files, fileDims, controls, draggable, onRemove, modelLabel,
    } = this.props;

    const instances = draggable ? files : media.files.instances;

    return instances || media.actions.GET_FILE_LIST.loaded ? (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="gallery" direction="horizontal">
          {provided => (
            <div
              className="row"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {instances.map((file, index) => (
                <Col
                  className="mb-4"
                  key={file.id}
                  {...fileDims}
                >
                  <File
                    onClick={onClick}
                    file={file}
                    isSelected={selected.includes(file.id.toString())}
                    controls={controls}
                    draggable={draggable}
                    innerRef={provided.innerRef}
                    index={index}
                    onRemove={onRemove}
                    modelLabel={modelLabel}
                  />
                  {provided.placeholder}
                </Col>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    ) : (
      <Loader elemClass="load__card" />
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
  media: state.studio.media,
}))(FileGallery);
