import { useEffect, useRef } from 'react';
import type { ChangeEvent, ReactNode } from 'react';

interface PopupWindowProps {
  isOpen: boolean;
  children: ReactNode;
  onClickedOutside: (e: MouseEvent) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PopupWindow = ({ isOpen, children, onClickedOutside, onInputChange }: PopupWindowProps) => {
  const emojiPopup = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const onClickedOutsideRef = useRef(onClickedOutside);
  onClickedOutsideRef.current = onClickedOutside;

  useEffect(() => {
    const interceptLauncherClick = (e: MouseEvent) => {
      const clickedOutside = !emojiPopup.current?.contains(e.target as Node) && isOpenRef.current;
      if (clickedOutside) {
        onClickedOutsideRef.current(e);
      }
    };
    const scLauncher = document.getElementById('sc-launcher');
    scLauncher?.addEventListener('click', interceptLauncherClick);
    return () => {
      scLauncher?.removeEventListener('click', interceptLauncherClick);
    };
  }, []);

  return (
    <div className="sc-popup-window" ref={emojiPopup}>
      <div className={`sc-popup-window--cointainer ${isOpen ? '' : 'closed'}`}>
        <input onChange={onInputChange} className="sc-popup-window--search" placeholder="Search emoji..." />
        {children}
      </div>
    </div>
  );
};

export default PopupWindow;
