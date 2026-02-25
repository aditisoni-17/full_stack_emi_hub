import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { label: "FOR BUSINESS", to: "/?tab=business" },
    { label: "PAY EMI", to: "/?tab=pay-emi" },
  ];

  return (
    <header className="navbar">
      <div className="app-container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="snapmint home">
          <span className="brand-icon">s</span>
          <span className="brand-text">snapmint</span>
        </Link>

        <div className="navbar__search" role="search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search for TV, Mobiles, Headphones & more"
            readOnly
          />
        </div>

        <nav className="navbar__actions" aria-label="top links">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/?tab=sign-up" className="navbar__signup-button">
            Sign-up
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
