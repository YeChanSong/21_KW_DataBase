# mysql 8.0

use testDB;

CREATE TABLE VACCINE_COMMENT (
	comment_id int unsigned not null primary key auto_increment,
    content text not null,
    vaccine_id bigint,
    User_number varchar(20),
    hospital_id int unsigned,
    vaccine_rating int not null,
    hospital_rating int not null,
    reservation_id bigint not null unique,
    
    FOREIGN KEY (vaccine_id) REFERENCES VACCINE(vaccine_id)  on update cascade  on delete set null,
    FOREIGN KEY (User_number) REFERENCES USERS(User_number)  on update cascade  on delete set null,
    FOREIGN KEY (hospital_id) REFERENCES HOSPITALS(hospital_id)  on update cascade  on delete set null,
    FOREIGN KEY (reservation_id) REFERENCES VACCINE_RESERVATION(reservation_id)  on update cascade
);

# 백신 후기 임의 데이터 삽입 (comment_id는 auto increment라 생략)
INSERT INTO VACCINE_COMMENT(content, vaccine_id, User_number, hospital_id, vaccine_rating, hospital_rating, reservation_id) values 
("맞고 이틀정도 열이났고 지금은 괜찮아요", 1, "950101-1122334", 1, 3, 3, 1),
("대기시간이 너무 길었어요", 2, "921211-2202354", 2, 2, 3, 2),
("딱히 부작용은 없었어요", 3, "881023-1108759", 2, 1, 3, 3),
("맞고나서 팔이 엄청 아팠습니다", 4, "841027-1273759", 4, 2, 2, 4),
("괜찮았어요", 1, "890831-2135739", 6, 4, 4, 5),
("부작용이 심해서 죽을것 같았어요", 2, "890227-2013675", 7, 1, 2, 6);

# 병원 백신 보유량 테이블
CREATE TABLE HOSPITAL_VACCINE (
	vaccine_id bigint not null,
    hospital_id int unsigned not null,
    vaccine_quantity bigint unsigned not null,
    
    FOREIGN KEY (vaccine_id) REFERENCES VACCINE(vaccine_id),
    FOREIGN KEY (hospital_id) REFERENCES HOSPITALS(hospital_id),
    PRIMARY KEY (vaccine_id, hospital_id)
);

# 모든 병원에 대한 모든 백신 보유량 데이터 삽입 (보유량은 랜덤 (0~99)) 
INSERT INTO HOSPITAL_VACCINE 
select vaccine_id, hospital_id, floor(rand() * 100) 
from VACCINE, HOSPITALS;