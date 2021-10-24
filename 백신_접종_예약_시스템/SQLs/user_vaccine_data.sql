use testDB;

# mysql -V 
# mysql  Ver 14.14 Distrib 5.7.35, for Linux (x86_64) using  EditLine wrapper

# 백신 테이블
CREATE TABLE VACCINE (
	vaccine_id	bigint	NOT NULL primary key,
	vaccine_name	VARCHAR(20)	NOT NULL,
	vaccine_manufacturer	VARCHAR(20)
);

# 국내에서 사용중인 백신 4종류 / 0의 경우 접종받지 않음.
INSERT INTO VACCINE values 
(1, "화이자", "Pfizer"),
(2, "모더나", "ModernaTX"),
(3, "얀센", "J&J"),
(4, "아스트라제네카", "AstraZeneca");

# 유저 테이블
CREATE TABLE USER (
	User_number	VARCHAR(20)	primary key,
	sublocation_id int unsigned not null,
	User_name	VARCHAR(20)	NOT NULL,
	age	bigint,
	Phone_num	VARCHAR(20)	,
	Vaccinated_Number	int,
    
    FOREIGN KEY (sublocation_id) REFERENCES SUBLOCATION(sublocation_id)
);

# 각 데이터는 임의 작성
INSERT INTO USER values
("950101-1122334", 1, "안미르", 27, "010-1111-1111", 1),
("921211-2202354", 2, "정한별", 30, "010-2011-1523", 1),
("881023-1108759", 3, "하해준", 34, "010-1341-1234", 1),
("841027-1273759", 4, "황보성진", 38, "010-7322-5476", 1),
("890831-2135739", 5, "탁혜림", 33, "010-9943-6670", 1),
("890227-2013675", 1, "제갈미란", 33, "010-4453-2670", 2),
("790831-2676759", 2, "장유리", 43, "010-8705-6440", 2),
("690201-2114513", 3, "유혜린", 53, "010-6434-6515", 2),
("650831-1676759", 4, "황병헌", 57, "010-6144-1915", 2),
("750831-1676759", 5, "배재범", 47, "010-6742-4561", 0),
("990731-2012043", 1, "백현", 23, "010-2036-3472", 0),
("960131-1278751", 2, "장혁", 26, "010-1217-5577", 0),
("950513-1173256", 3, "장이수", 27, "010-9210-2980", 1),
("950622-2016449", 4, "고유리", 27, "010-9535-7347", 0),
("900326-2115458", 5, "유란", 32, "010-2033-6363", 0),
("600813-1174582", 1, "김재용", 62, "010-2506-4573", 0),
("620831-1676759", 2, "안요한", 60, "010-4229-1801", 1),
("500330-1676759", 3, "김구름", 72, "010-9428-7306", 2),
("520405-2122476", 4, "하연우", 70, "010-3414-3577", 1),
("950308-2024124", 5, "오해영", 27, "010-3594-9359", 0);
