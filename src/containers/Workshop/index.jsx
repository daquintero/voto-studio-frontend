import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  Container,
  Col,
  Row,
  Table,
  Card,
  CardBody,
  ButtonToolbar,
  Button,
  UncontrolledTooltip,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { deleteItem, getItemDetail, listItems, publishWorkshopContent } from '../../redux/actions/workshopActions';
import {
  DELETE_ITEM,
  GET_ITEM_DETAIL,
  PUBLISH_WORKSHOP_CONTENT,
} from '../../redux/actionCreators/workshopActionCreators';
import PublishModal from '../../shared/components/PublishModal';
import ItemDetailModal from '../../shared/components/ItemDetailModal';
import ItemDeleteModel from '../../shared/components/ItemDeleteModal';
import Collapse from '../../shared/components/Collapse';
import squashString from '../../shared/utils/squashString';

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
      itemDeleteModal: false,
      itemToDelete: {},
    };
  }

  componentDidMount() {
    this.props.dispatch(listItems());
  }

  handleEditItem = (e) => {
    e.persist();
    const obj = JSON.parse(e.currentTarget.dataset.obj).tableValues;
    this.props.history.push(`/workshop/editor/${obj.appLabel}/${obj.modelName.toLowerCase()}/${obj.id}/`);
  };

  handleCreateItem = (e) => {
    e.persist();
    const [appLabel, modelName] = e.currentTarget.dataset.modellabel.split('.');
    this.props.history.push(`/workshop/editor/${appLabel}/${modelName.toLowerCase()}/new/`);
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

  buildUrl = (appLabel, modelName, id) => `/workshop/editor/${appLabel}/${modelName.toLowerCase()}/${id}/`;

  handleTogglePublishContentModal = () =>
    this.setState(prevState => ({ publishContentModal: !prevState.publishContentModal }));

  handlePublishContent = () => this.props.dispatch(publishWorkshopContent());

  handlePublishContentOnClose = () => this.props.dispatch({ type: PUBLISH_WORKSHOP_CONTENT.INIT });

  handleToggleItemDetailModal = () => this.setState(prevState => ({ itemDetailModal: !prevState.itemDetailModal }));

  handleItemDetailOnClose = () => this.props.dispatch({ type: GET_ITEM_DETAIL.INIT });

  render() {
    const { workshop } = this.props;
    const { items } = workshop;
    return (
      <>
        <Container className="mt-4">
          <Row>
            <Col md={12}>
              <Link to="/" className="text-black-50">
                <i className="fal fa-chevron-circle-left" /> back to dashboard
              </Link>
              <h3 className="page-title">Workshop</h3>
              <h3 className="page-subhead subhead">
                Build the core informational content of VotoInformado
              </h3>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card>
                <CardBody>
                  <h3 className="page-title">Create New Items</h3>
                  <h3 className="page-subhead subhead">
                  Click to add open a form allowing you to create a new piece of content
                  </h3>
                  <div className="workshop__button-panel__wrapper">
                    {items.map(item => (
                      <div
                        className="workshop__button-panel__button"
                        key={item.modelName}
                        role="presentation"
                        data-modellabel={item.modelLabel}
                        onClick={this.handleCreateItem}
                      >
                        <p className="text-capitalize">
                          <i className="fal fa-plus" /> {item.verboseName}
                        </p>
                      </div>
                  ))}
                  </div>
                  <hr />
                  <ButtonToolbar>
                    <Button size="sm" color="success" onClick={this.handleTogglePublishContentModal}>
                      <i className="fal fa-globe-americas" /> Publish changes
                    </Button>
                  </ButtonToolbar>
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardBody>
                  <h3 className="page-title">Content Items</h3>
                  <h3 className="page-subhead subhead">
                    Here are all of the content items that you have created.
                  </h3>
                  {items.map((item, index) => Boolean(item.values.length) && (
                  <div key={item.modelLabel} className="mb-1">
                    <Collapse title={item.verboseNamePluralTitle} className="with-shadow">
                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th>ID</th>
                            {item.tableHeads.map(o => (
                              <th className="text-capitalize" key={o}>{o.replace(/_/g, ' ')}</th>
                            ))}
                            <th>User</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.values && item.values.map(o => (
                            <tr
                              key={o.tableValues.id}
                              className="table-row__no-pointer"
                              onClick={this.handleGetItemDetail}
                            >
                              <td>{o.tableValues.id}</td>
                              {o.tableValues.descriptors.values.map(d => (
                                <td key={d.name}>{squashString(d.value, 15)}</td>
                              ))}
                              <td>
                                {o.tableValues.userEmail === JSON.parse(localStorage.getItem('user')).email ? (
                                  <a href="/">You</a>
                              ) : (
                                <a href="/">{o.tableValues.userEmail}</a>
                              )}
                              </td>
                              <td>
                                <span
                                  className="workshop__form-action"
                                  role="presentation"
                                  data-obj={JSON.stringify(o)}
                                  onClick={this.handleEditItem}
                                >
                                  <i
                                    className="fal fa-fw fa-edit mr-3 text-primary"
                                    id={`edit-${item.modelName}-${o.tableValues.id}`}
                                  />
                                </span>
                                <span
                                  className="workshop__form-action"
                                  role="presentation"
                                  data-obj={JSON.stringify(o)}
                                  onClick={this.handleViewItem}
                                >
                                  <i
                                    className="fal fa-fw fa-eye mr-3 text-info"
                                    id={`details-${item.modelName}-${o.tableValues.id}`}
                                  />
                                </span>
                                <span
                                  className="workshop__form-action"
                                  role="presentation"
                                  data-obj={JSON.stringify(o)}
                                  data-index={index}
                                  onClick={this.handleToggleItemDeleteModal}
                                >
                                  <i
                                    className="fal fa-fw fa-trash-alt text-danger"
                                    id={`delete-${item.modelName}-${o.tableValues.id}`}
                                  />
                                </span>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`edit-${item.modelName}-${o.tableValues.id}`}
                                >
                                  Edit {item.verboseName}
                                </UncontrolledTooltip>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`details-${item.modelName}-${o.tableValues.id}`}
                                >
                                  View {item.verboseName}
                                </UncontrolledTooltip>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={`delete-${item.modelName}-${o.tableValues.id}`}
                                >
                                  Delete {item.verboseName}
                                </UncontrolledTooltip>
                              </td>
                            </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Collapse>
                  </div>
              ))}
                </CardBody>
              </Card>
            </Col>
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
