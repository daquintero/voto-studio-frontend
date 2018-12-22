import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'reactstrap';
import { togglePreviewTourMode } from '../../../../../redux/actions/tourActions';
import { changeMapWidth } from '../../../../../redux/actions/mapActions';
import { SidebarProps } from '../../../../../shared/prop-types/ReducerProps';

const PreviewPanel = ({ sidebar, dispatch, tours }) => {
  const handleTogglePreviewTourMode = () => {
    dispatch(togglePreviewTourMode());
    const sidebarWidth = sidebar.collapse ? 55 : 240;
    const tourPanelWidth = !tours.previewTourMode ? 0 : 300;
    dispatch(changeMapWidth(window.innerWidth - (sidebarWidth + tourPanelWidth)));
  };
  const wrapperClasses = classnames({
    'preview-panel__wrapper': true,
    'preview-panel__wrapper__hide': !tours.previewTourMode,
  });
  return (
    <div className={wrapperClasses}>
      <ButtonToolbar>
        <Button onClick={handleTogglePreviewTourMode} color="danger" className="preview-panel__tour-preview">
          <i className="fal fa-fw fa-times" /> Exit preview mode
        </Button>
      </ButtonToolbar>
    </div>
  );
};

PreviewPanel.propTypes = {
  tours: PropTypes.instanceOf(Object).isRequired,
  dispatch: PropTypes.func.isRequired,
  sidebar: SidebarProps.isRequired,
};

export default connect(state => ({
  tours: state.studio.tours,
  sidebar: state.sidebar,
}))(PreviewPanel);
