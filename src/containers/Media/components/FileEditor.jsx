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
import { withTranslation } from 'react-i18next';

// Actions
import { updateFile } from '../../../redux/actions/mediaActions';
import { SELECT_FILE, TOGGLE_FILE_EDITOR, UPDATE_FILE } from '../../../redux/actionCreators/mediaActionCreators';


class FileEditor extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired,
    file: PropTypes.instanceOf(Object),

    // Redux
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,

    // Form
    fileEditorForm: PropTypes.instanceOf(Object),

    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    file: {},

    // Form
    fileEditorForm: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSave = (e) => {
    e.preventDefault();
    const { dispatch, fileEditorForm, file } = this.props;
    dispatch(updateFile({ id: file.id, title: fileEditorForm.values.title }))
      .then((action) => {
        if (action.type === UPDATE_FILE.SUCCESS) {
          dispatch({
            type: TOGGLE_FILE_EDITOR,
          });
          dispatch({
            type: SELECT_FILE,
            selected: [],
          });
        }
      });
  };

  render() {
    // Props
    const {
      toggle, file, media, t,
    } = this.props;

    return (
      <Modal
        isOpen={media.files.fileEditorOpen}
        toggle={toggle}
        size="md"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
          <h4 className="bold-text  modal__title">{t('Edit Image')}</h4>
        </div>
        <div className="modal__body">
          <div className="file-editor__wrapper">
            {file && (
              <img className="file-editor__preview" src={file.url} alt={file.title} />
            )}
            <form className="file-editor__form mt-3" onSubmit={this.handleSave}>
              <Field
                name="title"
                component="input"
                className="file-editor__form__field"
              />
              <ButtonToolbar className="modal__footer">
                <Button type="submit" color="success">Save</Button>
                <Button color="secondary" onClick={toggle}>{t('Cancel')}</Button>
              </ButtonToolbar>
            </form>
          </div>
        </div>
      </Modal>
    );
  }
}

const ImageEditorWithForm = reduxForm({
  form: 'fileEditorForm',
})(FileEditor);

export default connect(state => ({
  media: state.studio.media,
  fileEditorForm: state.form.fileEditorForm,
}))(withTranslation()(ImageEditorWithForm));
