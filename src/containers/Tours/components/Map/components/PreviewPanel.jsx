import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { togglePreviewTourMode } from '../../../../../redux/actions/tourActions';

const PreviewPanel = (props) => {
  const wrapperClasses = classnames({
    'preview-panel__wrapper': true,
    'preview-panel__wrapper__hide': !props.tours.previewTourMode,
  });
  return (
    <div className={wrapperClasses}>
      <i
        className="fal fa-fw fa-eye tour-panel__tour-preview"
        onClick={() => props.dispatch(togglePreviewTourMode())}
        role="presentation"
      />{props.tours.previewTourMode}
    </div>
  );
};

PreviewPanel.propTypes = {
  tours: PropTypes.instanceOf(Object).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(state => ({
  tours: state.studio.tours,
}))(PreviewPanel);
