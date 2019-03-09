/* eslint-disable */
// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropsTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { deleteFiles, getFileList } from '../../../../redux/actions/mediaActions';
import {
  GET_FILE_LIST,
  TOGGLE_FILE_EDITOR,
  TOGGLE_FILE_UPLOADER,
  DELETE_FILES,
  SELECT_FILE,
} from '../../../../redux/actionCreators/mediaActionCreators';

// Components
import Gallery from './components/Gallery';
import ImageEditor from './components/ImageEditor';
import ImageUploader from './components/ImageUploader';


class Images extends Component {
  static propTypes = {
    // Redux
    dispatch: PropTypes.func.isRequired,
    media: PropTypes.instanceOf(Object).isRequired,
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Router
    location: ReactRouterPropsTypes.location.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      pageSize: 24,
    };
  }

  componentDidMount() {
    const { dispatch, location, workshop } = this.props;
    const excludeIds = location.pathname.includes('workshop') ? workshop.form.mediaFields.images.map(o => o.id) : [];
    dispatch(getFileList({
      ml: 'images.Image',
      page: 0,
      exclude: excludeIds,
    }))
      .then((action) => {
        if (action.type === GET_FILE_LIST.SUCCESS) {
          this.setState({ pageSize: action.response.pageSize });
        }
      });
  }

  handleOnClick = (e) => {
    const { dispatch, media } = this.props;
    const { selected } = media.images;
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

  handleToggleFileEditor = () => {
    const { dispatch } = this.props;
    dispatch({
      type: TOGGLE_FILE_EDITOR,
    });
  };

  handleToggleFileUploader = () => {
    const { dispatch } = this.props;
    dispatch({
      type: TOGGLE_FILE_UPLOADER,
    });
  };

  handleChangePage = (e) => {
    const { dispatch } = this.props;
    const { currentPage } = this.state;
    const { direction } = e.target.dataset;

    dispatch(getFileList(currentPage + parseInt(direction, 10)))
      .then((action) => {
        if (action.type === GET_FILE_LIST.SUCCESS) {
          this.setState(prevState => ({ currentPage: prevState.currentPage + parseInt(direction, 10) }));
        }
      });
  };

  handleDeleteImages = () => {
    const { dispatch, media } = this.props;
    const { selected } = media.images;

    dispatch(deleteFiles({ ids: selected }))
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
    // State
    const {
      fileEditor, fileUploader, currentPage, pageSize,
    } = this.state;

    // Props
    const {
      media,
    } = this.props;

    // Media
    const {
      selected,
    } = media.images;

    let image = {
      title: '',
    };
    if (selected.length === 1) {
      [image] = media.images.instances.filter(f => f.id === parseInt(selected, 10));
    }

    return (
      <div>
        <ButtonToolbar>
          <Button color="success" size="sm" onClick={this.handleToggleImageUploader}>Upload</Button>
          <Button color="primary" size="sm" disabled={selected.length !== 1} onClick={this.handleToggleImageEditor}>
            Edit
          </Button>
          <Button color="danger" size="sm" disabled={selected.length === 0} onClick={this.handleDeleteImages}>
            Delete {selected.length !== 0 && selected.length}
          </Button>
        </ButtonToolbar>
        <Gallery
          onClick={this.handleOnClick}
          selected={selected}
          images={media.images.instances}
        />
        <ImageEditor
          toggle={this.handleToggleImageEditor}
          isOpen={imageEditor}
          image={image}
          initialValues={image && { title: image.title }}
          enableReinitialize
        />
        <ImageUploader
          toggle={this.handleToggleImageUploader}
          isOpen={imageUploader}
        />
        <ButtonToolbar className="float-right">
          <Button
            data-direction={-1}
            onClick={this.handleChangePage}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            data-direction={+1}
            onClick={this.handleChangePage}
            color="success"
            disabled={currentPage === (Math.ceil((media.images.imageCount / pageSize)) - 1)}
          >
            Next
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  media: state.studio.media,
  workshop: state.studio.workshop,
}))(Images));
