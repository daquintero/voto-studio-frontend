// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { UncontrolledTooltip } from 'reactstrap';


class File extends Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    file: PropTypes.instanceOf(Object).isRequired,
    controls: PropTypes.bool,
    draggable: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,

    // Callbacks
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    controls: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      controlsVisible: false,
    };
  }

  onMouseEnter = () => this.setState({ controlsVisible: true });

  onMouseLeave = () => this.setState({ controlsVisible: false });

  renderFileIcon = (file, modelLabel) => {
    switch (modelLabel) {
      case 'media.Image':
        return (
          <>
            <img
              className="gallery__file"
              src={file.url}
              alt={file.title}
            />
            <div className="gallery__file__info">
              <p className="gallery__file__title">{file.title}</p>
            </div>
          </>
        );
      case 'media.Video':
        return null;
      case 'media.Resource':
        return (
          <i className="fal fa-3x fa-file" />
        );
      default:
        return null;
    }
  };

  render() {
    // This
    const {
      onMouseEnter, onMouseLeave,
    } = this;

    // State
    const {
      controlsVisible,
    } = this.state;

    // Props
    const {
      file, modelLabel, onClick, onRemove, isSelected, controls, index, draggable,
    } = this.props;

    return (
      <Draggable
        draggableId={file.id}
        index={index}
        isDragDisabled={!draggable}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="gallery__file__wrapper shadow"
            data-id={file.id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="presentation"
            onClick={onClick}
          >
            {isSelected && (
              <div className="gallery__file__selected">
                <p><i className="fal fa-2x fa-check-square" /></p>
              </div>
            )}
            {(controls && index === 0) && (
              <div className="gallery__file__primary">
                <p><i className="fal fa-check-square" /> Primary</p>
              </div>
            )}
            {controls && (
              <div className={classNames('gallery__controls__wrapper', { 'controls-visible': controlsVisible })}>
                <div className="gallery__controls">
                  <i
                    id={`file-${file.id}`}
                    className="fal fa-2x fa-times-circle remove"
                    role="presentation"
                    onClick={onRemove}
                    data-obj={JSON.stringify({ id: file.id, type: file.type })}
                  />
                </div>
                <UncontrolledTooltip
                  placement="top"
                  target={`file-${file.id}`}
                >
                  Remove
                </UncontrolledTooltip>
              </div>
            )}
            {this.renderFileIcon(file, modelLabel)}
          </div>
        )}
      </Draggable>
    );
  }
}

export default File;
