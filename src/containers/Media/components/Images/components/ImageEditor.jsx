// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Modal,
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { updateImage } from '../../../../../redux/actions/mediaActions';
import { TOGGLE_IMAGE_EDITOR, UPDATE_IMAGE } from '../../../../../redux/actionCreators/mediaActionCreators';

// Functions
import imageUrl from '../../../../../shared/utils/imageUrl';


class ImageEditor extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired,
    image: PropTypes.instanceOf(Object),

    // Redux
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,

    // Form
    imageEditorForm: PropTypes.instanceOf(Object),
  };

  static defaultProps = {
    image: {},

    // Form
    imageEditorForm: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSave = () => {
    const { dispatch, imageEditorForm, image } = this.props;
    dispatch(updateImage({ id: image.id, title: imageEditorForm.values.title }))
      .then((action) => {
        if (action.type === UPDATE_IMAGE.SUCCESS) {
          dispatch({
            type: TOGGLE_IMAGE_EDITOR,
          });
        }
      });
  };

  render() {
    // Props
    const {
      toggle, image, media,
    } = this.props;

    return (
      <Modal
        isOpen={media.images.imageEditorOpen}
        toggle={toggle}
        size="md"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
          <h4 className="bold-text  modal__title">Edit Image</h4>
        </div>
        <div className="modal__body">
          <div className="image-editor__wrapper">
            {image && (
              <img className="image-editor__preview" src={imageUrl(image.url)} alt={image.title} />
            )}
            <form className="image-editor__form mt-3">
              <Field
                name="title"
                component="input"
                className="image-editor__form__field"
              />
            </form>
          </div>
        </div>
        <ButtonToolbar className="modal__footer">
          <Button color="success" onClick={this.handleSave}>Save</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}

const ImageEditorWithForm = reduxForm({
  form: 'imageEditorForm',
})(ImageEditor);

export default connect(state => ({
  media: state.studio.media,
  imageEditorForm: state.form.imageEditorForm,
}))(ImageEditorWithForm);
