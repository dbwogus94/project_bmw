/*Non_unique 컬럼 0이면 중복 허용 안함*/
Show index from bmgroup_bookmark_map;
Show tables;
Show full columns from bmgroup_bookmark_map;


drop table bmgroup_bookmark_map;
drop table book_mark;
drop table bm_group;
drop table user;

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
  `user_id` int NOT NULL COMMENT 'user PK',
  PRIMARY KEY (`id`),
  KEY `FK-user-bm_group` (`user_id`),
  CONSTRAINT `FK-user-bm_group` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
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
  `direction` varchar(200) NOT NULL COMMENT '노선진행방향',
  `type` varchar(20) NOT NULL COMMENT 'Open API 종류',
  `start_station_name` varchar(300) NOT NULL COMMENT '기점정류소명',
  `end_station_name` varchar(300) NOT NULL COMMENT '종점정류소명',
  `route_type_cd` int NOT NULL COMMENT '노선종류코드',
  `route_type_name` varchar(60) NOT NULL COMMENT '노선종류이름',
  `region_name` varchar(60) NOT NULL COMMENT '노선운행지역명',
  `district_cd` int NOT NULL COMMENT '관할지역코드(1: 서울, 2: 경기, 3: 인천)',
  `district_name` varchar(6) NOT NULL COMMENT '관할지역명',
  `min_term` int NOT NULL COMMENT '최소배차시간',
  `max_term` int NOT NULL COMMENT '최대배차시간',
  `company_id` int DEFAULT NULL COMMENT '운수업체ID',
  `company_name` varchar(200) NOT NULL COMMENT '운수업체명',
  `company_tel` varchar(50) NOT NULL COMMENT '운수업체 전화번호',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UIX-book_mark-check_column` (`check_column`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `bmgroup_bookmark_map` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'bmGroupBookMark 테이블 PK',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '생성일',
  `updated_ad` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '수정일',
  `bm_group_id` int NOT NULL COMMENT 'bmGroup PK',
  `book_mark_id` int NOT NULL COMMENT 'bookMark PK',
  PRIMARY KEY (`id`),
  KEY `FK-bm_group-bmgroup_bookmark_map` (`bm_group_id`),
  KEY `FK-book_mark-bmgroup_bookmark_map` (`book_mark_id`),
  CONSTRAINT `FK-bm_group-bmgroup_bookmark_map` FOREIGN KEY (`bm_group_id`) REFERENCES `bm_group` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK-book_mark-bmgroup_bookmark_map` FOREIGN KEY (`book_mark_id`) REFERENCES `book_mark` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;



/* 마이그레이션으로 추가 */
ALTER TABLE bmgroup_bookmark_map ADD UNIQUE `UIX-bmgroup_bookmark_map-bm_group_id-book_mark_id` (bm_group_id, book_mark_id);
