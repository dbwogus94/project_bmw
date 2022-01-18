import { Route, useNavigate, Routes } from 'react-router-dom';
import Header from './components/shared/Header';
import MyBM from './pages/MyBM';
import EditBM from './pages/EditBM';
import { useAuth } from './context/AuthContext';
import Bus from './pages/Bus';
import Metro from './pages/Metro';
import Stop from './pages/Stop';
import Footer from './components/shared/Footer';

function App({ bmGroupService, busService, metroService, stopService }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // TODO: 개선필요
  const removeBMData = () => window.localStorage.removeItem('BMSearchResult');

  // MyBM 페이지 이동
  const onMyBM = () => {
    removeBMData();
    navigate('/');
  };
  // EditBM 페이지 이동
  const onEditBM = () => {
    removeBMData();
    navigate(`/bm-groups`);
  };
  // 로그아웃
  const onLogout = () => {
    if (window.confirm('로그아웃을 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  // bus 검색 페이지 이동
  const onBusSearch = () => {
    navigate('/buses');
  };
  // metro 검색 페이지 이동
  const onMetroSearch = () => {
    removeBMData();
    navigate('/metros');
  };
  // stop 검색 페이지 이동
  const onStopSearch = () => {
    removeBMData();
    navigate('/stops');
  };

  return (
    <div className="app">
      <Header //
        username={user.username}
        onMyBM={onMyBM}
        onEditBM={onEditBM}
        onLogout={onLogout}
        onBusSearch={onBusSearch}
        onMetroSearch={onMetroSearch}
        onStopSearch={onStopSearch}
      />
      <Routes>
        (
        <>
          {/* 6버전 exact 제거, 복수 라우팅시 /*를 마지막에 붙여야한다. */}
          <Route path="/" element={<MyBM bmGroupService={bmGroupService} busService={busService} />} />
          <Route path="/bm-groups" element={<EditBM bmGroupService={bmGroupService} busService={busService} />} />
          <Route path="/buses/*" element={<Bus busService={busService} bmGroupService={bmGroupService} />} />
          <Route path="/metros" element={<Metro metroService={metroService} />} />
          <Route path="/stops" element={<Stop stopService={stopService} />} />
        </>
        )
      </Routes>
      <Footer //
        isTransparent={true}
        backBtn={true}
        homeBtn={true}
        topBtn={true}
        navigate={navigate}
      ></Footer>
    </div>
  );
}

export default App;
