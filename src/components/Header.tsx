import usgs_logo from '../assets/usgs_logo.png'
export default function Header() {
    return (
      <div id="header">
        <img src={usgs_logo} alt="usgs-logo"/>
        <div id="header-details">
          <span className="detail">{`Earthquakes > 2.5M`}</span>
          <span className="detail">{`Past day`}</span>
        </div>
      </div>
    );
  }