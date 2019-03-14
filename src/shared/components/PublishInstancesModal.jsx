// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

// Components
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import Loader from './Loader';


class ModalComponent extends PureComponent {
  static propTypes = {
    action: PropTypes.instanceOf(Object),
    isOpen: PropTypes.bool,
    selected: PropTypes.instanceOf(Array),

    // Callbacks
    toggle: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    action: {
      loading: false,
      loaded: false,
      init: true,
    },
    isOpen: false,
    selected: [],

    // Callbacks
    onClose: () => {},
  };

  makePlural = arr => (arr.length === 1 ? '' : 's');

  render() {
    // Props
    const {
      action, isOpen, selected, toggle, onPublish, onClose, t,
    } = this.props;

    const {
      loading, loaded, error,
    } = action;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog--success"
        onClosed={onClose}
      >
        {loading ? (
          <Loader elemClass="load__card mb-3" />
          ) : (
            <>
              {loaded ? (
                <div className="text-center">
                  <div className="modal__header">
                    <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                    <i className="fal fa-fw fa-6x fa-check-circle" />
                    <h4 className="bold-text modal__title">{t('Published')}</h4>
                  </div>
                  <ButtonToolbar className="modal__footer">
                    <Button onClick={toggle}>{t('Continue editing')}</Button>
                  </ButtonToolbar>
                </div>
              ) : (
                <>
                  {error ? (
                    <div className="text-center">
                      <div className="modal__header">
                        <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                        <i className="fal fa-fw fa-6x fa-times-circle" />
                        <h4 className="bold-text modal__title">{t('Cannot publish')}</h4>
                      </div>
                      <div className="modal__body">
                        {error.message}
                      </div>
                      <ButtonToolbar className="modal__footer">
                        <Button onClick={toggle}>{t('Back to workshop')}</Button>
                      </ButtonToolbar>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="modal__header mb-4">
                        <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                        <i className="fal fa-fw fa-6x fa-globe-americas" />
                      </div>
                      <div className="modal__body">
                        <p>{t('This will publish the instance ')}{t(this.makePlural(selected))}
                          {' '}{t('with ID')}{this.makePlural(selected)}: {selected.join(', ')}.
                        </p>
                        <p>
                          {t('This will make this instance and any changes visible on the public site.')}
                          {t('  Do you want to continue?')}
                        </p>
                      </div>
                      <ButtonToolbar className="modal__footer">
                        <>
                          <Button onClick={toggle}>{t('Cancel')}</Button>{' '}
                          <Button
                            color="success"
                            onClick={onPublish}
                            disabled={loading}
                          >
                            {t('Publish')}
                          </Button>
                        </>
                      </ButtonToolbar>
                    </div>
                  )}
                </>
              )}
            </>
          )}
      </Modal>
    );
  }
}

export default withTranslation()(ModalComponent);
