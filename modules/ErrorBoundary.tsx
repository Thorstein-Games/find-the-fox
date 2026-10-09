import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { event } from '../utils/ga';

const ERROR_LOG_THROTTLE_MS = 5000;
let lastErrorLogTime = 0;

/**
 * Logs render errors. The original posted them to its own server's
 * /api/log-error; the site is static now, so they go to Google Analytics
 * as "exception" events instead.
 */
export class ErrorBoundary extends React.Component<{ children: ReactNode }> {
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, { extra: info });

    const now = Date.now();
    if (now - lastErrorLogTime < ERROR_LOG_THROTTLE_MS) {
      return;
    }
    lastErrorLogTime = now;

    try {
      event({
        action: 'exception',
        params: {
          description: `${error?.message ?? 'Unknown error'} @ ${typeof window !== 'undefined' ? window.location.pathname : ''}`,
          fatal: false,
        },
      });
    } catch (e) {
      console.error('Failed to log error', e);
    }
  }

  render() {
    return this.props.children;
  }
}
