---
title: 云部署Hexo和Certbot申请
thumbnail: 'https://bitiful.hudi.space/posts/cloud_digtal.png'
cover: 'https://bitiful.hudi.space/posts/cloud_digtal.png'
description: '本章内容只是对最近学习的总结，对互联网相关开发者社区相关文章的一个整合和错误排查。最开始搭建博客的时候，不知道从何处下手。想去实现自己一些喜欢的前端样式，但是奈何都不尽人意，折腾了好久。所以选择了hexo的butterfly主题去快速搭建一个博客。后期还会对博客的部分样式做一定的更改，改成自己喜欢的样式效果。'
categories:
  - 云服务
tags:
  - hexo
  - 云服务
abbrlink: b632734
---

​		本章内容只是对最近学习的总结，对互联网相关开发者社区相关文章的一个整合和错误排查。最开始搭建博客的时候，不知道从何处下手。想去实现自己一些喜欢的前端样式，但是奈何都不尽人意，折腾了好久。所以选择了hexo的butterfly主题去快速搭建一个博客。后期还会对博客的部分样式做一定的更改，改成自己喜欢的样式效果。

>记录Hexo部署到阿里云服务器全过程 https://developer.aliyun.com/article/775005 
>
>使用Certbot申请/续签ssl证书https://developer.aliyun.com/article/1572585
>
>本篇文章将引用上述两篇文章的内容来总结。
>
>目的：写本篇文章的目的是Github里面的钩子和SSL证书，是自己的知识盲区，需要记录和总结学习。

## 一、云部署Hexo

### 1、环境准备

前置环境(注释是我使用当前的版本)

~~~shell
node  #v14.15.0 
git #2.23.0.windows.1
~~~

安装hexo-cli，创建第一个hexo项目


~~~shell
npm install  -g  hexo-cli	
hexo init filedir
cd filedir
npm install #安装完毕后
hexo server  #或者是hexo s 启动项目
~~~

>具体的hexo-cli的版本需要根据node的版本来选择。我这里使用的版本是hexo-cli: 4.3.2。若要使用和我相同的版本需要保证node的版本在8.10+以上。不然可能会出现某些模块和功能不能使用的情况。具体的版本限制可以查看hexo的官网[https://hexo.io/zh-cn/docs/index.html#Node-js-%E7%89%88%E6%9C%AC%E9%99%90%E5%88%B6](https://hexo.io/zh-cn/docs/index.html#Node-js-%E7%89%88%E6%9C%AC%E9%99%90%E5%88%B6)

安装butterfly主题


~~~shell
#使用git安装，在hexo项目下执行一下命令
git clone -b dev https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
#或者是使用npm安装，但是官方指出，此方法只支持Hexo5.0.0以上版本，通过 npm 安装并不会在 themes 里生成主题文件夹，而是在 node_modules 里生成。
npm install hexo-theme-butterfly 
~~~

>完成上述操作，需要把hexo-theme-butterfly项目目录移动到hexo的theme的目录下。

​		修改 Hexo根目录下的_config.yml，把主题改为 butterfly到这一步，博客的butterfly主题的安装设置完成。而butterfly的配置和可以访问[官方文档](https://butterfly.js.org/)。

### 2、云服务器部署

服务器必要环境Nginx,使用yum安装或者是使用源码安装，也可以通过docker快速部署一个nginx服务，在这里仅介绍yum和源码安装。

{% tabs nginx %}

<!-- tab yum安装 -->

~~~shell
yum install -y nginx
~~~

<!-- endtab -->

<!-- tab 使用源码安装 -->

这里以nginx-1.20.2为例。

1、安装相关的依赖软件

~~~shell
yum install openssl-devel pcre-devel gcc -y
~~~

2、创建目录

~~~shell
mkdir /data
mkdir /data/server /data/soft
~~~

3、创建用户

~~~shell
useradd www -s /sbin/nologin -M
~~~

4、上传源码包并解压

~~~shell
#使用rz工具上传源码包nginx-1.8.1.tar.gz
#安装rz工具
yum install -y lrzsz
#或执行查看该工具是否存在
rpm -qa lrzsz

[root@hecs-202792 ~]# rpm -qa lrzsz
lrzsz-0.12.20-36.el7.x86_64

tar -zxvf nginx-1.20.2.tar.gz
~~~

5、执行编译安装

~~~shell
cd nginx-1.8.1
./configure --prefix=/data/server/nginx --user=www --group=www  #--prefix 参数是指定nginx的安装目录，配置文件也在该目录下
make && make install
~~~

6、启动nginx

~~~shell
/data/server/nginx/sbin/nginx
~~~

7、将nginx配置成系统服务

~~~shell
vi /usr/lib/systemd/system/nginx.service

#服务脚本内容
[Unit]
Description=nginx - web server
After=network.target remote-fs.target nss-lookup.target
[Service]
Type=forking
PIDFile=/data/server/nginx/logs/nginx.pid
ExecStartPre=/data/server/nginx/sbin/nginx -t -c /data/server/nginx/conf/nginx.conf
ExecStart=/data/server/nginx/sbin/nginx -c /data/server/nginx/conf/nginx.conf
ExecReload=/data/server/nginx/sbin/nginx -s reload
ExecStop=/data/server/nginx/sbin/nginx -s stop
ExecQuit=/data/server/nginx/sbin/nginx -s quit
PrivateTmp=true
[Install]
WantedBy=multi-user.target
~~~

<!-- endtab -->

{% endtabs %}

>nginx的配置修改后续再说

安装git

~~~shell
yum install -y git
~~~

添加git用户，然后执行一下操作。创建用户的命令要在root下去执行。后续的操作均在git用户下执行。

~~~shell
useradd git #用户名自己定义
passwd git #修改git用户的密码
su git #切换git用户
mkdir /home/git/project/blog #该目录上就是hexo编译部署后生成静态文件的目录
mkdir /home/git/repos #该项目git仓库的的目录
cd /home/git/repos && reposgit init --bare blog.git #进入目录并初始化仓库
cd blog.git/hooks 
vim post-receive #创建一个钩子,目的是将hexo编译部署后生成静态文件上传到指定的目录

#post-receive 内容如下：
#!/bin/sh
git --work-tree=/home/git/projects/blog --git-dir=/home/git/repos/blog.git checkout -f

#参数说明
--work-tree #指定编译部署后生成静态文件上传到指定的目录
--git-dir #指定项目git仓库的目录

#编辑之后退出vim,为post-receive赋于可执行的权限
chmod +x post-receive # 添加可执行权限exit # 
~~~

完成上述操作以后需要退出git用户。登录root用户为git用户赋于权限

~~~shell
chown -R git:git /home/git/repos/blog.git
~~~

在本地可以尝试执行以下命令，来查看博客项目所在的仓库是否初始化成功。能够拉取下来就说明仓库是初始化成功的。

~~~shell
git clone git@server_ip:/home/git/repos/blog.git  
#server_ip 就是服务器所在的ip
~~~

本地建立SSH信任关系。在gitbash或者是cmd窗口中去执行。

~~~shell
ssh-copy-id -i ~/.ssh/id_rsa.pub git@server_ip # 建立信任关系
ssh git@server_ip  # 试一下能不能登录
ssh-keygen -t rsa #如果没有生成过秘钥就执行生成秘钥的命令，然后一直回车即可 一般生成的秘钥在C:\Users\{用户名}\.ssh 目录下
~~~

更改git用户默认的shell。为了服务器安全起见这个git用户最好就拥有git clone等于git命令相关的操作。

~~~shell
which git-shell #找到git-shell的路径，将其追加入到/etc/shell中
~~~

修改git用户登录所用的默认的shell

~~~shell
vi /etc/passwd #找到git用户所在的行git:x:1000:1000::/home/git:/bin/bash将 /bin/bash改成git-shell所在的路径。
~~~

执行完上述操作，就没办通过ssh在本地登录服务器了。

### 3、部署上线

首先本地的hexo项目需要下载一个部署的插件[hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)

~~~shell
npm install hexo-deployer-git --save
~~~

然后编辑hexo跟目录下的**_config.yml** 文件。配置如下

~~~yml
deploy:
  type: 'git'
  repo: 'git@server_ip:/home/git/repos/blog.git'
  branch: [master]
~~~

然后再项目执行部署命令

~~~shell
hexo clean #先清除hexo的缓存。
hexo g -d #生成打包文件并将编译后的文件上传到服务器的--work-tree=/home/git/projects/blog 目录下
~~~

也可以修改hexo根目录下的package.json的script在添加部署脚本.

~~~shell
deploy:"hexo g -d";
npm run deploy
~~~

配置nginx的配置文件，如果使用yum安装的nginx，配置文件在/etc/nginx目录下,如果是使用源码安装的配置文件在--prefix=/data/server/nginx/conf目录下。root的配置一定要注意。git部署的操作是在git用户下，所以目录一定要有git的写入权限，不然是会部署失败的。在修改完nginx配置以后记得刷新使其生效

~~~shell
vi nginx.conf

server {
        listen       80;
        server_name  www.hudi.space; #这里是你服务器域名 
        root         /usr/share/nginx/html; #这个root的目录就配置git钩子中--work-tree=/home/git/projects/blog所在的目录。

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }

        #error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }      
}

systemctl restart nginx
~~~

完成以上配置，你就可以通过http访问hexo博客了。🎉🎉🎉

## 二、Certbot申请SSL证书

### 1、证书申请

​		完成上面的配置只能是http访问。本节将介绍https访问和SSL证书申请。由于我使用了多吉云☁️的cdn来给我的的博客项目加速。所以也要给cdn绑定一个域名。

安装certbot

~~~shell
yum install certbot python3-certbot-nginx
~~~

申请证书，如果需要申请多个证书，就在后面继续指定-d 参数和域名即可。由于certbot这个工具他会校验域名的生效性。所以可以先把cdn的子域名的解析绑定到我们自己的服务器的IP上先做证书的生成。然后在修改cdn域名的cname值即可。

~~~shell
certbot certonly --nginx -d www.hudi.space -d cdn.hudi.space   
~~~

如果在执行上述命令提示没有python3-certbot-nginx包时。可以使用如下命令安装插件

~~~shell
yum -y install certbot-nginx
~~~

在执行证书生成的过程中，会提示输入邮箱等信息，按照实际填写即可。生成的证书是在/etc/letsencrypt/live/ 的目录下。进入域名所在目录。查看证书

~~~shell
[root@hcss-ecs-0985 ~]# cd /etc/letsencrypt/live/www.hudi.space
[root@hcss-ecs-0985 www.hudi.space]# pwd
/etc/letsencrypt/live/www.hudi.space
[root@hcss-ecs-0985 www.hudi.space]# ls
cert.pem  chain.pem  fullchain.pem  privkey.pem  README
~~~

### 2、Nginx配置https

同样是修改nginx.conf文件。将http的80端口的访问改为转发，修改https的配置即可。具体配置如下。

~~~shell
server {
    listen 80;
    server_name www.hudi.space;
	# 重定向HTTP请求到HTTPS
	return 301 https://www.hudi.space$request_uri;
}

server {
    listen 443 ssl;
    server_name www.hudi.space
	# SSL配置
    ssl_certificate /etc/letsencrypt/live/www.hudi.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.hudi.space/privkey.pem;
    root /usr/share/nginx/html; #这个root的目录就配置git钩子中--work-tree=/home/git/projects/blog所在的目录。
    index index.html index.htm;
    location / {
        try_files $uri $uri/ =404;
    }
}
~~~

完成上述配置以后，重启nginx使配置生效。即可使用https访问你的博客项目了。🎉🎉🎉🎉





