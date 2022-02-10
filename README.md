# project_bmw

## 소개
- 프로젝트 bmw는 Bus Metro Walk의 약자로 버스, 지하철을 사용하는 뚜벅이를 위한 심플한 대중교통 정보를 제공하는 프로젝트입니다.
- 프로젝트 기간: 2021.12 ~ 2022.1 (1차 완료)

## 기술 스택
- api server
  - <code>node.js</code> + <code>typescript</code>
  - <code>express</code>
  - <code>MySQL</code> + <code>typeorm</code>
  - <code>redis</code>
 
- front server
  - <code>nginx</code> + <code>react</code>
  
- Hosting Server(인프라)
  - Hardware Home PC: CPU(i5-5200U), RAM(8GB), SSD(128GB)
  - Hardware OS with <code>ubuntu</code>
  - <code>docker</code> with <code>docker-compose</code>

## 사용된 OPEN API
- 공공데이터 포털
  1. [경기도_버스노선 조회](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15080662)
  2. [경기도_버스도착정보 조회](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15080346)
  3. [서울특별시_노선정보조회 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000193)
  4. [서울특별시_버스도착정보조회 서비스](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15000314)
- 서울 열린데이터 광장
  1. [서울시 지하철역 정보 검색 (역명)](https://data.seoul.go.kr/dataList/OA-121/S/1/datasetView.do)
  2. [서울시 역코드로 지하철역별 열차 시간표 정보 검색](https://data.seoul.go.kr/dataList/OA-101/A/1/datasetView.do)
  
## REST API 
### Auth
- <code>POST</code> /api/auth/signup
  - 회원가입을 요청한다.
- <code>POST</code> /api/auth/signin
  - 로그인(Issue AccessToken, RefreshToken)을 요청한다.
- <code>GET</code> /api/auth/me
  - 엑세스토큰 확인을 요청한다.
- <code>GET</code> /api/auth/refresh
  - 엑세스토큰 재발급 요청한다.
- <code>GET</code> /api/auth/signout
  - 로그아웃을 요청한다.
 
### Bus
- <code>GET</code> /api/buses?routeName=:routeName
  - 버스 번호와 일치하는 버스 목록을 조회한다.
- <code>GET</code> /api/buses/arrival?type=:type&stationId=:stationId&routeId=:routeId&stationSeq=:stationSeq
  - 버스의 도착정보를 조회한다.
- <code>GET</code> /api/buses/:routeId?type=:type
  - 특정 버스의 상세정보 조회한다.
- <code>GET</code> /api/buses/:routeId/stations?type=:type
  - 특정 버스의 경유 정류소 목록을 조회한다.
  
### Metro
- <code>GET</code> /api/metros
  - 지하철 노선 목록을 조회한다.
- <code>GET</code> /api/metros?include=stations&q=stationName=:stationName
  - 역이름과 일치하는 역을 가진 모든 부모 노선을 조회한다.
  - <code>include=stations</code>옵션에 의해 응답 body에 자식 자원인 역 목록을 포함한다.
- <code>GET</code> /api/metros/:metroId/stations
  - 특정 노선의 역 목록을 조회한다.
- <code>GET</code> /api/metros/:metroId/stations/:stationId/arrival?inOutTag=:inOutTag
  - 특정 노선선 특정역의 도착시간을 조회한다.
   
### Station
- <code>GET</code> /api/stations?stationName=:stationName
  - 정류소 이름과 일치하는 정류소 목록을 조회한다.
- <code>GET</code> /api/stations/:stationId/buses?type=:type
  - 특정 정류소에 정차하는 버스 목록을 조회한다.

### Bm Groups (**모든 요청 쿠키에 엑세스토큰 필요.)
- <code>GET</code> /api/bm-groups
  - 사용자의 bm 그룹 목록을 조회한다.
- <code>GET</code> /api/bm-groups?include=book-marks
  - 사용자의 bm 그룹 목록을 조회한다.
  - <code>include=book-marks</code> 옵션에 의해 응답 body에 자식 자원인 북마크 목록을 포함한다.
- <code>GET</code> /api/bm-groups?include=book-marks&q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId
  - 사용자의 bm 그룹 목록을 조회한다.
  - <code>include=book-marks</code> 옵션에 의해 응답 body에 자식 자원인 북마크 목록을 포함한다
  - <code>q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId</code> 검색 옵션에 의해 일치하는 자원을 가져온다.
- <code>POST</code> /api/bm-groups
  - 사용자의 bm 그룹을 신규 추가한다.
- <code>DELETE</code> /api/bm-groups/:bmGroupId
  - 사용자의 특정 bm 그룹을 삭제한다.
  
### Book Mark (**모든 요청 쿠키에 엑세스토큰 필요.)
- <code>GET</code> /api/bm-groups/:bmGroupId/bookmakes?q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId
  - 사용자의 특정 bm 그룹의 북마크 목록을 조회한다.
  - <code>q=routeId=:routeId,stationSeq=:stationSeq,stationId=:stationId</code> 검색 옵션에 의해 일치하는 자원을 가져온다.
- <code>POST</code> /api/bm-groups/:bmGroupId/book-marks
  - 사용자의 특정 bm 그룹에 신규 북마크를 등록한다.
- <code>DELETE</code> /api/bm-groups/:bmGroupId/book-marks/:bookMarkId
  - 사용자의 특정 bm 그룹에 특정 북마크를 삭제한다.
 
