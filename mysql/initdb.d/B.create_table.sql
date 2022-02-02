/* DB 변경 */ 
USE bmw_prod;
-- SET time_zone='Asia/Seoul';

/*Non_unique 컬럼 0이면 중복 허용 안함*/
-- Show index from bmgroup_bookmark_map;
-- Show databases;
-- Show tables;
-- Show full columns from bmgroup_bookmark_map;

/* 테이블 드랍 */
-- drop table bmgroup_bookmark_map;
-- drop table book_mark;
-- drop table bm_group;
-- drop table user;

-- drop table metro_timetable;
-- drop table metro_station;
-- drop table metro;
-- drop table migrations;

/* 테이블 백업 */
/* DB1 : 복사할 DB명,  DB2 : 원본 DB명 
-- CREATE TABLE DB1.테이블명 LIKE DB2.테이블명;
-- INSERT INTO DB1.테이블명 SELECT * FROM DB2.테이블명; */

-- 운영 데이터 => bmw_backup로 백업
-- create database bmw_backup;
-- CREATE TABLE bmw_backup.metro LIKE bmw_prod.metro;
-- CREATE TABLE bmw_backup.metro_station LIKE bmw_prod.metro_station;
-- CREATE TABLE bmw_backup.metro_timetable LIKE bmw_prod.metro_timetable;

-- INSERT INTO bmw_backup.metro SELECT * FROM bmw_prod.metro;
-- INSERT INTO bmw_backup.metro_station SELECT * FROM bmw_prod.metro_station;
-- INSERT INTO bmw_backup.metro_timetable SELECT * FROM bmw_prod.metro_timetable;


/* 테이블 생성 */
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'user PK',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `bm_group` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'bmGroup PK',
  `bm_group_name` varchar(90) NOT NULL COMMENT 'BM그룹명',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `user_Id` int NOT NULL COMMENT 'user PK',
  PRIMARY KEY (`id`),
  KEY `FK-user-bm_group` (`user_Id`),
  CONSTRAINT `FK-user-bm_group` FOREIGN KEY (`user_Id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `book_mark` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'bookMark PK',
  `check_column` varchar(100) NOT NULL COMMENT '조회, 중복체크용 컬럼:  String(routeId) + String(stationSeq) + String(stationId)',
  `route_id` int NOT NULL COMMENT '노선ID',
  `station_seq` int NOT NULL COMMENT '경유정류소(역) 순서',
  `station_id` int NOT NULL COMMENT '정유소(역) ID',
  `label` varchar(2) NOT NULL COMMENT '버스(B), 지하철(M) 구분용 라벨',
  `route_name` varchar(60) NOT NULL COMMENT '노선이름',
  `station_name` varchar(300) NOT NULL COMMENT '정류소(역) 이름',
  `direction` varchar(200) NOT NULL COMMENT '진행방향 기준 종점 정류장 이름',
  `region_name` varchar(60) NOT NULL COMMENT '노선운행지역명',
  `district_cd` int NOT NULL COMMENT '관할지역코드(1: 서울, 2: 경기, 3: 인천)',
  `type` varchar(20) NOT NULL COMMENT 'Open API 종류',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `ars_id` varchar(10) NOT NULL COMMENT '경기도 버스: 고유모바일번호(mobileNo) / 서울시 버스: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)를 통합으로 관리하는 컬럼',
  `in_out_tag` varchar(2) NOT NULL COMMENT '노선 상행(1) 하행(2) 구분 태그',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-book_mark-check_column` (`check_column`),
  UNIQUE KEY `UIX-book_mark-route_id-station_seq-station_id` (`route_id`,`station_seq`,`station_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3; 



CREATE TABLE `bmgroup_bookmark_map` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'bmGroupBookMark 테이블 PK',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_ad` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `bm_group_id` int NOT NULL COMMENT 'bmGroup PK',
  `book_mark_id` int NOT NULL COMMENT 'bookMark PK',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-bmgroup_bookmark_map-bm_group_id-book_mark_id` (`bm_group_id`,`book_mark_id`),
  KEY `FK-book_mark-bmgroup_bookmark_map` (`book_mark_id`),
  CONSTRAINT `FK-bm_group-bmgroup_bookmark_map` FOREIGN KEY (`bm_group_id`) REFERENCES `bm_group` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK-book_mark-bmgroup_bookmark_map` FOREIGN KEY (`book_mark_id`) REFERENCES `book_mark` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



CREATE TABLE `metro` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'metro pk',
  `metro_name` varchar(30) NOT NULL COMMENT '지하철 이름',
  `metro_cd` varchar(30) NOT NULL COMMENT '노선 구분 코드',
  `district_cd` int NOT NULL COMMENT '지하철 운행 지역',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-metro-metro_cd` (`metro_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;


CREATE TABLE `metro_station` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'metro_station pk',
  `station_name` varchar(120) NOT NULL COMMENT '지하철역 명',
  `station_cd` varchar(10) NOT NULL COMMENT '지하철역 코드',
  `station_fr_Code` varchar(20) NOT NULL COMMENT '지하철역 외부 코드',
  `station_seq` int NOT NULL COMMENT '노선별 정류장 순서',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `metro_id` int DEFAULT NULL COMMENT 'metro pk',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-metro_station-station_cd` (`station_cd`),
  UNIQUE KEY `UIX-metro_station-metro_id-station_cd-station_seq` (`metro_id`,`station_cd`,`station_seq`),
  CONSTRAINT `FK-metro-metro_station` FOREIGN KEY (`metro_id`) REFERENCES `metro` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=760 DEFAULT CHARSET=utf8mb3;


CREATE TABLE `metro_timetable` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'metro_timetable pk',
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
  `metro_station_id` int DEFAULT NULL COMMENT 'metro_station pk',
  PRIMARY KEY (`id`),
  KEY `FK-metro_station-metro_timetable` (`metro_station_id`),
  CONSTRAINT `FK-metro_station-metro_timetable` FOREIGN KEY (`metro_station_id`) REFERENCES `metro_station` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=283182 DEFAULT CHARSET=utf8mb3;

