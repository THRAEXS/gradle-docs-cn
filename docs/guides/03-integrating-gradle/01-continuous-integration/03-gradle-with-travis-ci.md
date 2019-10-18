---
title: 在Travis CI上执行Gradle构建
date: 2019-10-12 10:45:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/executing-gradle-builds-on-travisci/)

[[toc]]

建立Gradle项目并不仅限于开发人员的机器。[持续集成](https://en.wikipedia.org/wiki/Continuous_integration)(CI)是一种长期存在的实践，用于为致力于版本控制的每个更改运行构建，以加强反馈循环。

在本指南中，我们将讨论如何为典型的Gradle项目配置[Travis CI](https://travis-ci.org)。

## 您需要什么

- 约5分钟

- 文本编辑器

- 命令提示符

- Java开发套件（JDK），版本1.8或更高版本

- [Gradle版本](https://gradle.org/install/)4.10.3或更高版本

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

该示例项目配备了生成[构建扫描](https://scans.gradle.com/?_ga=2.250481231.896254753.1571010126-1564571921.1570494734)的支持。使用命令行选项`--scan`运行构建，将在控制台中呈现一个链接。

```
Publishing build scan...
https://gradle.com/s/7mtynxxmesdio
```

下一节将描述如何在Travis CI的帮助下构建项目。

## 配置Travis CI

Travis CI是一个免费的，基于云的CI解决方案提供商，使其成为开源项目的绝佳选择。您可以构建任何项目，只要它作为公共资源库托管在GitHub上即可。Travis CI不提供内置选项来对生成的构件进行`post-process`，例如托管JAR文件或HTML测试报告。您将必须使用外部服务（例如S3）来[传输文件](https://docs.travis-ci.com/user/uploading-artifacts/)。

### 创建配置文件

Travis CI要求您检入带有名为`.travis.yml`的源代码的[配置文件](https://docs.travis-ci.com/user/customizing-the-build/)。该文件包含有关构建项目的所有相关说明。

以下配置文件告诉Travis CI使用JDK 8构建Java项目，跳过通常的[默认执行步骤](https://docs.travis-ci.com/user/customizing-the-build/#Skipping-the-Installation-Step)，并使用Wrapper运行Gradle构建。

``` yml
language: java
install: true

os: linux
dist: trusty
jdk: oraclejdk8

script:
  - ./gradlew build --scan -s
```

从Travis CI配置文件中选择项目。从仪表板激活存储库后，就可以通过每次提交来构建项目了。

![Travis CI](https://guides.gradle.org/executing-gradle-builds-on-travisci/images/travis-enable-project.png)

::: tip
在诸如Travis CI之类的云CI系统上配置[构建扫描](https://scans.gradle.com/?_ga=2.251194703.896254753.1571010126-1564571921.1570494734)特别有用，因为它具有其他环境和测试结果信息，而这些信息很难通过其他方式获得。
:::

### 启用已下载构件的缓存

Gradle的依赖管理机制可从二进制存储库中解析已声明的模块及其对应的构件。下载后，文件将从缓存中重新使用。您需要明确告知Travis CI，您想要[存储和使用Gradle缓存和Wrapper](https://docs.travis-ci.com/user/languages/java/#Caching)进行后续的构建。

``` yml
before_cache:
  - rm -f  $HOME/.gradle/caches/modules-2/modules-2.lock
  - rm -fr $HOME/.gradle/caches/*/plugin-resolution/

cache:
  directories:
    - $HOME/.gradle/caches/
    - $HOME/.gradle/wrapper/
```

### 进一步阅读

您可以通过以下资源了解有关Travis CI高级用法的更多信息：

- [Encrypting sensitive data(加密敏感数据)](https://docs.travis-ci.com/user/encryption-keys/)

- [Modelling a pipeline with build stages(使用构建阶段对管道进行建模)](https://docs.travis-ci.com/user/build-stages/)

## 总结

只需几个步骤，就可以设置和配置在CI上执行Gradle构建。接收快速反馈的好处显然说明了一切。如果您没有使用Travis CI，那没问题，许多CI产品都与Gradle紧密集成。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/executing-gradle-builds-on-travisci](https://github.com/gradle-guides/executing-gradle-builds-on-travisci/)上添加issue或合并请求，我们将尽快与您联系。
