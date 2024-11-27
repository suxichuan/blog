---
title: Oracle学习基础笔记
thumbnail: 'https://bitiful.hudi.space/posts/oraclebase/Oracle_banner.jpeg'
cover: 'https://bitiful.hudi.space/posts/oraclebase/Oracle_banner.jpeg'
description: 关系型数据库学习，其中包括数据库查询语言，控制语言，操作语言等，对表空间的理解，索引，视图等操作，有存储函数，存储过程
categories:
  - 数据库
tags:
  - Oracle
  - 关系型数据库
  - 表
  - 视图
  - 表空间
  - 序列
  - 函数
  - 索引
  - 触发器
  - 存储函数
  - 存储过程
abbrlink: 7b34242e
expires: 2023-08-31 23:59:59
swiper_index: 2
---


## PL/SQL developer安装

1、安装PL/SQL developer程序，安装目录不要出现中文。

2、配置客户端路径：点击PL/SQL developer界面的Configure->Preferences->oracle配置的connect属性配置。，和

指定Oracle Home 路径：D:\BaiduNetdiskDownload\client\instantclient_12_1

指定OCI library路径：D:\BaiduNetdiskDownload\client\instantclient_12_1\oci.dll

![image-20230714112548602](https://bitiful.hudi.space/posts/oraclebase/plsql_develop_1.png)

3、在 ORACLE 的以下安装目录中找到 tnsnames.ora 文件，拷贝到本地电脑的 D盘根目录。打开 tnsnames.ora 文件编辑配置oracle所在的服务器IP地址，设置环境变量 TNS_ADMIN 为 D 盘根目录( tnsnames.ora 所在目录 )

![image-20230714113841909](https://bitiful.hudi.space/posts/oraclebase/plsql_develop_2.png)

4、中文编码设置查看服务器端编码 

~~~sql
SQL:select userenv('language') from dual;
~~~

我实际查到的结果为:AMERICAN_AMERICA.ZHS16GBK
5、配置环境变量，计算机->属性->高级系统设置->环境变量->新建，设置变量名:NLS_LANG,变量值:第 1 步查到的值， 
AMERICAN_AMERICA.ZHS16GBK

## 1、数据类型

#### number 数值类型

~~~sql
number（5） 最大值99999 
number(5,2) 最大值999.99
~~~

#### 字符串类型

~~~text
char 固定长度的字符类型，最多存储2000个字节
varchar2 可变长度的字符类型，最多存储4000个字节
long  大文本类型。最大可以存储2个G
~~~

#### 日期类型

~~~sql
sysdate 日期时间型，精确到秒
timestamp 精确到秒的小数点后9位
~~~

#### 二进制类型

~~~sql
clob 存储字符,最大可以存4个G
blob 存储图像、声音、视频等二进制数据,最多可以存4个G
~~~

## 2、DDL操作

#### 用SQLPLUS连接Oracle的连接字符串

~~~sql
sqlplus system/local123@192.168.157.129:1521/orcl
sqlplus    账户名/密码@所在主机:端口号
sqlplus system/local123 as sysdba
~~~

#### 创建表空间

~~~sql
create tablespace xxxx
datafile 'c:\xxxx.dbf'
size 100m autoextend on next 10m
xxx表示表空间名
datafile 表示数据储存的物理文件名
size 用于设置表的初始大小
autoextend on 用于设置自动增长，如果存储量超过初始大小，则开始自动扩容
next 用于设置扩容的空间大小
create tablespace test;
datafile 'c:\test.dbf'
size 100m autoextend on next 10m
~~~

#### 创建用户

~~~sql
create user 用户名
identified by 密码
default tablespace 表空间名
~~~

#### 用户赋予权限

~~~
grant dba to 用户名  给xxx用户授予DBA权限
~~~

#### 表的创建

~~~sql
create table 表名（
字段名  字段类型[长度] [约束],
....
）
例如
create table users(
userid number primary key,
name varchar2(50)
);
create table t_owners(
id number primary key,
name varchar2(30),
addressid number,
housenumber varchar2(30),
watermeter varchar2(30),
adddate date,
ownertypeid number
)
create table t_ownertype(id number  primary key,name varchar2(30));
create table t_pricetable(id number primary key,price number(10,2),ownertypeid number,minnum number(10,2),maxnum number(10,2));
create table t_area(id number primary key,name varchar2(30));
create table t_operator(id number prmary key,name varchar2(30));
create table t_address(id number,name varchar2(30),areaid number,operatorid number);
create table t_account(id number,ownerid number,ownertypeid number,areaid number,year char(4),month char(2),num0 number,num1 number,usenum number,meteruserid number,meterdate date,money number(10,2),isfee char(1),feedate date,feeuserid number);
~~~

#### 表的修改

~~~sql
desc tablename 查看表的详情
#1、增加字段语法
alter table tablename add ( 字段名  字段类型 [default 默认值 ],字段名  字段类型 [default 默认值 ] );
alter table t_owners add ( level number default 1,email varchar2(255) );
#2、修改字段语法
alter table tablename modify(字段名 字段类型[default 默认值],字段名 字段类型[default 默认值]);
alter table t_owners modify(email varchar2(50));
#3、修改字段名
alter table tablename rename column 原字段名 to 新的字段名
alter table t_owners rename column email to mail;
#4、删除字段名
alter table tablename drop column 字段名；
alter table t_owners drop tel
#5、删除多个字段名
alter table tablename drop (字段1,字段2);

~~~

#### 清空表

~~~sql
truncate table tablename; 删除表再重构表
delete from tablename where 1=1; 表结构还在 主键自增的序列依然存在
~~~

#### 删除表

~~~sql
drop table tablename;
~~~

## 3、DML操作

#### insert操作

~~~sql

create table t_owners(
id number primary key,
name varchar2(30),
addressid number,
housenumber varchar2(30),
watermeter varchar2(30),
adddate date,
ownertypeid number
)
insert into T_OWNERS VALUES (1,'张三丰',1001,'2-2','5678',sysdate,1001);
insert into T_OWNERS VALUES (2,'苏赫',1002,'15-2','8975',sysdate,1001);
insert into T_OWNERS VALUES (3,'涂山红红',1002,'6-2','3456',sysdate,1001);
commit;
#create table t_ownertype(id number  primary key,name varchar2(30));
insert into t_ownertype(id,name)values(1001,'master');
insert into t_ownertype(id,name)values(1002,'levelmaster');
insert into t_ownertype(id,name)values(1003,'supermaster');

insert into t_ownertype(id,name)values(1001,'居民');
insert into t_ownertype(id,name)values(1002,'物业');
insert into t_ownertype(id,name)values(1003,'来兵');
commit;
#create table t_pricetable(id number primary key,price number(10,2),ownertypeid number,minnum #number(10,2),maxnum number(10,2));
insert into t_pricetable values(3,2.45,1001,0,5);
insert into t_pricetable values(4,3.45,1001,5,10);
insert into t_pricetable values(5,4.45,1001,10,null);
commit
#create table t_area(id number primary key,name varchar2(30));
insert into t_area values(1001,'East China');
insert into t_area values(1002,'North China');
insert into t_area values(1003,'NorthEast');
insert into t_area values(1004,'SouthWest');
insert into t_area values(1001,'双流区');
insert into t_area values(1002,'温江区');
insert into t_area values(1003,'青羊区');
insert into t_area values(1004,'青白江区');
insert into t_area values(1005,'武侯区');
commit;
#create table t_operator(id number primary key,name varchar2(30));
insert into t_operator values(1001,'mary');
insert into t_operator values(1002,'sueh');
insert into t_operator values(1003,'lili');
insert into t_operator values(1004,'harry');
insert into t_operator values(1001,'小明');
insert into t_operator values(1002,'小何');
insert into t_operator values(1003,'小苏');
insert into t_operator values(1004,'小红');
commit;
#create table t_address(id number primary key,name varchar2(30),areaid number,operatorid number);
insert into t_address values(1001,'quhouqu',1004,1001);
insert into t_address values(1002,'qingyangqu',1004,1002);
insert into t_address values(1003,'shuangliuqu',1004,1003);
insert into t_address values(1004,'wenjiangqu',1004,1004);
insert into t_address values(1001,'草金路',1004,1001);
insert into t_address values(1002,'尚楠湾',1004,1002);
insert into t_address values(1003,'江安河大桥',1004,1003);
insert into t_address values(1004,'崇教路',1004,1004);
commit;

#create table t_account(id number,ownerid number,ownertypeid number,areaid number,year char(4),month #char(2),num0 number,num1 number,usenum number,meteruserid number,meterdate date,money number(10,2),isfee #char(1),feedate date,feeuserid number);
insert into t_account values(1,1001,1001,1001,2023,06,43543,46456,3000,1001,sysdate,3232,0,sysdate,1001);
insert into t_account values(2,1002,1001,1002,2023,06,46456,50020,3564,1002,sysdate,3755,0,sysdate,1001);
insert into t_account values(3,1003,1002,1003,2023,06,82122,92131,10009,1003,sysdate,12000,0,sysdate,1001);
insert into t_account values(4,1001,1001,1001,2023,07,46456,50000,3544,1004,sysdate,3232,0,sysdate,1001);
insert into t_account values(5,1004,1001,1004,2023,06,60000,80000,20000,1001,sysdate,3232,0,sysdate,1001);
insert into t_account values(6,1003,1001,1003,2023,07,92131,100000,7869,1001,sysdate,3232,0,sysdate,1001);
insert into t_account values(7,1001,1001,1001,2023,08,50000,70000,20000,1003,sysdate,3232,0,sysdate,1001);
insert into t_account values(8,1002,1001,1002,2023,07,50020,70020,20000,1003,sysdate,20000,0,sysdate,1001);
commit;
#关联查询
select
  tad.id as addressid,
  tad.name as addressname,
  ta.name as areaname,
  top.name as operatorname
from t_address tad,t_area ta,t_operator top
where tad.areaid=ta.id and tad.operatorid=top.id;


select 
	t1.addressid,
   	t1.addressname,
    t2.name as operatoname,
   	t1.areaname
from (
   select 
   		tad.id as addressid,
   		tad.name as addressname,
    	tad.operatorid as operatorid,
   		ta.name as areaname
   from t_address tad left  join t_area ta on tad.areaid=ta.id
) t1 left join t_operator t2 on t1.operatorid= t2.id;
~~~

#### update数据修改

~~~sql
update 表名 set 字段=新值，字段=新值 where 条件;
update t_ownertype set id=1004,name='level1master' where id=1001;
commit;
~~~

#### delete删除数据

~~~sql
#delete from tablename where 条件
delete from t_ownertype where id =1004;
commit;
delete from t_ownertype where id >1001;
delete from t_ownertype where id in (1001,1002,1003);
commit;
~~~

> 注意增删改查操作完成后记得commit提交事务

#### 导入导出

数据的导出

~~~sql
expdp(impdp) 用户名/密码@连接地址:端口/服务名 [schemas|owner]=用户名 [dumpfile|file]=file1.dmp logfile=file1.log directory=testdata1 remap_schema=test:test;
exp:导出命令，导出时必写。
imp:导入命令，导入时必写,每次操作，二者只能选择一个执行。
username:导出数据的用户名，必写;
password:导出数据的密码，必写;
@:地址符号，必写;
SERVICENAME:Oracle的服务名，必写;
1521:端口号，1521是默认的可以不写,非默认要写;
schemas：导出操作的用户名;
dumpfile：导出的文件;
logfile:导出的日志文件,可以不写；
directory: 如果手工创建了转储文件和日志文件，通过本命令指定导出位置
remap_schema=源数据库用户名:目标数据库用户名,二者不同时必写，相同可以省略;

#例如
exp system/local123 full=y 整个数据库全部导出
exp system/local123 full=y [dumpfile|file]=a.dmp
exp lili/lili123 file=lili.dmp owner=lili;
按用户导入
imp lili/lili123 file=lili.dmp fromuserlili;
~~~

~~~sql
通过@F:\website\oraok\ot\11g\ot_drop.sql 导入F盘下的\website\oraok\ot\11g\目录下的ot_drop.sql文件
~~~

## 4、DML练习

~~~sql
select tac.areaid,sum(tac.money),ta.name from t_account tac,t_area ta where tac.areaid=ta.id group by tac.areaid,ta.name;
~~~

#### 简单查询

~~~sql
select * from t_owners;
#精确查询
select * from t_owners where watermeter=5678;
#模糊查询
select * from t_owners where name like '%张%';
#and的运算符 or运算符
select * from t_owners where name like '张%' or name like '%山%';
select * from t_owners where name like '_山__' or watermeter>5678;
#and运算符 or运算符混合使用
select * from t_owners where (name like '%苏%' or name like '%山%' ) and addressid =1002;
#范围查询
select * from t_account where num0>=50000 and num0<=70000;
select * from t_account where num0 between 50000 and 70000;
#空值查询
select *  from t_account isfee is null;
#查询非空值
select * from t_account isfee is not null;
#去重查询
select distinct addressid from t_owners ; 
#排序 默认升序asc desc降序
select * from t_account order by usenum desc;
#基于伪列的查询rowid rowid是保存数据在磁盘上的物理地址
select rowid,t.* from t_owners t;
#可以通过rowid来指定查询的某条数据
select rowid,t.* from t_owners t where rowid='AAASNcAABAAAVJpAAD';
#基于伪列的查询rownum rownum是基于查询出的结果集的序号
select rownum,t.* from t_owners t;
#聚合统计sum
select sum(usenum) from t_account where year='2023';
#平均值
select avg(usenum) from t_account where year='2023';
#最小值
select min(usenum) from t_account where year='2023';
#最大值
select max(usenum) from t_account where year='2023';
#统计个数
select count(id) from t_account where year='2023';
#分组查询
select areaid,sum(usenum) from t_account group by areaid;
#分组后在指定条件的查询
select areaid,sum(usenum) from t_account group by areaid having sum(usenum)>20000;
~~~

#### 连接查询

~~~sql
#多表内连接
select twn.*,ta.name addressname from t_owners twn,t_address ta where twn.addressid=ta.id;

#查询显示业主编号，业主名称、地址和业主类型
select twn.id,twn.name,ta.name addressname,tt.name ownertype from t_owners twn,t_ownertype tt,t_address ta where twn.ownertypeid=tt.id and twn.addressid=ta.id; 

#查询显示业主编号、业主名称、地址、所属区域、业主分类
select twn.id,twn.name,ta.name addressname,t1.name areaname,tt.name ownername from t_owners twn, t_area t1,t_address ta,t_ownertype tt where twn.addressid=ta.id and twn.ownertypeid=tt.id and ta.areaid=t1.id;

#查询显示业主编号、业主名称、地址、所属区域、收费员、业主分类
select twn.id,twn.name,ta.name addressname,t1.name areaname,top.name operatorname,tt.name ownertypename from t_owners twn,t_address ta,t_area t1,t_operator top,t_ownertype tt
where twn.addressid=ta.id and twn.ownertypeid=tt.id and ta.areaid=t1.id and ta.operatorid=top.id;

#查询业主的账务记录，显示业主编号、名称、年、月、金额。如果此业主没有账务记录也要列出姓名。
select twn.id,twn.name,tacc.year,tacc.month,tacc.money from t_owners twn left join t_account tacc on twn.id=tacc.ownerid; 

#左外连接
select twn.id,twn.name,tacc.year,tacc.month,tacc.money from t_owners twn,t_account tacc where twn.id=tacc.ownerid(+);

#右外连接
select twn.id,twn.name,tacc.year,tacc.month,tacc.money from t_owners twn,t_account tacc where twn.id(+)=tacc.ownerid;

~~~

#### 子查询

1. where子句中的子查询

   ~~~sql
   #单行子查询
   #查询 2023 年 6 月用水量大于平均值的台账记录
   select avg(usenum) from t_account where month=6;
   select usenum from t_account where usenum>(select avg(usenum) from t_account where month=6) and month=6;
   #多行子查询
   select * from t_address where id in (1001,1002);
   #查询地址含有“草”的业主的信息
   select id from t_address where name like '%草%';
   select * from t_owners where addressid in (select id from t_address where name like '%江安河%');
   
   #查询地址不含有“草”的业主的信息
   select id from t_address where name not like '%草%';
   select * from t_owners where addressid in (select id from t_address where name not like '%草%');
   
   select * from t_onwers where addressid not in(select id from t_address where name like '%草%');
   #
   ~~~

2. from子句中的子查询

   from子查询为多行子查询

   ~~~sql
   #查询显示业主编号，业主名称，业主类型名称，条件为业主类型为”居民”，使用子查询实现。
   select id,name,ownertypename from (select twn.*,tt.name ownertypename  from t_owners twn,t_ownertype tt  where twn.ownertypeid=tt.id and tt.name='居民')
   
   ~~~

3. select 子句中的子查询

   ~~~sql
   #列出业主信息，包括 ID，名称，所属地址。
   select id,name,(select name from t_address where id=addressid) addressname from t_owners;
   #列出业主信息，包括 ID，名称，所属地址，所属区域
   select id,name,
   (select name from t_address where id=addressid) addressname,
   (select (select name from t_area where id=areaid) from t_address where id=addressid) areaname
   from t_owners;
   ~~~

4. 分页查询

   使用rownum伪列来完成分页查询的功能。

   ~~~sql
   #分页查询台账表 T_ACCOUNT，每页 10 条记录
   select rownum,t.* from t_account t where rownum<=5; 
   #查询5到10的数据
   #子查询里rownum小于较大值,外面rownum大于较小值
   select rownum,t.* from (select rownum r,t.* from t_account t where rownum<=20) t where r<=5;
   ~~~

## 5、函数

#### 字符函数

~~~sql
select ascii('a') from dual;ASCII() 返回字符的十进制数;
select chr(97) from dual; chr() 返回十进制数的对应的字符;
select concat('aa','bb') from dual; 拼接两个字符串 || 
select 'aa' || 'bb' from dual;
select initcap('string') from dual;
select instr('adbc','a') from dual; 找出某个字符的位置
select instrb('abc','a') from dual;
select length('asdfgh') from dual; 给出字符串的长度
select lower('HELLO') from dual;将字符转化成小写
select upper('apple') from dual;将字符串转化成小写
#去除指定的字符串
select ltrim('##apple','#') from dual;
select rtrim('apple@@','@') from dual;
select trim('p' from 'apple') from dual;
select lpad('apple',10,'*') from dual;在字符串c1的左边用字符串c2填充，直到长度为10时为止
select rpad('apple',10,'#') from dual;
select replace('apple','p','bb') from dual;替换指定的字符串。
select substr('apple','1',2) from dual;从第一个位置开始截取，截取两位

~~~

#### 日期函数

~~~sql
sysdate 返回系统当前时间
select sysdate from dual;
add_months 给系统返回的时间加一天
select add_months(sysdate,1) from dual;
last_day 返回月份的最后一天
select last_day(add_months(sysdate,2)) from dual;
select months_between(sysdate,to_date('2023-04-30','yyyy-MM-dd')) from dual;

select localtimestamp from dual;返回会话中的日期和时间 
select current_timestamp from dual;
select greatest(sysdate,add_months(sysdate,2)) from dual; 返回两个时间中最晚的。时间戳最大的。
~~~

#### 数值函数

~~~sql
select  abs(value) from dual;绝对值
select ceil(value) from dual;大于或等于 value 的最小整数
select cos(value) from dual; 余弦
select cosh(value) from dual;反余弦
select exp(value) from dual;e的value次幂
select floor(value) from dual;小于或等于 value 的最大整数
select ln(value) from dual;value 的自然对数
select log(value) from dual;value 的以 10 为底的对数
select mod(value) from dual;求模
select power(v,p) from dual;v的p次幂
select round(v,p) from dual;按 precision 精度4舍5入
select sin(value) from dual;value的正弦
select sinh(value) from dual;value的反正弦
select sign(value) from dual;value 为正返回 1;为负返回-1;为 0 返回 0.
select tan(value) from dual;value的正切
select tanh(value) from dual;value的反正切
select vsize(value) from dual;返回value在ORACLE的存储空间大小
select sqrt(value) from dual;value的平方根
~~~

## 6、表空间巡检

#### 查询视图dba_data_files

~~~sql
file_name:表空间数据文件的位置
file_id:数据文件的ID
tablespace_name：表空间名称
bytes:表空间大小 字节显示
blocks:表示数据块数量
status:表示当前文件是否可用
relative_fno:相对文件号
autoextensible:是否自动扩展
maxbytes:如果扩展，最大扩展的大小
maxblocks：如果扩展，最大的数据块数
increment_by：最大增加的数据块数
user_bytes:文件中实际有用的字节数
user_blocks:文件中实际有用的数据块数

select file_name,tablespace_name,bytes/1024/1024 from dba_data_files;
select file_name,tablespace_name,sum(bytes)/1024/1024 from dba_data_files group by file_name,tablespace_name;

#查看表空间总容量和剩余容量和使用量。
select df.tablespace_name,SUM(df.bytes)/1024/1024 total,SUM(fs.bytes)/1024/1024 free,SUM(df.bytes-fs.bytes)/1024/1024 used from dba_data_files df,dba_free_space fs
where df.tablespace_name = fs.tablespace_name
group by df.tablespace_name having df.tablespace_name='WATERBOSS';

~~~

#### 查询视图dba_free_space

~~~sql
tablespace_name:表空间名称
file_id：表空间ID
block_id:开始块的ID
bytes:表示空闲的字节数
blocks:表示空闲的数据块数
relative_fno:相对文件的id
#查看表空间总容量和剩余容量和使用量。
select ds.tablespace_name,sum(ds.bytes)/1024/1024 total,sum(fs.bytes)/1024/1024 free,sum(ds.bytes)/1024/1024-sum(fs.bytes)/1024/1024 used from dba_data_files ds,dba_free_space fs where ds.tablespace_name=fs.tablespace_name group by ds.tablespace_name;
~~~

## 7、视图

概念：视图是一种数据库对象，是从一个或者多个数据表或视图中导出的虚表，视图所对应的数据并不真正地存储在视图中，而是存储在所引用的数据表中，视图的结构和数据是对数据表进行查询的结果。

优点：

- 简化数据操作：视图可以简化用户处理数据的方式。
- 着重于特定数据：不必要的数据或敏感数据可以不出现在视图中。
- 视图提供了一个简单而有效的安全机制，可以定制不同用户对数据的访问权限。
- 提供向后兼容性：视图使用户能够在表的架构更改时为表创建向后兼容接口。

#### 创建和修改视图

~~~sql
create [or replace] [force] view view_name
as subquery
[with check option]
[with read only]

[or replace]:若已经存在该视图，oracle自动重构该视图
[force]:不管基表是否存在，oracle都会自动创建该视图
suquery:子查询
[with check option]:插入和修改的数据行必须满足定义视图的约束
[with read only]:该视图上不能进行任何 DML 操作。

#create view dba_data_files_v1 as select file_name,tablespace_name, from dba_data_files;
create [or replace] view t_account_v1 as select id,ownerid,ownertypeid,areaid from t_account;
select * from t_account_v1;
#简单视图，可以进行增删改查记录
#update view_name set column=新值 where 条件
update t_account_v1 set areaid=1002 where id=5;
commit;
select * from t_account_v1;
~~~

视图其实是一个虚拟的表，它的数据其实来自于表。如果更改了视图的数据，表的数据也自然会变化，更改了
表的数据，视图也自然会变化。

#### 删除视图

~~~sql
drop view view_name;
~~~

#### 带检查约束的视图

~~~sql
create or replace view t_account_v2 
as
select id,ownerid,ownertypeid,areaid from t_account where areaid=1001
with check option;

#update t_account_v2 set areaid=1002 where id=1;
#会报错view WITH CHECK OPTION where-clause violation
~~~

#### 只读视图的创建与使用

指定 WITH READ ONLY 选项，这样创建的视图就是一个只读视图

~~~sql
create or replace view t_account_v2
as
select id,ownerid,ownertypeid,areaid from t_account where areaid=1001
with read only;
update t_account_v2 set areaid=1002 where id=1;
#修改只读视图出现：cannot perform a DML operation on a read-only view
~~~

#### 创建不存在基表的视图

有的时候，创建视图时的表可能并不存在，但是以后可能会存在，此时需要创建这样的视图，需要添加 FORCE 选项

~~~sql
create or replace force view t_temp_vi 
as
select * from t_temp;
~~~

#### 查询所有的视图

~~~sql
select * from user_views;
~~~

#### 复杂视图的创建与使用

复杂视图，就是视图的 SQL 语句中，有聚合函数或多表关联查询。

~~~sql
#1、多表关联查询的视图
create or replace force view twn_tt_v1
as
select twn.*,tt.name as ownertypename from t_owners twn,t_ownertype tt where twn.ownertypeid=tt.id(+)
with check option;
select * from twn_tt_v1;
update twn_tt_v1 set name='suhe' where id=1002;
#可以修改主表的数据不可以修改关联表的数据
#2、分组聚合统计查询的视图
select * from t_account;
create or replace force view month_per_num_2023
as
select year,month,sum(usenum) sumuse from t_account group by year,month group by year,month;
select * from month_per_num_2023;
~~~

#### 物化视图

​	视图是一个虚拟表（也可以认为是一条语句），基于它创建时指定的查询语句返回的结果集。每次访问它都会导致这个查询语句被执行一次。为了避免每次访问都执行这个查询，可以将这个查询结果集存储到一个物化视图（也叫实体化视图）。物化视图与普通的视图相比的区别是物化视图是建立的副本，它类似于一张表，需要占用存储空间。而对一个物化视图查询的执行效率与查询一个表是一样的。

- 创建物化视图语法

~~~sql
create meterialized view view_name
[build immediate | build deferred]
refresh [fast | complete | force]
[
 on [commit | demand]    | start with (start_time) next (next_time)
]
as
subquery

build immediate:是在创建物化视图的时候就生成数据。
build dererred:则在创建时不生成数据，以后根据需要再生成数据。默认为 build immediate。
refresh:指当基表发生了 DML 操作后，物化视图何时采用哪种方式和基表进行同步。[fast | complete|force] fast采用增量刷新，只刷新自上次刷新以后进行的修改。complete刷新对整个物化视图进行完全的刷新。force方式，则 Oracle 在刷新时会去判断是否可以进行快速刷新，如果可以则采用 fast 方式，否则采用 complete的方式，force 是默认的方式。
刷新模式：on commit和on demand两种， on demand指需要手动刷新物化视图（默认）。on commit指在基表发生commit操作时自动刷新.

~~~

- 创建手动刷新的物化视图

~~~sql
create meterialized view mv_v1
[build immediate
refresh force on demand]
as 
select twn.*,ta.name as addressname from t_owners twn,t_address ta where twn.addressid=ta.id(+);

insert into t_owners VALUES (1004,'lili',1003,'6-1','7895',sysdate,1002);
commit;
select * from mv_v2;
#物化视图中没有新插入的数据。
#PL/SQL执行
begin
DBMS_MVIEW.refresh('mv_v2','C');
end;
#或者在命令行执行
EXEC DBMS_MVIEW.refresh('mv_v2','C');
#DBMS_MVIEW.refresh 实际上是系统内置的存储过程
~~~

- 创建自动刷新的物化视图

~~~sql
create materialized view mv_v3
build immediate
refresh force
on commit
as
select twn.*,ta.name as addressname from t_owners twn,t_address ta where twn.addressid=ta.id(+);

insert into t_owners VALUES (1005,'longlong',1002,'6-2','1234',sysdate,1001);
commit;
select * from mv_v3;
~~~

- 创建时不生成数据的物化视图

~~~sql
create materailized view mv_v4
build deferred
refresh force on commit
as
select twn.*,ta.name as addressname from t_owners twn,t_address ta where twn.addressid=ta.id(+);
select * from mv_v4;

begin
DBMS_MVIEW.refresh('mv_v4','C');
end;
insert into t_owners VALUES (1006,'chuan',1001,'7-2','7534',sysdate,1003);
commit;
select * from mv_v4;
~~~

- 删除物化视图

~~~
drop materialized view view_name;
~~~

- 创建增量刷新的物化视图

如果创建增量刷新的物化视图，必须首先创建物化视图日志

~~~sql
#创建物化视图日志
create materialized view log on t_owners with rowid;
create materialized view log on t_address with rowid;

create materialized view mv_v5
build immediate
refresh fast
on commit
as
select twn.*,twn.rowid as twnrowid,ta.rowid as tarowid,ta.name as addressname from t_owners twn,t_address ta where twn.addressid=ta.id(+);

insert into t_owners VALUES (1007,'su',1002,'8-2','3455',sysdate,1002);
commit;
#创建增量刷新的物化视图，必须：
#1、创建物化视图中涉及表的物化视图日志。
#2、在查询语句中，必须包含所有表的rowid(以rowid方式建立物化视图日志)
~~~

## 8、序列

序列是 ORACLE 提供的用于产生一系列唯一数字的数据库对象。

#### 创建序列语法

~~~sql
create sequence sequence_name;
~~~

通过序列的伪列来访问序列的值,NEXTVAL 返回序列的下一个值,CURRVAL 返回序列的当前值

>注意：我们在刚建立序列后，无法提取当前值，只有先提取下一个值时才能再次提取当前值。

~~~sql
create sequence sequence_one;
select sequence_one.nextval from dual;
select sequence_one.currval from dual;
~~~

#### 创建复杂序列

- 语法：

~~~sql
create sequence sequence_one
[increment by n] #递增的序列值是n 如果n是正数就递增,如果是负数就递减 默认是1
[start with n] #开始的值,递增默认是 minvalue 递减是 maxvalue
[{maxvalue n|nomaxvalue}] #最大值
[{minvalue n|nominvalue}]#最小值
[{cycle | nocycle}] #循环
[{cache n | nocache}] #分配并存入到内存中
~~~

- 创建有最大值的非循环序列

~~~sql
create sequence seq_1
increment by 20
maxvalue 100
minvalue 20
nocycle;
select seq_1.nextval from dual;
~~~

- 有最大值的循环序列

~~~sql
create sequence seq_2
increment by 20
maxvalue 100
minvalue 20
cycle
cache 4;
~~~

>注意：CACHE <= CEIL((MAXVALUE - MINVALUE) / ABS(INCREMENT))
>例如：cache <=ceil(100-20)/abs(20)

#### 修改和删除序列

修改序列：使用 ALTER SEQUENCE 语句修改序列，不能更改序列的 STARTWITH 参数

~~~sql
ALTER SEQUENCE 序列名称 MAXVALUE 5000 CYCLE;
alter sequence seq_1 maxvalue 300 cycle cache 14;
~~~

删除序列

~~~sql
DROP SEQUENCE 序列名称;
drop sequence seq_1;
~~~

## 9、同义词

​	同义词实质上是指定方案对象的一个别名。通过屏蔽对象的名称和所有者以及对分布式数据库的远程对象提供位置透明性，同义词可以提供一定程度的安全性。同时，同义词的易用性较好，降低了数据库用户的 SQL 语句复杂度。

​	同义词允许基对象重命名或者移动，这时，只需对同义词进行重定义，基于同义词的应用程序可以继续运行而无需修改。

​	同义词本身不涉及安全，当你赋予一个同义词对象权限时，你实质上是在给同义词的基对象赋予权限，同义词只是基对象的一个别名。

#### 创建与使用同义词

~~~sql
create [public] SYNONYM synonym for object
synonym:创建的同义词的名称
object:表示表，视图，序列等我们要创建同义词的对象的名称.创建共有的同义词，以另外的用户登陆，也可以使用公有同义词
create public SYNONYM twn for t_owners;
创建私有的同义词
create SYNONYM twn1 for t_owners;
~~~

## 10、索引

索引是用于加速数据存取的数据对象。合理的使用索引可以大大降低 i/o 次数,从而提高数据访问性能。

索引是需要占据存储空间的，也可以理解为是一种特殊的数据。形式类似于下图的一棵“树”，而树的节点存储的就是每条记录的物理地址，也就是我们提到的伪列（ROWID）

#### 普通索引

~~~sql
create index index_name on table_name(column_name);#根据某张表的某列来创建索引。
create index t_owners_name on t_owners(name);

#索引性能测试
create table T_INDEXTEST (
ID NUMBER,
NAME VARCHAR2(30)
);
BEGIN
FOR i in 1..1000000
loop
INSERT INTO T_INDEXTEST VALUES(i,'AA'||i);
end loop;
commit;
END;

create index t_indextest_name on t_indextest(name);
select * from t_indextest where id=765432;
select * from t_indextest where name='AA765432';
~~~

#### 唯一索引

如果我们需要在某个表某个列创建索引，而这列的值是不会重复的。这是我们可以创建唯一索引。

语法

~~~sql
create unique index index_name on table_name(column_name);
~~~

#### 复合索引

~~~sql
create index index_name on table_name(column_name,column_name);
~~~

#### 反向键索引

​	应用场景：当某个字段的值为连续增长的值，如果构建标准索引，会形成歪脖子树。这样会增加查询的层数，性能会下降。建立反向键索引，可以使索引的值变得不规则，从而使索引树能够均匀分布。

~~~sql
create index 索引名称 on 表名(列名) reverse;
create index t_indextest_name_reverse on t_indextest(id) reverse;
~~~

#### 位图索引

- 使用场景：位图索引适合创建在低基数列上
- 位图索引不直接存储 ROWID，而是存储字节位到 ROWID 的映射
- 优点：减少响应时间，节省空间占用

~~~sql
create bitmap index index_name table_name(column_name);
~~~

## 11、PL/SQL

PL/SQL（Procedure Language/SQL）是 Oracle 对 sql 语言的过程化扩展，指在 SQL 命令语言中增加了过程处理语句（如分支、循环等），使 SQL 语言具有过程处理能力。把 SQL 语言的数据操纵能力与过程语言的数据处理能力结合起来，使得 PLSQL 面向过程但比过程语言简单、高效、灵活和实用。

#### 基本语法结构

~~~sql
[declare  --声明变量]
begin
逻辑代码
[exception --异常处理]
end;
~~~

#### 变量

~~~sql
声明变量的语法
变量名 类型(长度)
变量赋值语法
变量名:=变量值
declare
v_price number(10,2);
v_usenum number;
v_usenum2 number(10,2);
v_money(10,2);
begin
v_price:=2.45;
v_usenum:=8012;
v_usenum2:=round(v_usenum/1000,2);
v_money:=round(v_price*v_usenum2,2);
dbms_output.put_line('单价：'||v_price||'吨数:'||v_usenum2||'金额：'||v_money);
end;
~~~

select into方式赋值

~~~sql
select 列名 into 变量名 from 表名 where 条件;
~~~

> 注意：结果必须是一条记录 ，有多条记录和没有记录都会报错

~~~sql
select usenum,num0,num1 from t_account where year=2023 and id=1;

declare
v_price number(10,2);
v_usenum number;
v_usenum2 number(10,2);
v_num0 number(10,2);
v_num1 number(10,2);
v_money number(10,2);
begin
v_price:=2.45;
select usenum,num0,num1 into v_usenum,v_num0,v_num1 from t_account where year=2023 and id=1;
v_usenum2:=round(v_usenum/1000,2);
v_money:=round(v_price*v_usenum2,2);
dbms_output.put_line('单价：'||v_price||'吨数：'||v_usenum2||'金额：'||v_money||'上月字数：'||v_num0||'本月字数'||v_num1);
end;
~~~

#### 属性类型

%TYPE 引用型  作用：引用某表某列的字段类型

~~~sql
declare
v_price number(10,2);
v_usenum t_account.usenum%TYPE;
v_num0 t_account.num0%TYPE;
v_num1 t_account.num1%TYPE;
v_usenum2 number(10,2);
v_money number(10,2);
begin
v_price:=2.55;
select usenum,num0,num1 into v_usenum,v_num0,v_num1 from t_account where year=2023 and id=3;
v_usenum2:=round(v_usenum/1000,2);
v_money:=v_price*v_usenum2;
dbms_output.put_line('单价：'||v_price||'吨数：'||v_usenum2||'金额：'||v_money||'上月字数：'||v_num0||'本月字数'||v_num1);
end;
~~~

%ROWTYPE 记录型 ，上例中的例子可以用下面的代码代替作用: 标识某个表的行记录类型

~~~sql
declare
v_price number(10,2);
v_account t_account%ROWTYPE;
v_usenum2 number(10,2);
v_money number(10,2);
begin
v_price:=3.14;
select * into v_account from t_account where year=2023 and id=3;
v_usenum2:=round(v_account.usenum/1000,2);
v_money:=v_price*v_usenum2;
DBMS_OUTPUT.put_line('单价：'||v_price||'吨数：'||v_usenum2||'金额：'||v_money||'上月字数：'||v_account.num0||'本月字数'||v_account.num1);
end;
~~~

#### 异常

在运行程序时出现的错误叫做异常，发生异常后，语句将停止执行，控制权转移到 PL/SQL 块的异常处理部分

异常有两种类型：

- 预定义异常 - 当 PL/SQL 程序违反 Oracle 规则或超越系统限制时隐式引发。
- 用户定义异常 - 用户可以在 PL/SQL 块的声明部分定义异常，自定义的异常通过 RAISE 语句显式引发。

oracle预定义的异常21个

| 系统异常                | 产生原因                                                     |
| ----------------------- | ------------------------------------------------------------ |
| ACCESS_INTO_NULL        | 未定义对象                                                   |
| CASE_NOT_FOUND          | CASE 中若未包含相应的 WHEN ，并且没有设置 ELSE 时            |
| COLLECTION_IS_NULL      | 集合元素未初始化                                             |
| CURSER_ALREADY_OPEN     | 游标已经打开                                                 |
| DUP_VAL_ON_INDEX        | 唯一索引对应的列上有重复值                                   |
| INVALID_CURSOR          | 在不合法的游标上进行操作                                     |
| INVALID_NUMBER          | 内置的SQL语句不能将字符转化为数字                            |
| ***NO_DATA_FOUND***     | ***使用select into 没有行返回行***                           |
| ***TOO_MANY_ROWS***     | ***使用select into 有多行数据返回***                         |
| ZERO_DIVIDE             | 除数为0                                                      |
| SUBSCRIPT_BEYOND_COUNT  | 元素下标超过嵌套表或 VARRAY 的最大值                         |
| SUBSCRIPT_OUTSIDE_LIMIT | 使用嵌套表或 VARRAY 时，将下标指定为负数                     |
| VALUE_ERROR             | 赋值时，变量长度不足以容纳实际数据                           |
| LOGIN_DENIED            | PL/SQL 应用程序连接到 oracle 数据库时，提供了不正确的用户名或密码 |
| NOT_LOGGED_ON           | PL/SQL 应用程序在没有连接 oralce 数据库的情况下访问数据      |
| PROGRAM_ERROR           | PL/SQL 内部问题，可能需要重装数据字典＆ PL/SQL 系统包        |
| ROWTYPE_MISMATCH        | 宿主游标变量与 PL/SQL 游标变量的返回类型不兼容               |
| SELF_IS_NULL            | 使用对象类型时，在 NULL对象上调用对象方法                    |
| STORAGE_ERROR           | 运行 PL/SQL 时，超出内存空间                                 |
| SYS_INVALID_ID          | 无效的 ROWID 字符串                                          |
| TIMEOUT_ON_RESOURCE     | Oracle 在等待资源时超时                                      |
|                         |                                                              |

语法结构：

~~~sql
exception
when 异常类型 then
异常处理逻辑
~~~

~~~sql
declare
v_price number(10,2);
v_usenum t_account.usenum%TYPE;
v_usenum2 number(10,2);
v_money number(10,2);
begin
v_price:=3.55;
select usenum into v_usenum from t_account where year=2023 and id=1;
v_usenum2:=round(v_usenum/1000,2);
v_money:=v_price*v_usenum2;
dbms_output.put_line('单价：'||v_price||'吨数:'||v_usenum2||'金额：'||v_money);
exception
when NO_DATA_FOUND then
dbms_output.put_line('未找到数据，请核实');
when TOO_MANY_ROWS then
dbms_output.put_line('查询条件有误，返回多条信息，请核实');
end;
~~~

#### 条件判断

~~~sql
#基本语法1
if 条件 then
 业务逻辑
end if;

#基本语法2
if 条件 then
业务逻辑
else
业务逻辑
end if;

#基本语法3
if 条件 then
业务逻辑
elseif 条件 then
业务逻辑
else
业务逻辑
end if;
~~~

需求：设置三个等级的水费 5 吨以下 2.45 元/吨 5 吨到 10 吨部分 3.45 元/吨 ，超过 10 吨部分 4.45 ，根据使用水费的量来计算阶梯水费。

~~~sql
declare
v_price1 number(10,2);
v_price2 number(10,2);
v_price3 number(10,2);
v_account t_account%ROWTYPE;
v_usenum2 number(10,2);
v_money number(10,2);
begin
select * into v_account from t_account where year=2023 and id=3;
v_usenum2:=round(v_account.usenum/1000,2);
v_price1:=2.45;
v_price2:=3.45;
v_price3:=4.45;
if v_usenum2<5 then
v_money:=v_price1*v_usenum2;
elsif 5<v_usenum2 and v_usenum2<10 then
v_money:=v_price1*5+v_price2*(v_usenum2-5);
else
v_money:=v_price1*5+v_price2*5+v_price3*(v_usenum2-5);
end if;
dbms_output.put_line('吨数：'||v_usenum2||'金额：'||v_money||'上月字数：'||v_account.num0||'本月字数'||v_account.num1);
exception
when NO_DATA_FOUND then
dbms_output.put_line('未找到数据，请核实');
when TOO_MANY_ROWS then
dbms_output.put_line('有多行数据被查询');
end;
~~~

#### 循环

1. 无条件循环

~~~sql
loop
循环语句
end loop;

#例子
declare
v_num number;
begin
v_num:=0;
loop
dbms_output.put_line('v_num='||v_num);
v_num:=v_num+1;
if v_num=100 then
exit;
end if;
end loop;
end;

#循环部分可以改写成
loop
dbms_output.put_line('v_num='||v_num);
v_num:=v_num+1;
exit when v_num>100;
end loop;
~~~

 	2.条件循环

~~~sql
while 条件
loop
循环体
end loop;

#范例：输出从1开始的100个数
declare
v_num number;
begin
v_num:=0;
while v_num<101
loop
dbms_output.put_line('v_num='||v_num);
v_num:=v_num+1;
end loop;
end;
~~~

​	3.for循环

~~~sql
#基本语法
for 变量 in 起始值..终值
loop 
循环体
end loop;


begin
for v_num in 0..100
loop
dbms_output.put_line('v_num='||v_num);
end loop;
end;
~~~

#### 游标

游标是系统为用户开设的一个数据缓冲区,存放 SQL 语句的执行结果。我们可以把游标理解为 PL/SQL 中的结果集。

在声明区声明游标，语法如下：

~~~sql
cursor 游标名称 is SQL 语句;
~~~

使用游标语法

~~~sql
open 游标名称
loop
	fetch 游标名称 into 变量;
	exit when 游标名称%notfound;
end loop;
close 游标名称;

declare
curr_jylsh varchar2(50);
cursor lyjsh_cursor is select jylsh from jylsh_table;
begin
open lyjsh_cursor;
	loop
	fetch lyjsh_cursor into curr_jylsh;
	exit when lyjsh_cursor%notfound;
	insert into t_sbf_sb_cxjm_sbbc_fail values(curr_jylsh,sysdate,'ljh','00');
	commit;
	update sbf_sb_cxjmhdxx set sjclzt='00',xgrq=sysdate,xgr_dm='ljh' where cxjmhd_id in (select lymx_id from sbf_sb_wyxx where jylsh=curr_jylsh);
	commit;
	delete from sbf_sb_cxjmwyxx e where e.jylsh=curr_jylsh;
	commit;
	delete from sbf_sb_cxjm_sbwyxx e where e.jylsh=curr_jylsh;
	commit;
	delete from sbf_sb_wyxx e where e.jylsh=curr_jylsh;
	commit;
	update sbf_sb 
	end loop;
close lyjsh_cursor;
end;
	
~~~

需求：打印业主类型为 1 的价格表

~~~sql
declare 
v_pricetable t_pricetable%ROWTYPE;
cursor cur_pricetable is select * from t_pricetable where ownertypeid=1001;
begin
open cur_pricetable;
	loop
	fetch  cur_pricetable into v_pricetable;
	exit when cur_pricetable%notfound;
	dbms_output.put_line( '价格:'||v_pricetable.price ||'吨位：'||v_pricetable.minnum||'-'||v_pricetable.maxnum );
	end loop;
close cur_pricetable;
end;
~~~

带参数的游标

~~~sql
declare
v_pricetable t_pricetable%ROWTYPE;
cursor cur_pricetable(v_ownertypeid number) is select * from t_pricetable where ownertypeid=v_ownertypeid;
begin
open cur_pricetable(1001);
loop
	fetch cur_pricetable into v_pricetable;
	exit when cur_pricetable%notfound;
	dbms_output.put_line('价格:'||v_pricetable.price ||'吨位：'||v_pricetable.minnum||'-'||v_pricetable.maxnum );
end loop;	
close cur_pricetable;
end;
~~~

for 循环提取游标值

~~~sql
declare
cursor cur_pricetable(v_ownertypeid number) is select * from t_pricetable where ownertypeid=v_ownertypeid;
begin
for cur_pricetable in cur_pricetable(1001)
loop
dbms_output.put_line('价格:'||cur_pricetable.price ||'吨位：'||cur_pricetable.minnum||'-'||cur_pricetable.maxnum );
end loop;
end;
~~~

## 12、存储函数

存储函数又称为自定义函数。可以接收一个或多个参数，返回一个结果。在函数中我们可以使用 PL/SQL 进行逻辑的处理。

#### 存储函数语法结构

~~~sql
create or replace function 函数名称(参数名称 参数类型, 参数名称 参数类型, ...)
return 结果变量数据类型
is 变量声明部分;
begin
逻辑部分;
RETURN 结果变量;
[exception 异常处理部分]
end;
~~~

#### 示例

~~~sql
create  function pingping(v_name varchar2,v_age number)
return varchar2
is
v_result varchar2(30);
begin
v_result:='姓名'||v_name||'-年龄'||v_age;
dbms_output.put_line('=='||v_result);
return v_result;
end;
#调用
select pingping('suhe',18) from dual;
~~~

需求：查询业主 ID，业主名称，业主地址，业主地址使用刚才我们创建的函数来实现。

~~~sql
create function ss(v_id number) return varchar2
is
address_name varchar2(100);
begin
select name into address_name from t_address where id=v_id;
return address_name;
end;

select id,name,ss(addressid) from t_owners;
~~~

## 13、存储过程

#### 概念

存储过程是被命名的 PL/SQL 块，存储于数据库中，是数据库对象的一种。应用程序可以调用存储过程，执行相应的逻辑。

存储过程与存储函数都可以封装一定的业务逻辑并返回结果，存在区别如下：
1、存储函数中有返回值，且必须返回；而存储过程没有返回值，可以通过传出参数返回多个值。
2、存储函数可以在 select 语句中直接使用，而存储过程不能。过程多数是被应用程序所调用。
3、存储函数一般都是封装一个查询结果，而存储过程一般都封装一段事务代码。

#### 语法

~~~sql
create or replace procedure 存储过程名字(参数1 类型,参数2 类型)
is|as
变量申明;
begin
逻辑部分;
[exception 异常处理部分]
end;
~~~

>参数只指定类型，不指定长度

过程参数的三种模式：IN 传入参数（默认）,OUT 传出参数 ，主要用于返回程序运行结果,IN OUT 传入传出参数

#### 案例

1、创建不带传出参数的存储过程：添加业主信息

~~~sql
create sequence owner_sequence start with 1010;
create or replace procedure owners_add(v_name varchar2,v_addressid number,v_housenumber varchar2,v_watermeter varchar2,v_type varchar2)
is
begin
insert into t_owners values(owner_sequence.nextval,v_name,v_addressid,v_housenumber,v_watermeter,sysdate,v_type);
commit;
end;
call owners_add('赵伟',1001,'999-3','132-7',1002);
~~~

2、创建带传出参数的存储过程

~~~sql
create or replace procedure owners_add_with_out(v_name varchar2,v_addressid number,v_housenumber varchar2,v_watermeter varchar2,v_type varchar2,v_id out number)
is
begin
select owner_sequence.nextval into v_id from dual;
insert into t_owners values(v_id,v_name,v_addressid,v_housenumber,v_watermeter,sysdate,v_type);
commit;
end;


declare 
v_id number;
begin
owners_add_with_out('王旺旺',1,'922-3','133-7',1,v_id);
DBMS_OUTPUT.put_line('增加成功,ID:'||v_id);
end;
~~~

## 14、触发器

#### 概念

数据库触发器是一个与表相关联的、存储的 PL/SQL 程序。每当一个特定的数据操作语句(Insert,update,delete)在指定的表上发出时，Oracle 自动地执行触发器中定义的语句序列。

触发器可用于

- 数据确认
- 实施复杂的安全性检查
- 做审计，跟踪表上所做的数据操作等
- 数据的备份和同步

触发器分类

- 前置触发器（BEFORE）
- 后置触发器（AFTER）

#### 触发器语法

~~~sql
create or replace trigger 触发器名字
before|after
[delete][[or] insert][[or]update [of 列名]]
on 表名
[for each row ] [when [条件]]
declare
变量申明;
begin
PLSQL块
end;
~~~

>作用是标注此触发器是行级触发器还是语句级触发器

在触发器中触发语句与伪记录变量的值

| 触发语句 | :old                     | :new                     |
| -------- | ------------------------ | ------------------------ |
| insert   | 所有字段都是空的（null） | 将要插入的数据           |
| update   | 更新以前该行的值         | 更新后的值               |
| delete   | 删除以前该行的值         | 所有字段都是空的（null） |

#### 案例

1、前置触发器

需求：当用户输入本月累计表数后，自动计算出本月使用数 。

~~~sql
create or replace trigger tri_account_update
before
update of num1
on t_account
for each row
declare
begin
:new.usenum:=:new.num1-:new.num0;
end;

#create table t_account(id number,ownerid number,ownertypeid number,areaid number,year char(4),month #char(2),num0 number,num1 number,usenum number,meteruserid number,meterdate date,money number(10,2),isfee #char(1),feedate date,feeuserid number);
insert into t_account values(1,1001,1001,1001,2023,06,43543,46456,3000,1001,sysdate,3232,0,sysdate,1001);
commit;

update t_account set num1=100000 where id=1;
~~~

2、后置触发器

需求：当用户修改了业主信息表的数据时记录修改前与修改后的值

~~~sql

create table t_owners_log
(
updatetime date,
ownerid number,
oldname varchar2(30),
newname varchar2(30)
);

create or replace trigger tri_insert_owner
after
update of name
on t_owners
for each row
declare
begin
insert into t_owners_log values(sysdate,:old.id,:old.name,:new.name);
end;

update t_owners set name='lililili' where id=1004;
select * from t_owners_log;
~~~

