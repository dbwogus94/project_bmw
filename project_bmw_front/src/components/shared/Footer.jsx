const Footer = ({ isTransparent, backBtn, homeBtn, topBtn, navigate }) => {
  const onBackClick = () => {
    navigate(-1);
  };

  const onHomeClick = () => {
    navigate('/');
  };

  const handleTop = () => {
    const ul = document.querySelector('ul');
    ul.scrollTo({
      top: 0,
      behavior: 'smooth', // 올라가는 모션
    });
  };

  return (
    <>
      {
        <footer className={isTransparent ? 'footer' : ''}>
          {backBtn && (
            <div className="left-btn">
              <span onClick={onBackClick}>◀</span>
            </div>
          )}

          {homeBtn && (
            <div className="middle-btn">
              <span onClick={onHomeClick}>홈</span>
            </div>
          )}

          {topBtn && (
            <div className="right-btn">
              <span onClick={handleTop}>{'TOP'}</span>
            </div>
          )}
        </footer>
      }
    </>
  );
};

export default Footer;
