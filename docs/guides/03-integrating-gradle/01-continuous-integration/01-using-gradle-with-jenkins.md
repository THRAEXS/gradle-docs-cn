---
title: 在Jenkins上执行Gradle构建
date: 2019-10-12 10:45:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/executing-gradle-builds-on-jenkins/)

[[toc]]

构建Gradle项目并不仅限于开发人员的机器。[持续集成](https://en.wikipedia.org/wiki/Continuous_integration)(CI)是一种长期存在的实践，用于为致力于版本控制的每个更改运行构建，以加强反馈循环。

在本指南中，我们将讨论如何为典型的Gradle项目配置Jenkins。

## 您需要什么

- 约6分钟

- 文字编辑器

- 命令提示符

- Java开发套件（JDK），版本1.7或更高版本

- [Gradle版本](https://gradle.org/install)4.10.3或更高版本

- Jenkins安装（本文中介绍的设置步骤）

## 设置典型项目

例如，本指南将重点介绍基于Java的项目。更具体地说，是一个用Java编写并经过Spock测试的Gradle插件。首先，我们将在本地计算机上设置项目，然后再介绍CI上的相同步骤。

只需按照以下步骤操作：

### 克隆[Gradle Site Plugin](https://github.com/gradle-guides/gradle-site-plugin)仓库

``` sh
git clone https://github.com/gradle-guides/gradle-site-plugin.git
cd gradle-site-plugin
```

### 构建项目

作为Java项目的开发人员，您通常会希望编译源代码，运行测试并组装JAR工件。Gradle插件没什么不同。以下命令可以准确地实现以下目的：

``` sh {1}
./gradlew build

BUILD SUCCESSFUL in 12s
14 actionable tasks: 14 executed
```

该项目将[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)作为存储库的一部分提供。建议将其用于任何Gradle项目，因为它使您的项目可以在CI上构建，而无需安装Gradle运行时。

### 构建扫描集成

该示例项目配备了生成[构建扫描](https://scans.gradle.com/?_ga=2.46022253.896254753.1571010126-1564571921.1570494734)的支持。使用命令行选项`--scan`运行构建，将在控制台中呈现一个链接。

```
Publishing build scan...
https://gradle.com/s/7mtynxxmesdio
```

下一节将描述如何在Jenkins的帮助下构建项目。

## 设置Jenkins

Jenkins是该领域最杰出的成员之一。在本节中，您将学习如何设置Jenkins，配置任务以从GitHub提取源代码以及运行Gradle构建。

### 安装并启动Jenkins

在[Jenkins网站](https://jenkins.io/download/)上，您可以从各种发行版本中进行选择。这篇文章使用可运行的WAR文件。一个简单的Java命令启动Jenkins服务器。

``` sh
java -jar jenkins.war
```

在浏览器中，使用端口`8080`导航到`localhost`以呈现Jenkins仪表板。系统将要求您设置一个新的管理用户以及要安装的插件。

### 插件安装

首次启动Jenkins时，请确认安装推荐的插件。在"Manage Jenkins > Manage Plugins" 下，确保已安装以下两个插件。

- [Git plugin](https://wiki.jenkins.io/display/JENKINS/Git+Plugin)

- [Gradle plugin](https://wiki.jenkins.io/display/JENKINS/Gradle+Plugin)

接下来，我们可以设置任务来构建项目。

## 创建Jenkins任务

只需单击几下即可设置新的Gradle任务。从左侧导航栏中选择"New Item > Freestyle project"。输入项目的新名称。我们将为该项目选择"gradle-site-plugin"。

在"Source Code Management"部分中选择单选按钮“Git”。输入GitHub存储库的URL：
[https://github.com/gradle-guides/gradle-site-plugin.git](https://github.com/gradle-guides/gradle-site-plugin.git)

![Source Code Management](https://guides.gradle.org/executing-gradle-builds-on-jenkins/images/jenkins-scm.png)

此外，通过选择"Invoke Gradle build script"，在"Build"部分中创建"Build step"。如前所述，我们将要使用包装器执行构建。在"Tasks"输入框中输入`build`，并使用"Switches"`--scan -s`生成构建扫描，并在构建失败的情况下呈现堆栈跟踪。

![Build](https://guides.gradle.org/executing-gradle-builds-on-jenkins/images/jenkins-build-step.png)

### 执行任务

保存任务的配置并通过触发"Build Now"按钮执行初始构建。构建应该成功完成，并呈现一个"Gradle Build Scan"图标，该图标可直接将您带到给定构建的[构建扫描](https://scans.gradle.com/?_ga=2.251653583.896254753.1571010126-1564571921.1570494734)。

![Build Scan](https://guides.gradle.org/executing-gradle-builds-on-jenkins/images/jenkins-build-scan.png)

有多种选项可以持续触发Jenkins的构建：从定期轮询存储库，按设定的时间表构建或通过回调URL。

## 进一步阅读

您可以通过以下资源了解有关Jenkins高级用法的更多信息：

- [Using credentials with Jenkins(在Jenkins中使用凭证)](https://jenkins.io/doc/book/using/using-credentials/)

- [Pipeline as code with Jenkins(Jenkins将代码管道化)](https://jenkins.io/solutions/pipeline/)

- [Modelling a Continuous Deployment pipeline for a Spring Boot application(为Spring Boot应用程序建模持续部署管道)](https://bmuschko.com/blog/jenkins-build-pipeline/)

## 总结

只需几个步骤，就可以设置和配置在CI上执行Gradle构建。接收快速反馈的好处显然说明了一切。如果您不使用Jenkins，那没问题，许多CI产品都与Gradle紧密集成。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/executing-gradle-builds-on-jenkins](https://github.com/gradle-guides/executing-gradle-builds-on-jenkins/)中添加issue或合并请求，我们将尽快与您联系。
