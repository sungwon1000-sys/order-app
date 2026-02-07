function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header__logo">COZY-커피 주문 앱</div>
      <nav className="header__nav">
        <button
          className={`header__nav-btn ${currentPage === 'order' ? 'header__nav-btn--active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button
          className={`header__nav-btn ${currentPage === 'admin' ? 'header__nav-btn--active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  );
}

export default Header;
