// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Components
import FileGallery from './FileGallery';
import FileUploader from './FileUploader';
import FileEditor from './FileEditor';

// Actions
import {
  DELETE_FILES,
  SELECT_FILE, SELECT_TAB,
  TOGGLE_FILE_EDITOR,
  TOGGLE_FILE_UPLOADER,
} from '../../../redux/actionCreators/mediaActionCreators';
import { getFileList, deleteFiles } from '../../../redux/actions/mediaActions';


const modelMediaTypeMap = {
  'media.Image': 'images',
  'media.Video': 'videos',
  'media.Resource': 'resources',
};


class FileExplorer extends Component {
  static propTypes = {
    modelLabel: PropTypes.string.isRequired,

    // Redux
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Router
    location: ReactRouterPropTypes.location.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      dispatch, modelLabel, workshop, location,
    } = this.props;
    let excludeIds = [];
    if (location.pathname.includes('workshop')) {
      excludeIds = workshop.form.mediaFields[modelMediaTypeMap[modelLabel]].map(f => f.id);
    }
    dispatch(getFileList({
      pageNumber: 0,
      excludeIds,
      modelLabel,
    }))
      .then(() =>
        dispatch({
          type: SELECT_FILE,
          selected: [],
        }));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: SELECT_TAB,
      activeTab: 'media.Image',
    });
  }

  handleToggleFileUploader = () => {
    const { dispatch } = this.props;
    dispatch({
      type: TOGGLE_FILE_UPLOADER,
    });
  };

  handleToggleFileEditor = () => {
    const { dispatch } = this.props;
    dispatch({
      type: TOGGLE_FILE_EDITOR,
    });
  };

  handleOnClick = (e) => {
    const { dispatch, media } = this.props;
    const { selected } = media.files;
    const { id } = e.currentTarget.dataset;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    dispatch({
      type: SELECT_FILE,
      selected: newSelected,
    });
  };

  handleDeleteFiles = () => {
    const { dispatch, media } = this.props;
    const { selected } = media.files;

    dispatch(deleteFiles({
      ids: selected,
      modelLabel: media.files.activeTab,
    }))
      .then((action) => {
        if (action.type === DELETE_FILES.SUCCESS) {
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
      media, modelLabel,
    } = this.props;
    const {
      selected,
    } = media.files;

    let file = {
      title: '',
    };
    if (selected.length === 1) {
      [file] = media.files.instances.filter(f => f.id === parseInt(selected, 10));
    }

    return (
      <>
        <ButtonToolbar>
          <Button color="success" size="sm" onClick={this.handleToggleFileUploader}>Upload</Button>
          <Button color="primary" size="sm" disabled={selected.length !== 1} onClick={this.handleToggleFileEditor}>
            Edit
          </Button>
          <Button color="danger" size="sm" disabled={selected.length === 0} onClick={this.handleDeleteFiles}>
            Delete {selected.length !== 0 && selected.length}
          </Button>
        </ButtonToolbar>
        <FileUploader
          toggle={this.handleToggleFileUploader}
          modelLabel={modelLabel}
        />
        <FileEditor
          toggle={this.handleToggleFileEditor}
          file={file}
          initialValues={file && { title: file.title }}
          enableReinitialize
        />
        <FileGallery
          onClick={this.handleOnClick}
          selected={selected}
          modelLabel={modelLabel}
        />
      </>
    );
  }
}

export default withRouter(connect(state => ({
  media: state.studio.media,
  workshop: state.studio.workshop,
}))(FileExplorer));
