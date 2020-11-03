drop database if exists santas_bagDB;
create database santas_bagDB;
use santas_bagDB;

create table user (
	id int auto_increment not null primary key,
    email varchar(100) not null,
    password varchar(40)
);

create table gift (
	id int auto_increment not null primary key,
    name varchar(100) not null,
    category varchar(100),
    price integer,
    keywords varchar(200)
);

create table userCircle (
	id int auto_increment not null primary key,
    name varchar(100),
    age int,
    interests varchar(200),
    budget integer,
    userId int,
    giftId int,
    FOREIGN KEY (userId)
		REFERENCES user(id)
        ON UPDATE cascade
        ON DELETE cascade,
    FOREIGN KEY (giftId)
		REFERENCES gift(id)
        ON UPDATE SET NULL
        ON DELETE SET NULL
);

