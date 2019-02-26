// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Modal,
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Components
import Media from '../../../../../Media';


class MediaCenter extends PureComponent {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    media: PropTypes.instanceOf(Object).isRequired,

    // Callbacks
    toggle: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
  };

  render() {
    // Props
    const {
      toggle, workshop, media, onAdd,
    } = this.props;

    // Media
    const {
      selected,
    } = media.files;

    return (
      <Modal
        isOpen={workshop.mediaCenter.open}
        toggle={toggle}
        size="xl"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
          <h4 className="bold-text  modal__title">Select Media</h4>
        </div>
        <div className="modal__body">
          <Media />
        </div>
        <ButtonToolbar className="modal__footer">
          <Button
            color="success"
            onClick={() => onAdd(selected, 'images')}
            disabled={selected.length === 0}
          >
            {!workshop.actions.UPDATE_MEDIA_FIELD.loading ? (
              <span><i className="fal fa-plus" /> Add {Boolean(selected.length) && selected.length}</span>
            ) : (
              <span><i className="fal fa-spin fa-spinner" /> Adding...</span>
            )}
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
  media: state.studio.media,
}))(MediaCenter);
