# mysql 8.0

use testDB;

# 백신 예약 테이블
CREATE TABLE vaccine_reservation(
	reservation_id	bigint	NOT NULL primary key auto_increment,
	reservation_date	datetime	NOT NULL,
	inoculation_number	bigint	NOT NULL,
	hospital_id	int unsigned not null,
	user_number	varchar(20)	NOT NULL,
	vaccine_id	bigint	NOT NULL,

	FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id),
	FOREIGN KEY(user_number) REFERENCES users(user_number),
	FOREIGN KEY(vaccine_id) REFERENCES vaccine(vaccine_id),

	UNIQUE(user_number, inoculation_number)
);

INSERT INTO vaccine_reservation(reservation_date, inoculation_number, hospital_id, user_number, vaccine_id) VALUES
('2021-10-17 13:00:00', 1, 1, "950101-1122334", 1),
('2021-10-18 13:00:00', 0, 2, "921211-2202354", 2),
('2021-10-19 13:00:00', 1, 3, "881023-1108759", 1),
('2021-10-19 15:00:00', 1, 4, "841027-1273759", 3),
('2021-10-19 15:00:00', 2, 6, "890831-2135739", 2),
('2021-10-19 13:00:00', 2, 6, "890227-2013675", 2),
('2021-10-20 13:00:00', 1, 7, "790831-2676759", 4),
('2021-10-21 13:00:00', 1, 8, "690201-2114513", 2),
('2021-10-20 13:00:00', 1, 9, "650831-1676759", 4),
('2021-10-18 13:00:00', 1, 1, "750831-1676759", 2);