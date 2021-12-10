use testDB;
 # 본인 스키마로바꿔주세요!
#mysql 8.0
  
#--------------- crate table-----------------

#구 - 노원구 1개
create table LOCATION (
	location_id int unsigned not null primary key auto_increment,
    location_name varchar(10) not null UNIQUE
	);

# 동 - 지금은 노원구 소속 동만
create table SUBLOCATION (
	sublocation_id int unsigned not null primary key auto_increment,
    L_id int unsigned not null,
    sublocation_name varchar(10) not null UNIQUE,
    FOREIGN KEY (L_id) REFERENCES LOCATION(location_id)
	);


create table HOSPITALS (

	hospital_id int unsigned not null primary key auto_increment,
    SL_id int unsigned not null,
    hospital_name varchar(100) not null UNIQUE,
    hospital_location varchar(100) not null,
    hospital_point point not null,
    admin_password varchar(100) not null default '0000'
    
    FOREIGN KEY (SL_id) REFERENCES SUBLOCATION(sublocation_id)
	);
#-------------------------------------------






#--------------- insert data-----------------

#원래 csv로 하려 했으나, 인코딩 문제가 있어 셀에서 조작후 sql문으로 가져왔습니다.
insert into LOCATION
values (1,"노원구");

insert into SUBLOCATION
values 
('1','1','공릉동'),
('2','1','상계동'),
('3','1','월계동'),
('4','1','중계동'),
('5','1','하계동');

insert into HOSPITALS
values
(1,1,'공릉의원','서울특별시 노원구 공릉로 147 (공릉동 기업은행 공릉동지점)', ST_GeomFromText('POINT(127.0790699 37.62315364)')),
(2,1,'닥터큐의원','서울특별시 노원구 화랑로 425 (공릉동)', ST_GeomFromText('POINT(127.0746405 37.61755845)')),
(3,1,'동아의원','서울특별시 노원구 동일로197길 21 (공릉동 우성 빌딩)', ST_GeomFromText('POINT(127.0702353 37.62841041)')),
(4,1,'두리이비인후과의원','서울특별시 노원구 동일로 1077 (공릉동)', ST_GeomFromText('POINT(127.0724368 37.6260513)')),
(5,1,'에디홍즈의원','서울특별시 노원구 공릉로 173 (공릉동)', ST_GeomFromText('POINT(127.0797058 37.62531461)')),
(6,1,'박현숙소아과의원','서울특별시 노원구 동일로 1024 (공릉동)', ST_GeomFromText('POINT(127.0746435 37.62163369)')),
(7,1,'백내과의원','서울특별시 노원구 동일로 1003 (공릉동)', ST_GeomFromText('POINT(127.0746431 37.61970933)')),
(8,1,'신웅식 내과의원','서울특별시 노원구 동일로 1044 (공릉동)', ST_GeomFromText('POINT(127.07405 37.62336429)')),
(9,1,'신항외과의원','서울특별시 노원구 동일로 1098 (공릉동)', ST_GeomFromText('POINT(127.0722318 37.62796357)')),
(10,1,'연세이비인후과의원','서울특별시 노원구 동일로 1005 (공릉동 대정빌딩)', ST_GeomFromText('POINT(127.0745137 37.61992626)')),
(11,1,'연세화랑의원','서울특별시 노원구 노원로1길 67 (공릉동 대덕프라자)', ST_GeomFromText('POINT(127.0836355 37.62082409)')),
(12,1,'임지연소아청소년과의원','서울특별시 노원구 공릉로32길 56 (공릉동)', ST_GeomFromText('POINT(127.0822595 37.62170597)')),
(13,1,'정소아청소년과의원','서울특별시 노원구 화랑로51길 78 (공릉동 비선아파트상가)', ST_GeomFromText('POINT(127.0880854 37.62607876)')),
(14,1,'퀸스메디소아청소년과의원','서울특별시 노원구 동일로 1059 (공릉동)', ST_GeomFromText('POINT(127.0729873 37.62453111)')),
(15,1,'태릉마이크로병원','서울특별시 노원구 동일로 987 (공릉동)', ST_GeomFromText('POINT(127.0749418 37.61825474)')),
(16,1,'편한내과의원','서울특별시 노원구 동일로 1036 (공릉동)', ST_GeomFromText('POINT(127.0743539 37.6226061)')),
(17,1,'한국원자력의학원원자력병원','서울특별시 노원구 노원로 75 (공릉동)', ST_GeomFromText('POINT(127.0818105 37.62826722)')),
(18,1,'홍성환산부인과의원','서울특별시 노원구 화랑로 455 (공릉동)', ST_GeomFromText('POINT(127.0777417 37.61868842)')),
(19,2,'건강미소내과의원','서울특별시 노원구 노해로 480 (상계동 조광빌딩)', ST_GeomFromText('POINT(127.0614348 37.65417883)')),
(20,2,'구소아청소년과의원','서울특별시 노원구 한글비석로 474 (상계동 보람상가)', ST_GeomFromText('POINT(127.0654412 37.66482383)')),
(21,2,'굳쎈정형외과의원','서울특별시 노원구 동일로 1673 (상계동)', ST_GeomFromText('POINT(127.0549435 37.67785285)')),
(22,2,'기쁨소아청소년과의원','서울특별시 노원구 동일로216길 70 (상계동 상계주공4단지아파트)', ST_GeomFromText('POINT(127.0654954 37.65212421)')),
(23,2,'김기중내과의원','서울특별시 노원구 덕름로 781 (상계동)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(24,2,'김앤박내과의원','서울특별시 노원구 동일로 1392 (상계동 한일빌딩)', ST_GeomFromText('POINT(127.0613259 37.65305626)')),
(25,2,'김영순이비인후과의원','서울특별시 노원구 동일로 1551 (상계동 쌍용빌딩)', ST_GeomFromText('POINT(127.0568423 37.6668851)')),
(26,2,'김이비인후과의원','서울특별시 노원구 동일로 1669 (상계동 삼천리수락프라자)', ST_GeomFromText('POINT(127.0548927 37.67745607)')),
(27,2,'김재면내과의원','서울특별시 노원구 동일로 1533 (상계동 백산빌딩)', ST_GeomFromText('POINT(127.0572482 37.66536787)')),
(28,2,'남서울내과의원','서울특별시 노원구 노해로 488 (상계동 근호빌딩)', ST_GeomFromText('POINT(127.0621673 37.65432018)')),
(29,2,'노원 방사선과의원','서울특별시 노원구 동일로 1401 (상계동)', ST_GeomFromText('POINT(127.0603805 37.65357444)')),
(30,2,'노충희비뇨기과의원','서울특별시 노원구 동일로 1341 (상계동 장우빌딩)', ST_GeomFromText('POINT(127.0620912 37.64833385)')),
(31,2,'다솜이비인후과의원','서울특별시 노원구 동일로 1677 (상계동)', ST_GeomFromText('POINT(127.0549572 37.67816612)')),
(32,2,'에디아이여성병원','서울특별시 노원구 노원로 448 (상계동)', ST_GeomFromText('POINT(127.0670474 37.65647201)')),
(33,2,'문가정의학과의원','서울특별시 노원구 한글비석로48길 6 (상계동 한신2차상가)', ST_GeomFromText('POINT(127.0675843 37.6651652)')),
(34,2,'미래신경과의원','서울특별시 노원구 한글비석로24길 63 (상계동)', ST_GeomFromText('POINT(127.0735108 37.66318798)')),
(35,2,'미즈아이의원','서울특별시 노원구 동일로 1553 (상계동)', ST_GeomFromText('POINT(127.0567929 37.6670787)')),
(36,2,'미즈아이프라자산부인과의원','서울특별시 노원구 동일로 1669 (상계동)', ST_GeomFromText('POINT(127.0548927 37.67745607)')),
(37,2,'박가정의원','서울특별시 노원구 상계로27길 15 (상계동 석경빌딤)', ST_GeomFromText('POINT(127.0702207 37.65922602)')),
(38,2,'박성제내과의원','서울특별시 노원구 동일로 1545 (상계동)', ST_GeomFromText('POINT(127.0569742 37.66639103)')),
(39,2,'백소아과의원','서울특별시 노원구 동일로 1689 (상계동 하이베라스)', ST_GeomFromText('POINT(127.0549508 37.67912042)')),
(40,2,'베스트CK의원','서울특별시 노원구 동일로 1401 (상계동 상아빌딩)', ST_GeomFromText('POINT(127.0603805 37.65357444)')),
(41,2,'보람성모내과의원','서울특별시 노원구 노원로34길 88 (상계동)', ST_GeomFromText('POINT(127.0661245 37.66286026)')),
(42,2,'삼성편한내과의원','서울특별시 노원구 동일로 1380 (상계동)', ST_GeomFromText('POINT(127.0616539 37.65173594)')),
(43,2,'상계가정의원','서울특별시 노원구 상계로 306 (상계동)', ST_GeomFromText('POINT(127.0795874 37.670327)')),
(44,2,'상계심내과의원','서울특별시 노원구 동일로 1677 (상계동 제성빌딩)', ST_GeomFromText('POINT(127.0549572 37.67816612)')),
(45,2,'새하늘이비인후과의원','서울특별시 노원구 동일로 1548 (상계동)', ST_GeomFromText('POINT(127.0576238 37.6666627)')),
(46,2,'서울삼성 내과의원','서울특별시 노원구 동일로 1547 (상계동 시몬빌딩)', ST_GeomFromText('POINT(127.0569307 37.66655644)')),
(47,2,'서울연합의원','서울특별시 노원구 한글비석로 410 (상계동)', ST_GeomFromText('POINT(127.0712365 37.6612543)')),
(48,2,'선두외과의원','서울특별시 노원구 노해로 456 (상계동 동방빌딩)', ST_GeomFromText('POINT(127.058799 37.65358872)')),
(49,2,'선이비인후과의원','서울특별시 노원구 동일로 1372 (상계동 동보빌딩)', ST_GeomFromText('POINT(127.061798 37.6510886)')),
(50,2,'성모연합의원','서울특별시 노원구 상계로 193-25 (상계동 벽산빌딩)', ST_GeomFromText('POINT(127.0733998 37.66276395)')),
(51,2,'송내과의원','서울특별시 노원구 동일로 1669 (상계동)', ST_GeomFromText('POINT(127.0548927 37.67745607)')),
(52,2,'송영훈소아청소년과의원','서울특별시 노원구 동일로227길 86 (상계동 공무원연금OH점)', ST_GeomFromText('POINT(127.053177 37.66831457)')),
(53,2,'애플소아청소년과의원','서울특별시 노원구 동일로 1530 (상계동 다모아빌딤)', ST_GeomFromText('POINT(127.0580224 37.66506432)')),
(54,2,'연세기린소아청소년과의원','서울특별시 노원구 상계로1 길 38 (상계동)', ST_GeomFromText('POINT(127.0616932 37.65771078)')),
(55,2,'연세김&이소아과의원','서울특별시 노원구 노원로34길 112 (상계동 코털 빌딩)', ST_GeomFromText('POINT(127.0662859 37.6639695)')),
(56,2,'연세내과의원','서울특별시 노원구 노해로 492 (상계동)', ST_GeomFromText('POINT(127.0626788 37.65445728)')),
(57,2,'연세마디튼든의원','서울특별시 노원구 상계로 119 (상계동)', ST_GeomFromText('POINT(127.0678935 37.65791843)')),
(58,2,'연세정형외과의원','서울특별시 노원구 한글비석로 438 (상계동 연세정형외과)', ST_GeomFromText('POINT(127.0688909 37.66322977)')),
(59,2,'연세프렌즈소아청소년과의원','서울특별시 노원구 동일로 1392 (상계동)', ST_GeomFromText('POINT(127.0613259 37.65305626)')),
(60,2,'오라클이비인후과의원','서울특별시 노원구 상계로5길 32 (상계동 금호프라자)', ST_GeomFromText('POINT(127.0628411 37.65711339)')),
(61,2,'우리의원','서울특별시 노원구 상계로27길 7 (상계동 중양빌딩)', ST_GeomFromText('POINT(127.0705712 37.65891183)')),
(62,2,'우리이비인후과의원','서울특별시 노원구 상계로 320 (상계동 불암빌딩)', ST_GeomFromText('POINT(127.0807754 37.67029184)')),
(63,2,'우주가정의학과의원','서울특별시 노원구 덕름로 773 (상계동 상계이)시빌딤)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(64,2,'위앤장(We&Jang)이원표내과의원','서울특별시 노원구 동일로 1379 (상계동 다모아상가)', ST_GeomFromText('POINT(127.0608947 37.65180523)')),
(65,2,'유영근이비인후과의원','서울특별시 노원구 한글비석로 470 (상계동 동서기업빌딩)', ST_GeomFromText('POINT(127.0659659 37.66466352)')),
(66,2,'유정의원','서울특별시 노원구 한글비석로 416 (상계동 상계의원)', ST_GeomFromText('POINT(127.0706408 37.66170839)')),
(67,2,'윤내과의원','서울특별시 노원구 상계로3길 10 (상계동 한일빌딩)', ST_GeomFromText('POINT(127.0625487 37.65670446)')),
(68,2,'윤이비인후과의원','서울특별시 노원구 동일로 1379 (상계동 다모아상가)', ST_GeomFromText('POINT(127.0608947 37.65180523)')),
(69,2,'은빛가정의원','서울특별시 노원구 동일로245가길 41 (상계동)', ST_GeomFromText('POINT(127.0541436 37.6792131)')),
(70,2,'이가정의학과의원','서울특별시 노원구 동일로227길 86 (상계동 상록아파트상가)', ST_GeomFromText('POINT(127.053177 37.66831457)')),
(71,2,'이종익내과의원','서울특별시 노원구 노해로 494 (상계동 고려빌딩)', ST_GeomFromText('POINT(127.0630319 37.65453628)')),
(72,2,'이종호비뇨기과의원','서울특별시 노원구 동일로 1689 (상계동 하이베라스)', ST_GeomFromText('POINT(127.0549508 37.67912042)')),
(73,2,'이준희이비인후과의원','서울특별시 노원구 동일로 1529 (상계동 합동빌딩)', ST_GeomFromText('POINT(127.0573122 37.66509212)')),
(74,2,'이형일소아과의원','서울특별시 노원구 한글비석로 530 (상계동 주공12단지상가)', ST_GeomFromText('POINT(127.0594643 37.66592941)')),
(75,2,'장대국내과의원','서울특별시 노원구 노해로 452 (상계동)', ST_GeomFromText('POINT(127.0584261 37.65350513)')),
(76,2,'정가정의학과의원','서울특별시 노원구 수락산로 232 (상계동)', ST_GeomFromText('POINT(127.0529677 37.67106853)')),
(77,2,'제민통합내과정형외과의원','서울특별시 노원구 상계로 63-7 (상계동)', ST_GeomFromText('POINT(127.0618888 37.65650939)')),
(78,2,'참사랑의원','서울특별시 노원구 누원로 22 (상계동 수락리버시티4단지 크로바프라 자203호)', ST_GeomFromText('POINT(127.0530593 37.68711025)')),
(79,2,'천내과의원','서울특별시 노원구 동일로 1343 (상계동 동일프라자)', ST_GeomFromText('POINT(127.061994 37.64848789)')),
(80,2,'큐빅산부인과의원','서울특별시 노원구 동일로 1689 (상계동 하이베라스)', ST_GeomFromText('POINT(127.0549508 37.67912042)')),
(81,2,'파로스병원','서울특별시 노원구 노원로 416 (상계동)', ST_GeomFromText('POINT(127.0678866 37.65372151)')),
(82,2,'하나의원','서울특별시 노원구 동일로 1372 (상계동 동보빌딩)', ST_GeomFromText('POINT(127.061798 37.6510886)')),
(83,2,'하나이비인후과의원','서울특별시 노원구 동일로 1405 (상계동)', ST_GeomFromText('POINT(127.0601785 37.65383273)')),
(84,2,'한마음의원','서울특별시 노원구 덕름로 730 (상계동 불암대림아파트내 상가)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(85,2,'한상호내과의원','서울특별시 노원구 상계로 65 (상계동)', ST_GeomFromText('POINT(127.0622496 37.65635516)')),
(86,2,'한세외과의원','서울특별시 노원구 동일로 1624 (상계동)', ST_GeomFromText('POINT(127.055852 37.67335745)')),
(87,2,'함영백소아과의원','서울특별시 노원구 동일로 1361 (상계동 주공2단지상가)', ST_GeomFromText('POINT(127.061284 37.65006367)')),
(88,2,'현대가정의학과의원','서울특별시 노원구 동일로237나길 1 (상계동)', ST_GeomFromText('POINT(127.0534287 37.67373029)')),
(89,2,'희락서울가정의학과의원','서울특별시 노원구 수락산로 190 (상계동 회락상가)', ST_GeomFromText('POINT(127.0572739 37.67117707)')),
(90,3,'고려가정의학과의원','서울특별시 노원구 광운로 57 (월계동)', ST_GeomFromText('POINT(127.059562 37.62264078)')),
(91,3,'고성종의원','서울특별시 노원구 석계로9길 33 (월계동)', ST_GeomFromText('POINT(127.062645 37.61671574)')),
(92,3,'권내과의원','서울특별시 노원구 아들로 1 11 (월계동 삼호종합상가)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(93,3,'김희섭의원','서울특별시 노원구 석계로15길 9 (월계동)', ST_GeomFromText('POINT(127.0610415 37.62263394)')),
(94,3,'노원이서진내과의원','서울특별시 노원구 월계로 334 (월계동 그랑디오피스텔)', ST_GeomFromText('POINT(127.0576133 37.62901831)')),
(95,3,'드림이비인후과의원','서울특별시 노원구 월계로45길 21 (월계동 롯데캐술상가)', ST_GeomFromText('POINT(127.0506327 37.62659437)')),
(96,3,'맑고밝은이비인후과의원','서울특별시 노원구 아들로 31 (월계동 그랑빌@제주상가동)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(97,3,'맑은숨이비인후과의원','서울특별시 노원구 초안산로2라길 26 (월계동 월계센트럴아이파크아파 트)', ST_GeomFromText('POINT(127.0577451 37.62996413)')),
(98,3,'미래의원','서울특별시 노원구 초안산로5길 12 (월계동)', ST_GeomFromText('POINT(127.0517478 37.63256097)')),
(99,3,'삼성드림소아청소년과의원','서울특별시 노원구 다들로3길 15 (월계동 월계이마트)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(100,3,'서울의원','서울특별시 노원구 월계로 370 (월계동 회성프라자201-202호)', ST_GeomFromText('POINT(127.0610265 37.63097795)')),
(101,3,'성문의원','서울특별시 노원구 석계로 9 (월계동)', ST_GeomFromText('POINT(127.0644405 37.61569719)')),
(102,3,'예원 내과의원','서울특별시 노원구 광운로 45 (월계동)', ST_GeomFromText('POINT(127.0590531 37.62150201)')),
(103,3,'우리김소아과의원','서울특별시 노원구 마들로 31 (월계동 그랑빌주상가)', ST_GeomFromText('POINT(127.0697294 37.61825387)')),
(104,3,'우리들이비인후과의원','서울특별시 노원구 화랑로 337 (월계동)', ST_GeomFromText('POINT(127.0651698 37.6152402)')),
(105,3,'월계의원','서울특별시 노원구 월계로45가길 94 (월계동)', ST_GeomFromText('POINT(127.0517498 37.63211482)')),
(106,3,'위대한내과의원','서울특별시 노원구 화랑로 325 (월계동)', ST_GeomFromText('POINT(127.0640447 37.61495546)')),
(107,3,'유내과의원','서울특별시 노원구 마들로 31 (월계동 그랑빌아파트)', ST_GeomFromText('POINT(127.0697294 37.61825387)')),
(108,3,'조가정의학과의원','서울특별시 노원구 마들로 1 11 (월계동 삼호나상가 211 호)', ST_GeomFromText('POINT(127.0697294 37.61825387)')),
(109,3,'중양의원','서울특별시 노원구 월계로55길 4 (월계동 사승아파트)', ST_GeomFromText('POINT(127.0609146 37.63193296)')),
(110,3,'최소아과의원','서울특별시 노원구 마들로 1 11 (월계동)', ST_GeomFromText('POINT(127.0697294 37.61825387)')),
(111,3,'평화내과의원','서울특별시 노원구 화랑로 337 (월계동)', ST_GeomFromText('POINT(127.0651698 37.6152402)')),
(112,3,'한마음가정의원','서울특별시 노원구 초안산로5길 12 (월계동)', ST_GeomFromText('POINT(127.0517478 37.63256097)')),
(113,3,'현대내과의원','서울특별시 노원구 월계로45길 28 (월계동 월계아파트형공장)', ST_GeomFromText('POINT(127.0510707 37.62700506)')),
(114,4,'굿모닝소아청소년과의원','서울특별시 노원구 동일로204가길 12 (중계동)', ST_GeomFromText('POINT(127.0686683 37.63985729)')),
(115,4,'김경수내과의원','서울특별시 노원구 한글비석로 264 (중계동 중계그랜드프라자)', ST_GeomFromText('POINT(127.0771141 37.65094728)')),
(116,4,'김지호산부인과의원','서울특별시 노원구 덕름로83길 10 (중계동)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(117,4,'더웰내과의원','서울특별시 노원구 한글비석로 383 (중계동)', ST_GeomFromText('POINT(127.0730735 37.6591102)')),
(118,4,'바른이비인후과의원','서울특별시 노원구 동일로203가길 29 (중계동 브라운스톤중계)', ST_GeomFromText('POINT(127.0642845 37.63987723)')),
(119,4,'박상호의원','서울특별시 노원구 동일로 1280 (중계동 시영2단지상가)', ST_GeomFromText('POINT(127.0657236 37.64346879)')),
(120,4,'박화영소아청소년과의원','서울특별시 노원구 동일로203가길 29 (중계동 브라운스톤중계)', ST_GeomFromText('POINT(127.0642845 37.63987723)')),
(121,4,'베스트가정의학과의원','서울특별시 노원구 덕름로 694 (중계동 수암약국)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(122,4,'비앤비이비인후과의원','서울특별시 노원구 한글비석로 254 (중계동 대명프라자)', ST_GeomFromText('POINT(127.0770853 37.65040304)')),
(123,4,'삼성바른내과의원','서울특별시 노원구 한글비석로 270 (중계동)', ST_GeomFromText('POINT(127.0774039 37.65157142)')),
(124,4,'상계바른정형외과의원','서울특별시 노원구 한글비석로 383 (중계동 삼장타워프라자)', ST_GeomFromText('POINT(127.0730735 37.6591102)')),
(125,4,'상계연세소아과의원','서울특별시 노원구 한글비석로 384 (중계동 대호프라자)', ST_GeomFromText('POINT(127.0732396 37.65980816)')),
(126,4,'상계예일내과의원','서울특별시 노원구 한글비석로 384 (중계동 대호프라자)', ST_GeomFromText('POINT(127.0732396 37.65980816)')),
(127,4,'서울가정의학과의원','서울특별시 노원구 중계로14길 29 (중계동)', ST_GeomFromText('POINT(127.0819773 37.64982226)')),
(128,4,'서울산부인과의원','서울특별시 노원구 한글비석로 269 (중계동)', ST_GeomFromText('POINT(127.0767874 37.65171676)')),
(129,4,'서울정가정의학과의원','서울특별시 노원구 덕름로73길 18 (중계동)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(130,4,'세일정형외과의원','서울특별시 노원구 동일로203가길 29 (중계동 브라운스톤중계)', ST_GeomFromText('POINT(127.0642845 37.63987723)')),
(131,4,'스마트의원','서울특별시 노원구 노원로 330 (중계동 롯데마트중계점)', ST_GeomFromText('POINT(127.0709414 37.64679128)')),
(132,4,'시원한이비인후과의원','서울특별시 노원구 동일로204가길 34 (중계동 씨앤미빌딩)', ST_GeomFromText('POINT(127.0681722 37.64075014)')),
(133,4,'아름다운여성의원','서울특별시 노원구 한글비석로 383 (중계동 삼장프라자)', ST_GeomFromText('POINT(127.0730735 37.6591102)')),
(134,4,'안이비인후과의원','서울특별시 노원구 한글비석로 253 (중계동 세신프라자)', ST_GeomFromText('POINT(127.0763484 37.6504241)')),
(135,4,'엘림소아청소년과의원','서울특별시 노원구 한글비석로 250 (중계동 그린코아빌딩)', ST_GeomFromText('POINT(127.0770117 37.65002872)')),
(136,4,'유진상내과의원','서울특별시 노원구 한글비석로 269 (중계동 마들프라자)', ST_GeomFromText('POINT(127.0767874 37.65171676)')),
(137,4,'제이내과의원','서울특별시 노원구 한글비석로 365 (중계동)', ST_GeomFromText('POINT(127.0741671 37.65819479)')),
(138,4,'중계우리들의원','서울특별시 노원구 한글비석로 235 (중계동)', ST_GeomFromText('POINT(127.0763449 37.64879934)')),
(139,4,'중계월내과의원','서울특별시 노원구 한글비석로 253 (중계동)', ST_GeomFromText('POINT(127.0763484 37.6504241)')),
(140,4,'중계제일의원','서울특별시 노원구 노원로19길 31 (중계동 시영4단지상가)', ST_GeomFromText('POINT(127.0700517 37.64257321)')),
(141,4,'중계튼튼의원','서울특별시 노원구 동일로207길 18 (중계동 중계그린아파트 B상가 )', ST_GeomFromText('POINT(127.0633412 37.64490889)')),
(142,4,'중계하늘의원','서울특별시 노원구 동일로 1308 (중계동)', ST_GeomFromText('POINT(127.064166 37.64597435)')),
(143,4,'참내과의원','서울특별시 노원구 동일로203가길 29 (중계동 브라운스톤 중계)', ST_GeomFromText('POINT(127.0642845 37.63987723)')),
(144,4,'최정호이비인후과의원','서울특별시 노원구 한글비석로 384 (중계동 대호프라자)', ST_GeomFromText('POINT(127.0732396 37.65980816)')),
(145,4,'파티마의원','서울특별시 노원구 중계로 160 (중계동)', ST_GeomFromText('POINT(127.0813654 37.64940548)')),
(146,4,'하늘별소아청소년과의원','서울특별시 노원구 한글비석로 263 (중계동 성모빌딤)', ST_GeomFromText('POINT(127.0764707 37.65120979)')),
(147,5,'365열린의원','서울특별시 노원구 한글비석로 77 (하계동)', ST_GeomFromText('POINT(127.0704639 37.63755641)')),
(148,5,'고은소아청소년과의원','서울특별시 노원구 공름로59길 15 (하계동 웅천상가)', ST_GeomFromText('POINT(127.0732264 37.65524724)')),
(149,5,'기쁜가정의학과의원','서울특별시 노원구 노원로 257 (하계동)', ST_GeomFromText('POINT(127.0727634 37.64027112)')),
(150,5,'노원을지대학교병원','서울특별시 노원구 한글비석로 68 (하계동)', ST_GeomFromText('POINT(127.0699341 37.63643466)')),
(151,5,'늘사랑의원','서울특별시 노원구 노원로16길 15 (하계동 중계주공9단지아파트)', ST_GeomFromText('POINT(127.0743459 37.64238598)')),
(152,5,'하계성모의원','서울특별시 노원구 공름로58가길 14 (하계동)', ST_GeomFromText('POINT(127.0732264 37.65524724)'));

#-------------------------------------------




#--------------- serch gis data type -----------------
# 광운대 비마관 기준 위경도 - 37.61943808615074, 127.05981903146561
# 광운대학교 400m 이내 병원 질의
SELECT * 
FROM hospitals
WHERE ST_Distance_Sphere(hospital_point, ST_GeomFromText('POINT(127.059814426 37.619438086)')) <= 400
#-------------------------------------------
