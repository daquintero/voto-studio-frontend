import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, Modal } from 'reactstrap';
import Loader from './Loader';

class ModalComponent extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    action: PropTypes.instanceOf(Object).isRequired,
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    publish: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render() {
    const {
      name, action, toggle, isOpen, publish, onClose,
    } = this.props;
    const { loading, loaded, error } = action;

    return (
      <>
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
                  <>
                    <div className="modal__header">
                      <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                      <i className="fal fa-fw fa-6x fa-check-circle" />
                      <h4 className="bold-text modal__title">Published {name}</h4>
                    </div>
                    <div className="modal__body">
                      Successfully published! To revert this action goto the <code>Changes</code> section.
                    </div>
                    <ButtonToolbar className="modal__footer">
                      <><Button onClick={toggle}>Continue editing</Button>{' '}</>
                    </ButtonToolbar>
                  </>
                ) : (
                  <>
                    {error ? (
                      <>
                        <div className="modal__header">
                          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                          <i className="fal fa-fw fa-6x fa-times-circle" />
                          <h4 className="bold-text modal__title">Cannot publish {name}</h4>
                        </div>
                        <div className="modal__body">
                          {error.message}
                        </div>
                        <ButtonToolbar className="modal__footer">
                          <><Button onClick={toggle}>Back to tour</Button>{' '}</>
                        </ButtonToolbar>
                      </>
                    ) : (
                      <>
                        <div className="modal__header">
                          <button className="lnr lnr-cross modal__close-btn" onClick={toggle} />
                          <i className="fal fa-fw fa-6x fa-globe-americas" />
                          <h4 className="bold-text modal__title">Publish {name}</h4>
                        </div>
                        <div className="modal__body">
                          This will update what the users can see on the main site. Are you sure you want to publish?
                        </div>
                        <ButtonToolbar className="modal__footer">
                          <>
                            <Button onClick={toggle}>Cancel</Button>{' '}
                            <Button
                              color="success"
                              onClick={!loaded ? publish : toggle}
                              disabled={loading}
                            >
                            Confirm
                            </Button>
                          </>
                        </ButtonToolbar>
                      </>
                    )}
                  </>
                )}
              </>
            )}
        </Modal>
      </>
    );
  }
}

export default connect()(ModalComponent);
