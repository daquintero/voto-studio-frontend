// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import {
  Modal,
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { uploadFiles } from '../../../redux/actions/mediaActions';

// Functions
import renderDropZoneMultipleField from '../../../shared/components/form/DropZoneMultiple';
import { TOGGLE_FILE_UPLOADER, UPLOAD_FILES } from '../../../redux/actionCreators/mediaActionCreators';


class ImageUploader extends PureComponent {
  static propTypes = {
    toggle: PropTypes.func.isRequired,
    modelLabel: PropTypes.string.isRequired,

    // Redux
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,

    // Forms
    fileUploaderForm: PropTypes.instanceOf(Object),
    reset: PropTypes.func.isRequired,
  };

  static defaultProps = {
    // Form
    fileUploaderForm: {},
  };

  handleOnSubmit = () => {
    const {
      dispatch, fileUploaderForm, reset, modelLabel,
    } = this.props;
    const { files } = fileUploaderForm.values;

    const formData = new FormData();
    for (let i = 0; i < files.length; i += 1) {
      formData.append(`file${i}`, files[i]);
    }
    formData.append('model_label', modelLabel);

    dispatch(uploadFiles(formData))
      .then((action) => {
        if (action.type === UPLOAD_FILES.SUCCESS) {
          dispatch({
            type: TOGGLE_FILE_UPLOADER,
          });
          dispatch(reset('fileUploaderForm'));
        }
      });
  };

  render() {
    // Props
    const {
      toggle, media, fileUploaderForm, modelLabel,
    } = this.props;

    const uploadDisabled = () => fileUploaderForm && !fileUploaderForm.values;

    return (
      <Modal
        isOpen={media.files.fileUploaderOpen}
        toggle={toggle}
        size="xl"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
          <h4 className="bold-text  modal__title">Upload Files</h4>
        </div>
        <div className="modal__body">
          <div className="file-uploader__wrapper">
            <form className="file-uploader__form mt-3" content="multipart/form-data">
              <Field
                name="files"
                component={renderDropZoneMultipleField}
                modelLabel={modelLabel}
                className="file-uploader__form__field"
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
  form: 'fileUploaderForm',
})(ImageUploader);

export default connect(state => ({
  media: state.studio.media,
  fileUploaderForm: state.form.fileUploaderForm,
}))(ImageEditorWithForm);
