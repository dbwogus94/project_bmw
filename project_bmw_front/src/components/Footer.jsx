// import { useEffect, useState } from 'react';
const Footer = ({ backBtn, homeBtn, topBtn, history }) => {
  // const [ScrollY, setScrollY] = useState(0); // 스크롤값을 저장하기 위한 상태
  // const [BtnStatus, setBtnStatus] = useState(false); // 버튼 상태

  // useEffect(() => {
  //   console.log('ScrollY is ', ScrollY); // ScrollY가 변화할때마다 값을 콘솔에 출력
  // }, [ScrollY]);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleFollow);
  //   return () => {
  //     window.removeEventListener('scroll', handleFollow); // addEventListener 함수를 삭제
  //   };
  // });

  // // 스크롤 이벤트
  // const handleFollow = () => {
  //   setScrollY(window.pageYOffset); // window 스크롤 값을 ScrollY에 저장
  //   if (ScrollY > 100) {
  //     // 100 이상이면 버튼이 보이게
  //     setBtnStatus(true);
  //   } else {
  //     // 100 이하면 버튼이 사라지게
  //     setBtnStatus(false);
  //   }
  // };

  // 클릭하면 스크롤이 위로 올라가는 함수
  const handleTop = () => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth',
    // });
    // setScrollY(0); // ScrollY 의 값을 초기화
    // setBtnStatus(false); // BtnStatus의 값을 false로 바꿈 => 버튼 숨김
  };

  const onBackClick = () => {
    history.goBack();
  };

  const onHomeClick = () => {
    history.push('/');
  };

  return (
    <>
      {
        <footer>
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
