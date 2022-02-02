-- /* db 생성 */
-- CREATE DATABASE bmw_prod default CHARACTER SET UTF8;
-- CREATE DATABASE bmw_dev default CHARACTER SET UTF8;
-- CREATE DATABASE bmw_backup default CHARACTER SET UTF8;

-- /* role 생성 */
-- CREATE ROLE role_prod, role_dev;

-- /* role 권한 부여 */
-- grant select,insert,delete,update on bmw_prod.* to role_prod;
-- grant select,insert,delete,update on bmw_dev.* to role_dev;

-- /* 계정 생성 */
-- mysql> create user 'app_read'@'%' identified by 'Password1234!@';
-- mysql> create user 'app_write'@'%' identified by 'Password1234!@';

-- /* 계정에 권한 부여 */
-- grant role_prod to 'bmw_prod'@'%';
-- grant role_dev to 'bmw_dev'@'%';


/* 타임존 설정 에러시 적용:  */

/* TODO: 자동으로 적용되지 않는 경우 아래 방법으로 수동 설정
    1. $ mysql_tzinfo_to_sql  /usr/share/zoneinfo/Asia/Seoul KST
    2. $ mysql -u root -p
    3. USE mysql;
    4. SET global time_zone='Asia/Seoul';

    # 전역 설정 후 필요한 DB 접속하여 모두 적용
    5. SET time_zone='Asia/Seoul'

    [참고](https://hodubab.tistory.com/312)
*/

-- USE mysql;

-- START TRANSACTION;
-- INSERT INTO time_zone (Use_leap_seconds) VALUES ('N');
-- SET @time_zone_id= LAST_INSERT_ID();
-- INSERT INTO time_zone_name (Name, Time_zone_id) VALUES ('KST', @time_zone_id);
-- INSERT INTO time_zone_transition (Time_zone_id, Transition_time, Transition_type_id) VALUES
--  (@time_zone_id, -2147483648, 0)
-- ,(@time_zone_id, -1948782472, 1)
-- ,(@time_zone_id, -1830414600, 2)
-- ,(@time_zone_id, -767350800, 3)
-- ,(@time_zone_id, -498128400, 1)
-- ,(@time_zone_id, -462702600, 4)
-- ,(@time_zone_id, -451733400, 1)
-- ,(@time_zone_id, -429784200, 4)
-- ,(@time_zone_id, -418296600, 1)
-- ,(@time_zone_id, -399544200, 4)
-- ,(@time_zone_id, -387451800, 1)
-- ,(@time_zone_id, -368094600, 4)
-- ,(@time_zone_id, -356002200, 1)
-- ,(@time_zone_id, -336645000, 4)
-- ,(@time_zone_id, -324552600, 1)
-- ,(@time_zone_id, -305195400, 4)
-- ,(@time_zone_id, -293103000, 1)
-- ,(@time_zone_id, -264933000, 3)
-- ,(@time_zone_id, 547578000, 5)
-- ,(@time_zone_id, 560883600, 3)
-- ,(@time_zone_id, 579027600, 5)
-- ,(@time_zone_id, 592333200, 3)
-- ;
-- INSERT INTO time_zone_transition_type (Time_zone_id, Transition_type_id, Offset, Is_DST, Abbreviation) VALUES
--  (@time_zone_id, 0, 30472, 0, 'LMT')
-- ,(@time_zone_id, 1, 30600, 0, 'KST')
-- ,(@time_zone_id, 2, 32400, 0, 'JST')
-- ,(@time_zone_id, 3, 32400, 0, 'KST')
-- ,(@time_zone_id, 4, 34200, 1, 'KDT')
-- ,(@time_zone_id, 5, 36000, 1, 'KDT')
-- ;
-- COMMIT;

-- SET global time_zone='Asia/Seoul';

-- USE bmw_prod;
-- SET time_zone='Asia/Seoul';