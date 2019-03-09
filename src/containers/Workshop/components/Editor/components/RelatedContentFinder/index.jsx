// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Modal,
} from 'reactstrap';

// Actions
import { TOGGLE_RELATED_CONTENT_FINDER } from '../../../../../../redux/actionCreators/workshopActionCreators';

// Components
import RelatedContentTable from './RelatedContentTable';


class LocationPicker extends PureComponent {
  static propTypes = {
    // Redux
    workshop: PropTypes.instanceOf(Object).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {}

  toggle = () => {
    this.props.dispatch({
      type: TOGGLE_RELATED_CONTENT_FINDER,
    });
  };

  handleOnClick = () => {};

  handleAdd = () => {};

  handleCancel = () => {
    this.toggle();
  };

  render() {
    // Props
    const {
      workshop,
    } = this.props;

    // Workshop
    const {
      relatedContentFinder,
    } = workshop;

    return (
      <Modal
        isOpen={relatedContentFinder.open}
        toggle={this.toggle}
        size="xl"
      >
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
          <h3 className="page-title ml-3">Find Content</h3>
          <h3 className="page-subhead subhead ml-3">
            Use the finder to find and add content
          </h3>
        </div>
        <div className="modal__body">
          <RelatedContentTable
            defaults={{ rowsPerPage: 5 }}
            initialValues={workshop.form.relatedFields && {
              type: workshop.form.relatedFields.map(f => f.option)[0],
              user: workshop.form.userOptions[0],
            }}
            enableReinitialize
          />
        </div>
      </Modal>
    );
  }
}

export default connect(state => ({
  workshop: state.studio.workshop,
}))(LocationPicker);
