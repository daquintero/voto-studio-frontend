// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Draggable } from 'react-beautiful-dnd';
import { UncontrolledTooltip } from 'reactstrap';


class Image extends Component {
  static propTypes = {
    isSelected: PropTypes.bool.isRequired,
    image: PropTypes.instanceOf(Object).isRequired,
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
      image, onClick, onRemove, isSelected, controls, index, draggable,
    } = this.props;

    return (
      <Draggable
        draggableId={image.id}
        index={index}
        isDragDisabled={!draggable}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="gallery__img__wrapper shadow"
            data-id={image.id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            role="presentation"
            onClick={onClick}
          >
            {isSelected && (
              <div className="gallery__img__selected">
                <p><i className="fal fa-2x fa-check-square" /></p>
              </div>
            )}
            {(controls && index === 0) && (
              <div className="gallery__img__primary">
                <p><i className="fal fa-check-square" /> Primary</p>
              </div>
            )}
            {controls && (
              <div className={classNames('gallery__controls__wrapper', { 'controls-visible': controlsVisible })}>
                <div className="gallery__controls">
                  <i
                    id={`image-${image.id}`}
                    className="fal fa-2x fa-times-circle remove"
                    role="presentation"
                    onClick={onRemove}
                    data-obj={JSON.stringify({ id: image.id, type: 'images' })}
                  />
                </div>
                <UncontrolledTooltip
                  placement="top"
                  target={`image-${image.id}`}
                >
                  Remove
                </UncontrolledTooltip>
              </div>
            )}
            <img
              className="gallery__img"
              src={image.url}
              alt={image.title}
            />
            <div className="gallery__img__info">
              <p className="gallery__img__title">{image.title}</p>
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}

export default Image;
