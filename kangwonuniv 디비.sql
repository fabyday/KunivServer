show databases;

create database kangwon_univ;

show databases;
use kangwon_univ;
show tables;
create table users(
id char(15) not null,
name char(15) not null,
password char(15) not null,
primary key(id) 
)ENGINE = InnoDB default charset=utf8;


create table lecture(
lec_name char(20) not null,
instructor_id char(15) not null,
start_date date ,
end_date date ,
enable_attandance int default 0 check (enable_attandance >-1 and enable_attandance < 2),
foreign key(instructor_id) references users(id) on delete cascade,
primary key(instructor_id, lec_name) 
)ENGINE = InnoDB default charset=utf8;



create table student(
id char(15) not null,
lec_name char(20) not null,
instructor_id char(15) not null,
foreign key(id) references users(id),
foreign key(instructor_id, lec_name) references lecture(instructor_id, lec_name) on delete cascade
)ENGINE = InnoDB default charset=utf8;

create table timeTable(
lec_name char(20) not null,
instructor_id char(15) not null,
lecture_day char(3) not null,
location char(20) not null,
start_time time not null,
end_time time not null,
foreign key(instructor_id, lec_name) references lecture( instructor_id,lec_name) on delete cascade
)ENGINE = InnoDB default charset=utf8;

create table attandance(
lec_name char(20) not null,
instructor_id char(15) not null,
id char(15) not null,
check_date date,
check_time time, 
foreign key(instructor_id, lec_name) references lecture(instructor_id, lec_name) on delete cascade,
foreign key(id) references users(id) on delete cascade
)ENGINE = InnoDB default charset=utf8;


drop table attandance;
drop table timeTable;
drop table student;
drop table users;
drop table lecture;
drop table student;
use kangwon_univ;
show tables;
select * from users;

#id 추가
insert into users(id, name, password) select '1', '노', 'tt' where not exists(select * from users where id = '1' and name ='노');
insert into users(id, name, password) select '2', 'e', 'tt' where not exists(select * from users where id = '2' and name = 'e');
insert into users values('1','노','tt');


insert into lecture values('어렵게 코딩하기', '1', '2018-12-20', '2019-12-20', '0');
insert into lecture values('유지보수 못하게 하기', '1', '2018-12-20', '2019-12-20', '0');
insert into timeTable values('어렵게 코딩하기', '1', 'THU', '한빛관 지하', '18:00','20:00');
insert into timeTable values('어렵게 코딩하기', '1', 'SAT', '한빛관 5층', '18:00','20:00');
insert into timeTable values('유지보수 못하게 하기', '1', 'THU', '한빛관 9층', '08:00','12:00');
############################강의 생성#####################
insert into lecture(id, name, password) select '1', '노', 'tt' where not exists(select * from users where id = '1' and name ='노');


select * from timeTable;
select * from lecture;
select * from users;

select * from student;
insert into student values('2', '어렵게 코딩하기', '1');

##############모든 강의 보여주기
select lec.lec_name as classname, lec.instructor_id as instructor, tim.start_time as starttime, tim.end_time as endtime , lec.start_date as startdate, lec.end_date as enddate
from lecture as lec join timeTable as tim on (lec.lec_name = tim.lec_name and lec.instructor_id = tim.instructor_id); 


#학생 강의 참여
insert into student(id, lecture_name, instructor_id) select ?, ?, ? where not exists(select * from student as b where b.id = ? and b.lecture_name = ? and b.instructor_id = ? );

#학생 테이블
select u.id, l.lec_name as classname, t.location as classplace, l.instructor_id as instructor, t.lecture_day as day, l.start_date as startdate, l.end_date as enddate, t.start_time as starttime, t.end_time as endtime
from users as u, student as s, lecture as l, timeTable as t
where u.id = s.id and s.lec_name = l.lec_name and s.instructor_id = l.instructor_id and l.instructor_id = t.instructor_id and l.lec_name = t.lec_name and exists(select * from users where id = ? and password = ?);

select u.id, l.lec_name as classname, t.location as classplace, l.instructor_id as instructor, t.lecture_day as day, l.start_date as startdate, l.end_date as enddate, t.start_time as starttime, t.end_time as endtime
from users as u, student as s, lecture as l, timeTable as t
where u.id = s.id and s.lec_name = l.lec_name and s.instructor_id = l.instructor_id and l.instructor_id = t.instructor_id and l.lec_name = t.lec_name and exists(select * where u.id = '2' and u.password = 'tt');

#학생 - 출석체크
insert into attandance(lec_name, instructor_id, id, check_date, check_time) select ?, ?, ?, ?, ? where exists(select * from lecture as l where l.lecname = ? and l.instructor_id = ? and l.enable_attandance = 1);

#학생 출석 체크표 가져오기
select a.lec_name as classname, a.instructor_id as instructor, a.check_date as checkdate, a.check_time as time from attandance as a, student as s where s.id = a.id and a.lec_name = s.lec_name and a.instructor_id = s.instructor_id and exists(select * from users as uu where uu.id = ? and uu.password = ? ) and a.instructor_id = ? and a.instructor_id = ?;




#강사 강의 생성
insert into lecture(lec_name, instruct_id, start_date, end_date) select ?, ?, ?, ? where exists(select * from users as u where u.id = ? and u.password = ?);
insert into timeTable(lec_name, instructor_id, lecture_day, location, start_time, end_time) select ?, ?, ?, ?, ?, ? where exists(select * from users as u, lecture as l where u.id = ? and u.password = ? and l.lec_name = ?);

#강사- 강의 제거

SET SQL_SAFE_UPDATES = 0;
select * from
lecture;
select * from timeTable;


delete from lecture where '어렵게 코딩하기' = lec_name;








