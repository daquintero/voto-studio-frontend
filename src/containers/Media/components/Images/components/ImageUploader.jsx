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
import { uploadImages } from '../../../../../redux/actions/mediaActions';

// Functions
import renderDropZoneMultipleField from '../../../../../shared/components/form/DropZoneMultiple';
import { TOGGLE_IMAGE_UPLOADER, UPLOAD_IMAGES } from '../../../../../redux/actionCreators/mediaActionCreators';


class ImageUploader extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired,

    // Redux
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,

    // Forms
    imageUploaderForm: PropTypes.instanceOf(Object).isRequired,
    reset: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnSubmit = () => {
    const { dispatch, imageUploaderForm, reset } = this.props;
    const files = imageUploaderForm.values.images;
    const formData = new FormData();

    for (let i = 0; i < files.length; i += 1) {
      formData.append(`file${i}`, files[i]);
    }

    dispatch(uploadImages(formData))
      .then((action) => {
        if (action.type === UPLOAD_IMAGES.SUCCESS) {
          dispatch({
            type: TOGGLE_IMAGE_UPLOADER,
          });
          dispatch(reset('imageUploaderForm'));
        }
      });
  };

  render() {
    // Props
    const {
      toggle, media, imageUploaderForm,
    } = this.props;

    const uploadDisabled = () => imageUploaderForm && !imageUploaderForm.values;

    return (
      <Modal
        isOpen={media.images.imageUploaderOpen}
        toggle={toggle}
        size="xl"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
          <h4 className="bold-text  modal__title">Upload Images</h4>
        </div>
        <div className="modal__body">
          <div className="image-uploader__wrapper">
            <form className="image-uploader__form mt-3" content="multipart/form-data">
              <Field
                name="images"
                component={renderDropZoneMultipleField}
                className="image-uploader__form__field"
              />
            </form>
          </div>
        </div>
        <ButtonToolbar className="modal__footer">
          <Button
            color="success"
            onClick={this.handleOnSubmit}
            disabled={uploadDisabled()}
          >
            Upload
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ButtonToolbar>
      </Modal>
    );
  }
}

const ImageEditorWithForm = reduxForm({
  form: 'imageUploaderForm',
})(ImageUploader);

export default connect(state => ({
  media: state.studio.media,
  imageUploaderForm: state.form.imageUploaderForm,
}))(ImageEditorWithForm);
