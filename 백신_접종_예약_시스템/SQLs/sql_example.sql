use testDB;

#-- 백신 접종 후기를 남긴 사용자 조회
select u.User_name, u.User_number
from USER as u
where u.User_number in (select User_number from VACCINE_COMMENT)
order by u.User_name;

#-- 사용자 정보 조회 및 접종 후기 작성 여부 확인
select u.User_name, u.User_number, u.age, coalesce(content, "후기 미작성")
from USER as u left outer join VACCINE_COMMENT as vc
on u.User_number = vc.User_number;

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

#-- 백신 종류별 백신 접종 후기 갯수 조회
select v.vaccine_name, v.vaccine_manufacturer, COUNT(vc.content) as COMMENTS
from VACCINE as v inner join VACCINE_COMMENT as vc
on v.vaccine_id = vc.vaccine_id
group by v.vaccine_name, v.vaccine_manufacturer
order by v.vaccine_name;

#-- 가장 많이 예약된 백신 조회
select v.vaccine_name, COUNT(vr.reservation_id) as COUNT
from VACCINE as v inner join vaccine_reservation as vr
on v.vaccine_id = vr.vaccine_id
group by v.vaccine_name
order by COUNT desc
limit 1;

#-- 백신을 예약하지 않았고 접종도 받은 적 없는 사용자 신상 정보 나이 순 정렬
select User_number, User_name, age, Phone_num, Vaccinated_Number
from USER
where User_number not in (select User_number 
							from vaccine_reservation)
		and Vaccinated_Number=0
order by age;

#-- 백신 정보 입력
INSERT INTO VACCINE values 
(1, "화이자", "Pfizer"),
(2, "모더나", "ModernaTX"),
(3, "얀센", "J&J"),
(4, "아스트라제네카", "AstraZeneca");

#-- 각 백신 접종자의 평균 나이 소수점 2자리까지
select v.vaccine_name, round(AVG(u.age),2) as Average
from USER u, VACCINE v, vaccine_reservation vr
where u.User_number = vr.user_number and v.vaccine_id = vr.vaccine_id
group by v.vaccine_name
order by Average;

#-- 각 백신 접종자의 평균 나이가 38살 초과인 경우 조회
select v.vaccine_name, round(AVG(u.age),2) as Average
from USER u, VACCINE v, vaccine_reservation vr
where u.User_number = vr.user_number and v.vaccine_id = vr.vaccine_id
group by v.vaccine_name
having Average>38
order by Average desc;
