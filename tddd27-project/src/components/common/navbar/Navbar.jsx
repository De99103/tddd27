function Navbar() {
    return (
        <nav>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <p> NAME OF THE PAGE</p>
                    <a href="/">Logo</a>
                </div>
                <div className="navbar-menu">
                    <a href="/" className="navbar-link">Home</a>
                    <a href="/about" className="navbar-link">About</a>
                    <a href="/account" className="navbar-link">Account</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
