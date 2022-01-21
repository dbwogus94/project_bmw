/*Non_unique 컬럼 0이면 중복 허용 안함*/
Show index from bmgroup_bookmark_map;
Show tables;
Show full columns from bmgroup_bookmark_map;

drop table bmgroup_bookmark_map;
drop table book_mark;
drop table bm_group;
drop table user;

drop table metro_timetable;
drop table metro_station;
drop table metro;
drop table migrations;


CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'user PK',
  `username` varchar(100) NOT NULL COMMENT '로그인 id',
  `name` varchar(100) NOT NULL COMMENT '이름',
  `password` varchar(200) NOT NULL COMMENT 'hash 비밀번호',
  `email` varchar(100) NOT NULL COMMENT '이메일',
  `access_token` varchar(300) DEFAULT NULL COMMENT '엑세스 토큰',
  `refresh_token` varchar(300) DEFAULT NULL COMMENT '재발급 토큰',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `active` varchar(2) NOT NULL DEFAULT 'Y' COMMENT '계정 활성화 여부',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-user-username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `bm_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'bmGroup PK',
  `bm_group_name` varchar(90) NOT NULL COMMENT 'BM그룹명',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `user_Id` int(11) NOT NULL COMMENT 'user PK',
  PRIMARY KEY (`id`),
  KEY `FK-user-bm_group` (`user_Id`),
  CONSTRAINT `FK-user-bm_group` FOREIGN KEY (`user_Id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `book_mark` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'bookMark PK',
  `check_column` varchar(100) NOT NULL COMMENT '조회, 중복체크용 컬럼:  String(routeId) + String(stationSeq) + String(stationId)',
  `ars_id` int(11) NOT NULL COMMENT '경기도: 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId)',
  `route_id` int(11) NOT NULL COMMENT '노선ID',
  `station_seq` int(11) NOT NULL COMMENT '경유정류소(역) 순서',
  `station_id` int(11) NOT NULL COMMENT '정유소(역) ID',
  `label` varchar(2) NOT NULL COMMENT '버스(B), 지하철(M) 구분용 라벨',
  `route_name` varchar(60) NOT NULL COMMENT '노선이름',
  `station_name` varchar(300) NOT NULL COMMENT '정류소(역) 이름',
  `direction` varchar(200) NOT NULL COMMENT '노선진행방향',
  `region_name` varchar(60) NOT NULL COMMENT '노선운행지역명',
  `district_cd` int(11) NOT NULL COMMENT '관할지역코드(1: 서울, 2: 경기, 3: 인천)',
  `district_name` varchar(6) NOT NULL COMMENT '관할지역명',
  `type` varchar(20) NOT NULL COMMENT 'Open API 종류',
  `start_station_name` varchar(300) NOT NULL COMMENT '기점정류소명',
  `end_station_name` varchar(300) NOT NULL COMMENT '종점정류소명',
  `route_type_cd` int(11) NOT NULL COMMENT '노선종류코드',
  `route_type_name` varchar(60) NOT NULL COMMENT '노선종류이름',
  `min_term` int(11) NOT NULL COMMENT '최소배차시간',
  `max_term` int(11) NOT NULL COMMENT '최대배차시간',
  `company_id` int(11) DEFAULT NULL COMMENT '운수업체ID',
  `company_name` varchar(200) NOT NULL COMMENT '운수업체명',
  `company_tel` varchar(50) NOT NULL COMMENT '운수업체 전화번호',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-book_mark-check_column` (`check_column`),
  UNIQUE KEY `UIX-book_mark-route_id-station_seq-station_id` (`route_id`,`station_seq`,`station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `bmgroup_bookmark_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'bmGroupBookMark 테이블 PK',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_ad` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `bm_group_id` int(11) NOT NULL COMMENT 'bmGroup PK',
  `book_mark_id` int(11) NOT NULL COMMENT 'bookMark PK',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-bmgroup_bookmark_map-bm_group_id-book_mark_id` (`bm_group_id`,`book_mark_id`),
  KEY `FK-book_mark-bmgroup_bookmark_map` (`book_mark_id`),
  CONSTRAINT `FK-bm_group-bmgroup_bookmark_map` FOREIGN KEY (`bm_group_id`) REFERENCES `bm_group` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK-book_mark-bmgroup_bookmark_map` FOREIGN KEY (`book_mark_id`) REFERENCES `book_mark` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `metro` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'metro pk',
  `metro_name` varchar(30) NOT NULL COMMENT '지하철 이름',
  `district_cd` int(11) NOT NULL COMMENT '지하철 운행 지역',
  `company` varchar(30) NOT NULL COMMENT '지하철 운행사',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `metro_station` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'metro_station pk',
  `station_name` varchar(120) NOT NULL COMMENT '지하철역 명',
  `station_cd` varchar(10) NOT NULL COMMENT '지하철역 코드',
  `station_fr_Code` varchar(20) NOT NULL COMMENT '지하철역 외부 코드',
  `station_seq` int(11) NOT NULL COMMENT '노선별 정류장 순서',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `metro_id` int(11) DEFAULT NULL COMMENT 'metro pk',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-metro_station-station_cd` (`station_cd`),
  UNIQUE KEY `UIX-metro_station-station_fr_Code` (`station_fr_Code`),
  KEY `FK-metro-metro_station` (`metro_id`),
  CONSTRAINT `FK-metro-metro_station` FOREIGN KEY (`metro_id`) REFERENCES `metro` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `metro_timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'metro_timetable pk',
  `train_no` varchar(10) NOT NULL COMMENT '열차번호',
  `arrive_time` varchar(12) NOT NULL COMMENT '역 도착시간',
  `left_time` varchar(12) NOT NULL COMMENT '역 출발시간',
  `origin_station_cd` varchar(10) NOT NULL COMMENT '기점 지하철역 코드',
  `origin_station_name` varchar(120) NOT NULL COMMENT '기점 지하철역 명',
  `dest_station_cd` varchar(10) NOT NULL COMMENT '종점 지하철역 코드',
  `dest_station_name` varchar(120) NOT NULL COMMENT '종점 지하철역 명',
  `week_tag` varchar(2) NOT NULL COMMENT '요일 구분 태그(평일:1, 토요일:2, 휴일/일요일:3)',
  `in_out_tag` varchar(2) NOT NULL COMMENT '운행방향 구분 태그(상행,내선:1, 하행,외선:2)',
  `express_tag` varchar(2) NOT NULL COMMENT '급행선 구분 태그(G:일반(general) D: 급행(direct))',
  `fl_flag` varchar(30) DEFAULT NULL COMMENT '플러그',
  `dest_station_cd2` varchar(30) DEFAULT NULL COMMENT '도착역 코드2',
  `branch_line` varchar(30) DEFAULT NULL COMMENT '지선',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `metro_station_id` int(11) DEFAULT NULL COMMENT 'metro_station pk',
  PRIMARY KEY (`id`),
  KEY `FK-metro_station-metro_timetable` (`metro_station_id`),
  CONSTRAINT `FK-metro_station-metro_timetable` FOREIGN KEY (`metro_station_id`) REFERENCES `metro_station` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;








