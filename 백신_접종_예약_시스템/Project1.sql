use tutorial;

create table Project1(
	idx int unsigned not null primary key auto_increment,
    creator_id varchar(100) not null,
    title varchar(100) not null,
    content MEDIUMTEXT not null,
    image varchar(255) ,
    passwd varchar(100) not null,
    hit int unsigned not null default 0
);

drop table Project1;

insert into Project1(creator_id, title, content,passwd, hit) 
values('user1','title1','hello','1234',0),
		('user2','title2','bye','1234',0);

select * from Project1;