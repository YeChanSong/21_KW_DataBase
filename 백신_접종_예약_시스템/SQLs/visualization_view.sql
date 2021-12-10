# 날짜별 접종자 수 뷰
create view vaccine_date (date, count_1, count_2) as 
SELECT  date_format(reservation_date, '%Y-%m-%d')as day_date,count(case when inoculation_number = 1 then 1 end), count(case when inoculation_number = 2 then 1 end)
FROM vaccine_reservation 
group by  day_date ;

# 나이별 접종자 수 뷰
create view vaccine_age (age, count_1, count_2) as 
SELECT floor(age / 10) * 10 as ag, count(case when inoculation_number = 1 then 1 end), count(case when inoculation_number = 2 then 1 end)
FROM vaccine_reservation join user on vaccine_reservation.user_number =  user.User_number
group by  ag ;
#################### end of create view #################################