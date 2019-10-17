---
title: 在TeamCity上执行Gradle构建
date: 2019-10-12 10:45:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/executing-gradle-builds-on-teamcity/)

[[toc]]

建立Gradle项目并不仅限于开发人员的机器。[持续集成](https://en.wikipedia.org/wiki/Continuous_integration)(CI)是一种长期存在的实践，用于为致力于版本控制的每个更改运行构建，以加强反馈循环。

在本指南中，我们将讨论如何为典型的Gradle项目配置[TeamCity](https://www.jetbrains.com/teamcity/)。

## 您需要什么

- 约7分钟

- 命令提示符

- Java开发套件(JDK)，版本1.8或更高版本

- TeamCity安装（本指南中介绍的设置步骤）

## 设置典型项目

出于演示目的，本指南将着重于构建基于Java的项目。但是，此设置将与任何与Gradle兼容的项目一起使用。更具体地说，是一个用Java编写并经过Spock测试的Gradle插件。首先，我们将在本地计算机上设置项目，然后再介绍CI上的相同步骤。

只需按照以下步骤操作：

### 克隆[Gradle Site Plugin](https://github.com/gradle-guides/gradle-site-plugin)仓库

``` sh
git clone https://github.com/gradle-guides/gradle-site-plugin.git
cd gradle-site-plugin
```

### 构建项目

作为Java项目的开发人员，您通常会希望编译源代码，运行测试并组装JAR工件。 Gradle插件没什么不同。以下命令可以准确地实现以下目的：

``` sh {1}
./gradlew build

BUILD SUCCESSFUL in 12s
14 actionable tasks: 14 executed
```

该项目将[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)作为存储库的一部分提供。建议将其用于任何Gradle项目，因为它使您的项目可以在CI上构建，而无需安装Gradle运行时。

### 构建扫描集成

该示例项目配备了生成[构建扫描](https://scans.gradle.com/?_ga=2.251528399.896254753.1571010126-1564571921.1570494734)的支持。使用命令行选项`--scan`运行构建，将在控制台中呈现一个链接。

```
Publishing build scan...
https://gradle.com/s/7mtynxxmesdio
```

## 设置TeamCity

JetBrains TeamCity是一款功能强大且用户友好的持续集成和部署服务器，可以立即使用。JetBrains提供了几种许可选项，使您可以根据需要扩展TeamCity。在此设置中，我们将使用TeamCity Professional，这是一个免费的功能齐全的版本，适用于一般项目。在本节中，您将学习如何设置TeamCity，创建构建配置以从GitHub提取源代码以及运行Gradle构建。

### 安装并启动TeamCity

在[TeamCity网站](https://www.jetbrains.com/teamcity/download/)上，您可以从各种发行版本中进行选择。这篇文章使用与Tomcat Servlet容器捆绑在一起的TeamCity，并介绍了TeamCity服务器和在同一台计算机上运行的默认构建代理的评估设置。

1. 确保已安装JRE或JDK，并且`JAVA_HOME`环境变量指向Java安装目录。需要Oracle Java 1.8 JDK。

2. 下载TeamCity`.tar.gz`发行版。例如，在Windows下使用WinZip，WinRar或类似实用程序，或者在Linux或macOS下使用以下命令，解压缩`TeamCity<version number>.tar.gz`存档：

``` sh
tar xfz TeamCity<version number>.tar.gz
```

3. 同时启动TeamCity服务器和一个默认代理，使用`<TeamCity home>/bin`目录中提供的`runAll`脚本，例如。

``` sh
runAll.sh start
```

4. 要访问TeamCity Web UI，请导航至`http://localhost:8111/`。遵循TeamCity的默认设置。系统将要求您设置一个新的管理用户。

接下来，我们可以设置项目并在TeamCity中运行构建。

## 创建TeamCity构建

只需单击几下即可在TeamCity中设置新的Gradle构建：TeamCity与Gradle插件捆绑在一起，因此您无需额外安装插件。但是，建议您安装[Gradle Build Scan插件](https://plugins.jetbrains.com/plugin/9326-gradle-build-scan-integration)。

在**Administration | Projects**页面上，单击 **_Create project_**，使用存储库URL中的选项并输入GitHub存储库的URL: [https://github.com/gradle-guides/gradle-site-plugin.git](https://github.com/gradle-guides/gradle-site-plugin.git)。

![Create Project](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-create-project.png)

遵循 **_Create Project wizard_** 向导，它将提示您输入项目和构建配置名称，并自动检测构建步骤。选择自动的Gradle构建步骤，然后单击 **Use selected**：

![TeamCity Build](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-build-step.png)

构建步骤已添加到构建配置中：

![Build Configuration](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-step-added.png)

单击 **_Edit_**，在打开的页面上单击 **_Advanced options_**。在Gradle中，使用包装程序执行构建被认为是一种好习惯，并且在自动检测时，默认情况下会选择此选项。我们将要生成构建扫描，因此我们将在 **_Additional Gradle command line parameters_** 字段中输入`--scan`选项。

![Build Configuration --scan](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-scan.png)

保存设置，我们准备运行构建。

### 在TeamCity中运行构建

单击右上角的 **_Run_** 按钮：

![Run Build](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-step-upd.png)

TeamCity将开始构建，您将可以通过单击 **_Build Configuration Home_** 来查看构建进度。构建完成后，您可以通过单击构建号链接来查看构建结果：

![Build Result](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-results.png)

您可以在TeamCity中查看测试：

![View Test](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-tests.png)

有关构建的参数和环境的信息可在构建结果的 **_Parameters_** 选项卡上找到。

如果安装了[Gradle Build Scan插件](https://plugins.jetbrains.com/plugin/9326-gradle-build-scan-integration)，您将在 **Build Results** 视图中看到指向构建扫描的链接：

![Build Results](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-build-scan-plugin.png)

否则，可以在构建日志中找到指向给定构建的[构建扫描](https://scans.gradle.com/?_ga=2.225845587.896254753.1571010126-1564571921.1570494734)的链接：

![Build Scan](https://guides.gradle.org/executing-gradle-builds-on-teamcity/images/teamcity-log-link.png)

有多种选项可以持续触发TeamCity的构建：从定期[polling the repository](https://confluence.jetbrains.com/display/TCDL/Configuring+Build+Triggers)，按[building on a set schedule](https://confluence.jetbrains.com/display/TCDL/Configuring+Schedule+Triggers)或通过[post-commit hook](https://confluence.jetbrains.com/display/TCDL/Configuring+VCS+Post-Commit+Hooks+for+TeamCity)。

## 进一步阅读

您可以通过以下资源了解有关TeamCity高级用法的更多信息：

- [Build chains and dependencies(构建链和依赖项)](https://confluence.jetbrains.com/display/TCD18/Build+Dependencies+Setup)

- [Remote run and pre-tested commit(远程运行和预先测试的提交)](https://confluence.jetbrains.com/display/TCD18/Pre-Tested+%28Delayed%29+Commit)

有关更多信息，请参见[TeamCity文档](https://confluence.jetbrains.com/display/TCD18/TeamCity+Documentation)。关注[TeamCity博客](https://blog.jetbrains.com/teamcity/)以获取最新消息。

## 总结

只需几个步骤，就可以设置和配置在CI上执行Gradle构建。接收快速反馈的好处显然说明了一切。如果您不使用TeamCity，那没问题，许多CI产品都与Gradle紧密集成。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/executing-gradle-builds-on-teamcity](https://github.com/gradle-guides/executing-gradle-builds-on-teamcity/)中添加问题或请求请求，我们将尽快与您联系。
