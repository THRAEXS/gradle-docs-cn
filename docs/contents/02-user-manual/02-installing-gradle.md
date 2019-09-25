---
title: 安装Gradle
date: 2019-09-24 15:43:00
---

# {{ $page.title }}

[[toc]]

您可以在Linux，macOS或Windows上安装Gradle构建工具。本文档涵盖使用软件包管理器（如SDKMAN!）进行安装或Homebrew，以及手动安装。

建议使用[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:upgrading_wrapper)升级Gradle。

您可以在[releases page](https://gradle.org/releases/)上找到所有版本及其校验。

## 先决条件

Gradle可在所有主要操作系统上运行，并且仅需要[Java Development Kit](https://jdk.java.net)版本8或更高版本即可运行。要进行检查，请运行`java -version`。您应该会看到以下内容：

``` sh {1}
❯ java -version
java version "1.8.0_151"
Java(TM) SE Runtime Environment (build 1.8.0_151-b12)
Java HotSpot(TM) 64-Bit Server VM (build 25.151-b12, mixed mode)
```

Gradle附带了自己的Groovy库，因此不需要安装Groovy。 Gradle将忽略任何现有的Groovy安装。

Gradle使用在路径中找到的任何JDK。另外，您可以将`JAVA_HOME`环境变量设置为指向所需JDK的安装目录。

## 使用软件包管理器进行安装

[SDKMAN!](https://sdkman.io)是用于在大多数类Unix系统（macOS，Linux，Cygwin，Solaris和FreeBSD）上管理多个软件开发套件的并行版本的工具。我们部署并维护可从SDKMAN!获得的版本。

``` sh
❯ sdk install gradle
```

[Homebrew](http://brew.sh)是“macOS缺少的软件包管理器”。

``` sh
❯ brew install gradle
```

可以使用其他软件包管理器，但是它们分发的Gradle版本不受 **Gradle, Inc.** 的控制。Linux软件包管理器可能会分发与正式版本相比不兼容或不完整的Gradle修改版(从SDKMAN!或更低版本提供)。

[↓进行下一步](#下一步)

## 手动安装

### Step1.[下载](https://gradle.org/releases/)最新的Gradle发行版

发行的ZIP文件有两种形式：

- Binary-only(bin): 仅有可运行的二进制文件

- Complete(all) with docs and sources: 附带文档和源码

如需使用旧版本，请参阅[releases page](https://gradle.org/releases/)。

### Step2.解压发行包(ZIP)

#### Linux和MacOS用户

在您选择的目录中解压缩发行版zip文件，例如：

``` sh {2}
❯ mkdir /opt/gradle
❯ unzip -d /opt/gradle gradle-5.6.2-bin.zip
❯ ls /opt/gradle/gradle-5.6.2
LICENSE  NOTICE  bin  getting-started.html  init.d  lib  media
```

#### Microsoft Windows用户

使用文件资源管理器创建一个新目录`C:\Gradle`。

打开第二个“文件资源管理器”窗口，然后转到下载Gradle发行版的目录。双击ZIP存档以显示内容。将内容文件夹`gradle-5.6.2`拖到新创建的`C:\Gradle`文件夹中。

另外，您可以使用压缩工具将Gradle发行版ZIP解压至`C:\Gradle`。

### Step3.配置系统环境

要运行Gradle，从Gradle网站到解压缩文件的路径必须在您的终端路径上。对于每个操作系统，执行此操作的步骤都不同。

#### Linux和MacOS用户

配置`PATH`环境变量以包含解压缩发行版的bin目录，例如：

``` sh
❯ export PATH=$PATH:/opt/gradle/gradle-5.6.2/bin
```

或者，您也可以添加环境变量`GRADLE_HOME`并将其指向解压缩的发行版。可以将`$GRADLE_HOME/bin`添加到`PATH`，而不是将特定版本的Gradle添加到`PATH`。升级到其他版本的Gradle时，只需更改`GRADLE_HOME`环境变量即可。

#### Microsoft Windows用户

在文件资源管理器中，右键单击“此PC（或计算机）”图标，然后单击“属性”→“高级系统设置”→“环境变量”。

在“系统变量”下，选择“路径”，然后单击“编辑”。为`C:\Gradle\gradle-5.6.2\bin`bin添加一个条目。单击确定保存。

或者，您也可以添加环境变量`GRADLE_HOME`并将其指向解压缩的发行版。可以将`％GRADLE_HOME％/bin`添加到您的`Path`中，而不是将特定版本的Gradle添加到`Path`中。升级到其他版本的Gradle时，只需更改`GRADLE_HOME`环境变量即可。

[↓进行下一步](#下一步)

## 验证安装

打开控制台（或Windows命令提示符）并运行`gradle -v`以运行gradle并显示版本，例如：

``` sh {1}
❯ gradle -v

------------------------------------------------------------
Gradle 5.6.2
------------------------------------------------------------

(environment specific information)
```

如果遇到任何麻烦，请参阅[排除安装故障部分](https://docs.gradle.org/current/userguide/troubleshooting.html#sec:troubleshooting_installation)。

您可以通过下载SHA-256文件（可从[releases page](https://gradle.org/releases/)中获得）并按照以下[验证指示信息](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:verification)来验证Gradle发行版的完整性。

## 下一步

现在您已经安装了Gradle，请使用以下资源进行入门：

- 按照[Creating New Gradle Builds](https://guides.gradle.org/creating-new-gradle-builds/)教程创建第一个Gradle项目。

- 与核心工程师一起注册[Gradle现场入门培训](https://gradle.com/training)。

- 了解如何通过[command-line interface](https://docs.gradle.org/current/userguide/command_line_interface.html#command_line_interface)完成常见任务。

- [Configure Gradle execution](https://docs.gradle.org/current/userguide/build_environment.html#build_environment)，例如使用HTTP代理下载依赖项。

- 订阅[Gradle Newsletter](https://newsletter.gradle.com/?_ga=2.23577274.1480847771.1569235223-1279986108.1569235223)以获取每月发布和社区更新。
