// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { deleteImages, getImageList } from '../../../../redux/actions/mediaActions';
import {
  GET_IMAGE_LIST,
  TOGGLE_IMAGE_EDITOR,
  TOGGLE_IMAGE_UPLOADER,
  DELETE_IMAGES,
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
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      imageEditor: false,
      currentPage: 0,
      pageSize: 24,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getImageList(0))
      .then((action) => {
        if (action.type === GET_IMAGE_LIST.SUCCESS) {
          this.setState({ pageSize: action.response.pageSize });
        }
      });
  }

  handleOnClick = (e) => {
    const { selected } = this.state;
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

    this.setState({ selected: newSelected });
  };

  handleToggleImageEditor = () => {
    const { dispatch } = this.props;
    dispatch({
      type: TOGGLE_IMAGE_EDITOR,
    });
  };

  handleToggleImageUploader = () => {
    const { dispatch } = this.props;
    dispatch({
      type: TOGGLE_IMAGE_UPLOADER,
    });
  };

  handleChangePage = (e) => {
    const { dispatch } = this.props;
    const { currentPage } = this.state;
    const { direction } = e.target.dataset;

    dispatch(getImageList(currentPage + parseInt(direction, 10)))
      .then((action) => {
        if (action.type === GET_IMAGE_LIST.SUCCESS) {
          this.setState(prevState => ({ currentPage: prevState.currentPage + parseInt(direction, 10) }));
        }
      });
  };

  handleDeleteImages = () => {
    const { dispatch } = this.props;
    const { selected } = this.state;

    dispatch(deleteImages({ ids: selected }))
      .then((action) => {
        if (action.type === DELETE_IMAGES.SUCCESS) {
          this.setState({ selected: [] });
        }
      });
  };

  render() {
    // State
    const {
      selected, imageEditor, imageUploader, currentPage, pageSize,
    } = this.state;

    // Props
    const {
      media,
    } = this.props;

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

export default connect(state => ({
  media: state.studio.media,
}))(Images);
