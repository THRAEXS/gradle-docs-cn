---
title: Docs Home
date: 2019-09-24 08:07:00
---

# Gradle用户手册

> [原文链接](https://docs.gradle.org/current/userguide/userguide.html)

[[toc]]

::: tip
是否想了解顶级工程团队用来保持构建快速和高性能的提示和技巧？[在此处注册](https://gradle.com/training/build-cache-deep-dive/?bid=docs-userguide&_ga=2.99946014.1480847771.1569235223-1279986108.1569235223)以获取我们的构建缓存培训。
:::

Gradle是专注于灵活性和性能的开源构建自动化工具。 Gradle构建脚本是使用[Groovy](https://groovy-lang.org)或[Kotlin](https://kotlinlang.org)DSL编写的。阅读有关[Gradle特性](https://gradle.org/features/)的信息，以了解Gradle的功能。

- **高度可定制** - Gradle以最基本的方式可定制和可扩展的方式建模。
- **快速** - Gradle通过重新使用以前执行的输出，仅处理已更改的输入以及并行执行任务来快速完成任务。
- **强大** - Gradle是Android的官方构建工具，并支持许多流行的语言和技术。

![Languages](/imgs/gradle-001.png)

## Gradle新项目

Gradle入门很容易！首先，按照我们的指南[下载并安装Gradle](https://docs.gradle.org/current/userguide/installation.html#installing_gradle)，然后查看Gradle[入门指南](https://gradle.org/guides/#getting-started)以创建您的第一个版本。

如果您当前正在使用Maven，请查看[Gradle vs Maven](https://gradle.org/maven-vs-gradle/)的直观对比，并按照[从Maven迁移到Gradle](https://docs.gradle.org/current/userguide/migrating_from_maven.html)的指南进行操作。

## 使用现有的Gradle构建

Gradle支持许多主要的IDE，包括Android Studio，Eclipse，IntelliJ IDEA，Visual Studio 2017和XCode。您还可以通过终端中的[命令行接口](https://docs.gradle.org/current/userguide/command_line_interface.html#command_line_interface)或持续集成服务器来调用Gradle。 [Gradle构建扫描](https://scans.gradle.com/?_ga=2.66070830.1480847771.1569235223-1279986108.1569235223)可帮助您了解构建结果，提高构建性能并协作以更快地解决问题。

![Building](/imgs/gradle-002.png)

## 获得帮助

- **论坛** - 获得帮助的最快方法是通过Gradle论坛。社区成员和核心贡献者回答您的问题。
- **培训** - Gradle开发人员每月都会进行免费的基于Web的Gradle培训。前往培训页面进行注册。
- **企业服务** - 支持和培训可以与Gradle Enterprise订阅一起购买。

## 许可证

Gradle构建工具的源代码是开放的，并根据[Apache License 2.0](https://github.com/gradle/gradle/blob/master/LICENSE)获得许可。 Gradle用户手册和DSL参考已获得[Creative Commons Attribution-NonCommercial-ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)国际许可的许可。
