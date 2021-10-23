use testDB;

#-- 백신 접종 후기를 남긴 사용자 조회
select u.User_name, u.User_number
from USER as u
where u.User_number in (select User_number from VACCINE_COMMENT)
order by u.User_name;

#-- 각 구/동에 거주하는 사용자 조회
select l.location_name, s.sublocation_name, u.User_name, u.User_number
from USER as u inner join SUBLOCATION as s
	on u.sublocation_id = s.sublocation_id
 inner join LOCATION as l
	on s.L_id = l.location_id
order by l.location_name, s.sublocation_name;

#-- 백신을 예약한 사용자 정보, 백신 종류, 예약 날짜 조회
select u.User_name, u.User_number, v.Vaccine_name, vr.reservation_date
from USER as u, VACCINE as v, vaccine_reservation as vr
where u.User_number = vr.User_number and v.vaccine_id = vr.vaccine_id
order by vr.reservation_date;

#-- 