import { Switch, Route, useHistory } from 'react-router-dom';
import Header from './components/Header';
import MyBM from './pages/MyBM';
import EditBM from './pages/EditBM';
import { useAuth } from './context/AuthContext';
import Bus from './pages/Bus';
import Metro from './pages/Metro';
import Stop from './pages/Stop';
import Footer from './components/Footer';

function App({ bmGroupService, busService, metroService, stopService }) {
  const history = useHistory();
  const { user, logout } = useAuth();
  // TODO: 개선필요
  const removeBMData = () => window.localStorage.removeItem('BMSearchResult');

  // MyBM 페이지 이동
  const onMyBM = () => {
    removeBMData();
    history.push('/');
  };
  // EditBM 페이지 이동
  const onEditBM = () => {
    removeBMData();
    history.push(`/bmgroups`);
  };
  // 로그아웃
  const onLogout = () => {
    if (window.confirm('로그아웃을 하시겠습니까?')) {
      logout();
      removeBMData();
      history.push('/');
    }
  };

  // bus 검색 페이지 이동
  const onBusSearch = () => {
    history.push('/buses');
  };
  // metro 검색 페이지 이동
  const onMetroSearch = () => {
    removeBMData();
    history.push('/metros');
  };
  // stop 검색 페이지 이동
  const onStopSearch = () => {
    removeBMData();
    history.push('/stops');
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
      <Switch>
        (
        <>
          <Route exact path="/">
            <MyBM bmGroupService={bmGroupService} busService={busService} />
          </Route>
          <Route exact path="/bmgroups">
            <EditBM bmGroupService={bmGroupService} busService={busService} />
          </Route>
          <Route path="/buses">
            <Bus busService={busService} bmGroupService={bmGroupService} />
          </Route>
          <Route exact path="/metros">
            <Metro metroService={metroService} />
          </Route>
          <Route exact path="/stops">
            <Stop stopService={stopService} />
          </Route>
        </>
        )
      </Switch>
      <Footer //
        isTransparent={true}
        backBtn={true}
        homeBtn={true}
        topBtn={true}
        history={history}
      ></Footer>
    </div>
  );
}

export default App;
