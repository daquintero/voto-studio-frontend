// Absolute Imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  Container,
  Row,
} from 'reactstrap';

// Actions
import { deleteItem, getItemDetail, listItems, publishWorkshopContent } from '../../redux/actions/workshopActions';
import {
  DELETE_ITEM,
  GET_ITEM_DETAIL,
  PUBLISH_WORKSHOP_CONTENT,
} from '../../redux/actionCreators/workshopActionCreators';

// Components
import PublishModal from '../../shared/components/PublishModal';
import ItemDetailModal from '../../shared/components/ItemDetailModal';
import ItemDeleteModel from '../../shared/components/ItemDeleteModal';
import ContentFinder from './components/ContentFinder';


class Workshop extends Component {
  static propTypes = {
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      publishContentModal: false,
      itemDetailModal: false,
      itemToDelete: {},
    };
  }

  componentDidMount() {
    this.props.dispatch(listItems());
  }

  buildUrl = (appLabel, modelName, id) => `/workshop/editor/${appLabel}/${modelName.toLowerCase()}/${id}/`;

  handleEditItem = (e) => {
    e.persist();
    const obj = JSON.parse(e.currentTarget.dataset.obj).tableValues;
    this.props.history.push(this.buildUrl(obj.appLabel, obj.modelName, obj.id));
  };

  handleCreateItem = (e) => {
    e.persist();
    const [appLabel, modelName] = e.currentTarget.dataset.modellabel.split('.');
    this.props.history.push(this.buildUrl(appLabel, modelName, 'new'));
  };

  handleViewItem = (e) => {
    e.persist();
    const obj = JSON.parse(e.currentTarget.dataset.obj).tableValues;
    this.props.dispatch(getItemDetail(obj.appLabel, obj.modelName, obj.id))
      .then((action) => {
        if (action.type === GET_ITEM_DETAIL.SUCCESS) {
          this.setState({ itemDetailModal: true });
        }
      });
  };

  handleToggleItemDeleteModal = (e) => {
    if (!this.state.itemDeleteModal) {
      e.persist();
      const obj = JSON.parse(e.currentTarget.dataset.obj).tableValues;
      const { index } = e.currentTarget.dataset;
      this.setState({ itemDeleteModal: true, itemToDelete: { ...obj, index } });
    } else {
      this.setState({ itemDeleteModal: false });
    }
  };

  handleDeleteItem = () => {
    const {
      appLabel, modelName, id, index,
    } = this.state.itemToDelete;
    this.props.dispatch(deleteItem({
      appLabel,
      modelName,
      id,
      index,
    }));
  };

  handleItemDeleteOnClose = () => this.props.dispatch({ type: DELETE_ITEM.INIT });

  handleTogglePublishContentModal = () =>
    this.setState(prevState => ({ publishContentModal: !prevState.publishContentModal }));

  handlePublishContent = () => this.props.dispatch(publishWorkshopContent());

  handlePublishContentOnClose = () => this.props.dispatch({ type: PUBLISH_WORKSHOP_CONTENT.INIT });

  handleToggleItemDetailModal = () => this.setState(prevState => ({ itemDetailModal: !prevState.itemDetailModal }));

  handleItemDetailOnClose = () => this.props.dispatch({ type: GET_ITEM_DETAIL.INIT });

  render() {
    const { workshop } = this.props;
    return (
      <>
        <Container className="mt-3">
          <Row>
            <ContentFinder
              editItem={this.handleEditItem}
              toggleDeleteItemModal={this.handleToggleItemDeleteModal}
              deleteItem={this.handleDeleteItem}
              initialValues={{ type: workshop.finder.options[0] }}
              enableReinitialize
            />
          </Row>
        </Container>
        <PublishModal
          isOpen={this.state.publishContentModal}
          toggle={this.handleTogglePublishContentModal}
          action={workshop.actions.PUBLISH_WORKSHOP_CONTENT}
          name="content"
          publish={this.handlePublishContent}
          onClose={this.handlePublishContentOnClose}
        />
        <ItemDetailModal
          isOpen={this.state.itemDetailModal}
          toggle={this.handleToggleItemDetailModal}
          action={workshop.actions.GET_ITEM_DETAIL}
          item={workshop.openItem}
          onClose={this.handleItemDetailOnClose}
        />
        <ItemDeleteModel
          isOpen={this.state.itemDeleteModal}
          toggle={this.handleToggleItemDeleteModal}
          action={workshop.actions.DELETE_ITEM}
          item={this.state.itemToDelete}
          deleteItem={this.handleDeleteItem}
          onClose={this.handleItemDeleteOnClose}
        />
      </>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(Workshop);
