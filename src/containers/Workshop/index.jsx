// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  Container,
  Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';

// Components
import ContentFinder from './components/ContentFinder';


class Workshop extends PureComponent {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,

    // Router
    history: ReactRouterPropTypes.history.isRequired,

    // Translations
    t: PropTypes.func.isRequired,
  };

  getCurrentFilter = () => {
    const { workshop, t } = this.props;
    const { filter } = workshop.finder;

    if (workshop !== undefined) {
      return {
        type: {
          ...filter.currentItemOption,
          label: t(filter.currentItemOption.label),
        },
        user: {
          ...filter.currentUserOption,
          label: t(filter.currentUserOption.label),
        },
      };
    }
    return null;
  };

  buildUrl = (appLabel, modelName, id) => `/workshop/editor/${appLabel}/${modelName.toLowerCase()}/${id}/`;

  handleCreateItem = (e) => {
    e.persist();
    const { history } = this.props;
    const [appLabel, modelName] = e.currentTarget.dataset.modellabel.split('.');
    history.push(this.buildUrl(appLabel, modelName, 'new'));
  };

  handleEditItem = (e) => {
    e.persist();
    const { history } = this.props;
    const obj = JSON.parse(e.currentTarget.dataset.obj).tableValues;
    history.push(this.buildUrl(obj.appLabel, obj.modelName, obj.id));
  };

  render() {
    return (
      <Container className="mt-3">
        <Row>
          <ContentFinder
            editItem={this.handleEditItem}
            toggleDeleteItemModal={this.handleToggleItemDeleteModal}
            initialValues={this.getCurrentFilter()}
            enableReinitialize
          />
        </Row>
      </Container>
    );
  }
}


const mapStateToProps = (state) => {
  const { workshop } = state.studio;

  return {
    workshop,
  };
};

export default connect(mapStateToProps)(withTranslation()(Workshop));
