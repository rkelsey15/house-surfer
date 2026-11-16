import { NavLink } from 'react-router-dom'
import { CameraIcon, MapIcon, ProfileIcon, SurfIcon, TopIcon } from './Icons.jsx'

// Bottom tab bar on phones; on wide screens CSS moves it into the top bar.
export default function TabBar() {
  const tab = ({ isActive }) => (isActive ? 'tab on' : 'tab')
  return (
    <nav className="tabbar" aria-label="Main">
      <NavLink to="/" end className={tab}>
        <SurfIcon />
        Surf
      </NavLink>
      <NavLink to="/map" className={tab}>
        <MapIcon />
        Map
      </NavLink>
      <NavLink to="/snap" className="tab snap-tab" aria-label="Snap a house">
        <span className="snap">
          <CameraIcon />
        </span>
      </NavLink>
      <NavLink to="/top" className={tab}>
        <TopIcon />
        Top
      </NavLink>
      <NavLink to="/profile" className={tab}>
        <ProfileIcon />
        Profile
      </NavLink>
    </nav>
  )
}
