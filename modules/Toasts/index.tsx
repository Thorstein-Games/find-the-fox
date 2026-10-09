import { useEffect, useRef, useState } from 'react';
import Toast from 'react-bootstrap/Toast';

import { onToast } from '../../lib/fox/toastBus';
import type { Toast as ToastData } from '../../lib/fox/types';

const types = {
  info: 'rgb(50, 115, 153)',
  moreInfo: '#17181a',
  success: 'rgb(126, 185, 120)',
  error: '#e36c6e',
  warning: 'rgb(255, 131, 55)',
};

interface ToastsProps {
  /** Called with every toast as it arrives (the original passed its `key` arg for game reactions like confetti). */
  callback?: (toast: ToastData) => void;
}

const Toasts = ({ callback }: ToastsProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(
    () =>
      onToast((toast) => {
        setToasts((prev) => [...prev, toast]);
        callbackRef.current?.(toast);
      }),
    [],
  );

  const showToast = toasts.length > 0;

  return (
    <section
      style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
      }}
    >
      {toasts.map((toast, i) => (
        <Toast
          autohide
          animation
          key={i}
          delay={5000}
          show={showToast}
          onClose={() => setToasts((prev) => prev.filter((_, j) => i !== j))}
        >
          <Toast.Header>
            <span
              style={{
                height: '20px',
                width: '20px',
                borderRadius: '5px',
                marginRight: '5px',
                background: types[toast.type] || types.moreInfo,
              }}
            />
            <strong className="mr-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </section>
  );
};

export default Toasts;
