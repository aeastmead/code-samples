import React from 'react';
import { Notification } from '@bbnpm/bb-ui-framework';

const CopyStatus = {
  IDLE: 'IDLE',
  COPYING: 'COPYING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
} as const;

type CopyStatus =
  | typeof CopyStatus.IDLE
  | typeof CopyStatus.COPYING
  | typeof CopyStatus.ERROR
  | typeof CopyStatus.SUCCESS;

function useCopyToClipboard(): [isCopying: boolean, onCopy: (copyText: string) => void] {
  const [copyStatus, setCopyStatus] = React.useState<CopyStatus>(CopyStatus.IDLE);
  const prevStatusRef = React.useRef<CopyStatus>(copyStatus);

  React.useEffect(() => {
    if (copyStatus === prevStatusRef.current) {
      return;
    }

    prevStatusRef.current = copyStatus;
    if (copyStatus === CopyStatus.COPYING || copyStatus === CopyStatus.IDLE) {
      return;
    }

    if (copyStatus === CopyStatus.SUCCESS) {
      Notification.addSuccess({ message: 'Copied to Clipboard', timeout: 4000, dismissible: false });
    } else {
      Notification.addInfo({
        message: 'Copy failed',
        timeout: 4000,
        dismissible: false
      });
    }
    setCopyStatus(CopyStatus.IDLE);
  }, [copyStatus]);

  return React.useMemo(
    () => [
      copyStatus === CopyStatus.COPYING,
      (copyText: string) => {
        if (copyStatus === CopyStatus.COPYING) return;
        setCopyStatus(CopyStatus.COPYING);
        navigator.clipboard
          .writeText(copyText)
          .then(() => setCopyStatus(CopyStatus.SUCCESS))
          .catch((err: unknown) => {
            console.error(err);
            setCopyStatus(CopyStatus.ERROR);
          });
      }
    ],
    [copyStatus]
  );
}

export default useCopyToClipboard;
