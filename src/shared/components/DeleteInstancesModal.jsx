// Absolute Imports
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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
    onDelete: PropTypes.func.isRequired,
    onClose: PropTypes.func,
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
      action, isOpen, selected, toggle, onDelete, onClose,
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
                    <h4 className="bold-text modal__title">Deleted</h4>
                  </div>
                  <ButtonToolbar className="modal__footer">
                    <><Button onClick={toggle}>Continue editing</Button>{' '}</>
                  </ButtonToolbar>
                </div>
              ) : (
                <>
                  {error ? (
                    <div className="text-center">
                      <div className="modal__header">
                        <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                        <i className="fal fa-fw fa-6x fa-times-circle" />
                        <h4 className="bold-text modal__title">Cannot delete</h4>
                      </div>
                      <div className="modal__body">
                        {error.message}
                      </div>
                      <ButtonToolbar className="modal__footer">
                        <><Button onClick={toggle}>Back to workshop</Button>{' '}</>
                      </ButtonToolbar>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="modal__header mb-4">
                        <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                        <i className="fal fa-fw fa-6x fa-trash-alt" />
                      </div>
                      <div className="modal__body">
                        <p>This will delete the instance{this.makePlural(selected)}
                          {' '}with ID{this.makePlural(selected)}: {selected.join(', ')}.
                        </p>
                        <p>
                          This process is <span className="font-weight-bold">irreversible</span>.
                          {' '}Are you sure you want to continue?
                        </p>
                      </div>
                      <ButtonToolbar className="modal__footer">
                        <>
                          <Button onClick={toggle}>Cancel</Button>{' '}
                          <Button
                            color="danger"
                            onClick={onDelete}
                            disabled={loading}
                          >
                            Delete
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

export default ModalComponent;
