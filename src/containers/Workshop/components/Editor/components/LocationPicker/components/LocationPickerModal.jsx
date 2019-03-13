/* eslint-disable */
// Absolute Imports
import React, { PureComponent } from 'react';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

// Components
import LocationPicker from '../../LocationPicker';

class LocationPickerModal extends PureComponent {
  static defaultProps = {
    title: '',
    message: '',
    colored: false,
    header: false,
  };
  static propTypes = {
    t: PropTypes.func.isRequired,
  };
  constructor() {
    super();
    this.state = {
      modal: true,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const { t } = this.props;
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        size="lg"
      >
        <div id="tooltip" style={{ position: 'absolute', zIndex: 9999, 'pointer-events': 'none' }} />
        <div className="modal__header">
          <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
          <h3 className="page-title"> {t('Select position')}</h3>
          <h3 className="page-subhead subhead">
            {t('Scroll to zoom. Hold')} <code>CTRL</code>{t(' to pan. Click to select a region.')}
          </h3>
        </div>
        <div className="modal__body">
          <LocationPicker />
        </div>
        <ButtonToolbar className="modal__footer">
          <Button color="success" onClick={this.toggle}>Ok</Button>
          <Button onClick={this.toggle}>{t('Cancel')}</Button>{' '}
        </ButtonToolbar>
      </Modal>
    );
  }
}

export default withTranslation()(LocationPickerModal);
