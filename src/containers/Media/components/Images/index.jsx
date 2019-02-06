// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ButtonToolbar,
  Button,
} from 'reactstrap';

// Actions
import { getImageList } from '../../../../redux/actions/mediaActions';
import { GET_IMAGE_LIST, TOGGLE_IMAGE_UPLOADER } from '../../../../redux/actionCreators/mediaActionCreators';

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

  handleSelectImage = (newSelected) => {
    this.setState({ selected: newSelected });
  };

  handleToggleImageEditor = () => {
    this.setState(prevState => ({
      imageEditor: !prevState.imageEditor,
    }));
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
          <Button color="danger" size="sm" disabled={selected.length === 0}>
            Delete {selected.length !== 0 && selected.length}
          </Button>
        </ButtonToolbar>
        <Gallery selectImage={this.handleSelectImage} />
        <ImageEditor
          toggle={this.handleToggleImageEditor}
          isOpen={imageEditor}
          image={image}
          initialValues={{ title: image.title }}
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
