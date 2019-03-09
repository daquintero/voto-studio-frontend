import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar, Modal } from 'reactstrap'; // eslint-disable-line
import Loader from './Loader';
import squashString from '../utils/squashString';

class ModalComponent extends PureComponent {
  static propTypes = {
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    item: PropTypes.instanceOf(Object),
    action: PropTypes.instanceOf(Object).isRequired,
  };

  static defaultProps = {
    item: {},
    isOpen: false,
  };

  buildUrl = (modelLabel, id) => {
    const [appLabel, modelName] = modelLabel.split('.');
    return `/workshop/editor/${appLabel}/${modelName.toLowerCase()}/${id}/`;
  };

  render() {
    const {
      toggle, isOpen, onClose, item, action,
    } = this.props;
    const { loading, loaded } = action;
    return (
      <>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          className="modal-dialog--success"
          onClosed={onClose}
          size="lg"
        >
          {loading ? (
            <Loader elemClass="load__card" />
            ) : (
              <>
                {loaded && (
                  <>
                    <h3 className="page-title">Detail view: {item.detailInfo[0].value} ({item.id})</h3>
                    <h3 className="page-subhead subhead">
                      <Link to={this.buildUrl(item.modelLabel, item.id)}>Edit this item</Link>
                    </h3>
                    <table>
                      <tbody>
                        {item.detailInfo.map(d => (
                      <>
                        {d.type === 'basic' && (
                          <tr key={d.name}>
                            <td className="text-capitalize text-right pr-3">{d.name.replace(/_/g, ' ')}:</td>
                            <td className="text-capitalize text-left">{squashString(d.value, 20)}</td>
                          </tr>
                        )}
                      </>
                    ))}
                      </tbody>
                    </table>
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
