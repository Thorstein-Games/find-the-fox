import { asset } from '../../lib/fox/basePath';

const Header = ({ headerName, onClose }: { headerName: string; onClose: () => void }) => {
  return (
    <div className="sc-header">
      <div className="sc-header--team-name"> {headerName} </div>
      <div className="sc-header--close-button" onClick={onClose} onKeyDown={onClose}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/chat/close-icon.png')} alt="close icon" />
      </div>
    </div>
  );
};

export default Header;
