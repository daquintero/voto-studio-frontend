// Absolute Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';


const {
  REACT_APP_USE_SENTRY: sentry,
} = process.env;


class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render
    // will show the fallback UI.
    return {
      hasError: true,
    };
  }

  static componentDidCatch(error, errorInfo) {
    if (sentry) {
      // Send error to Sentry
      Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key]);
        });
      });
      Sentry.captureException(error);
    }
  }

  render() {
    // State
    const {
      hasError,
    } = this.state;

    // Props
    const {
      children,
    } = this.props;

    if (hasError) {
      return sentry ? (
        <butoon onClick={() => Sentry.showReportDialog()}>Report feedback</butoon>
      ) : (
        <p className="text-center">Something went wrong</p>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
