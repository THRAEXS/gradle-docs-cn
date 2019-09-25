---
title: 构建环境
date: 2019-09-25 15:12:00
---

# {{ $page.title }}

[[toc]]

::: tip
有兴趣配置构建缓存以加快构建速度吗？在此处注册以参加我们的[Build Cache](https://gradle.com/training/build-cache-deep-dive/?bid=docs-build-environment&_ga=2.98322847.1480847771.1569235223-1279986108.1569235223)培训课程，以了解顶级工程团队用来提高构建速度的一些技巧。
:::

Gradle提供了多种机制来配置Gradle本身和特定项目的行为。以下是使用这些机制的参考。

在配置Gradle行为时，您可以使用以下方法，以从高到低的优先级顺序列出（第一个优先级最高）：

- [Command-line flags](https://docs.gradle.org/current/userguide/command_line_interface.html#command_line_interface)，例如`--build-cache`。这些优先于属性和环境变量。

- [System properties](#系统属性)，例如存储在`gradle.properties`文件中的`systemProp.http.proxyHost=somehost.org`。

- [Gradle properties](#Gradle属性)，例如`org.gradle.caching=true`，通常存储在项目根目录或`GRADLE_USER_HOME`环境变量的`gradle.properties`文件中。

- [Environment variables](#环境变量)，例如执行Gradle的环境来源的`GRADLE_OPTS`。

除了配置构建环境之外，还可以使用[Project properties](#项目属性)（例如`-PreleaseType=final`）配置给定的项目构建。

## Gradle属性

Gradle提供了几个选项，可以轻松配置将用于执行构建的Java流程。虽然可以通过`GRADLE_OPTS`或`JAVA_OPTS`在本地环境中配置这些设置，但将某些设置（例如JVM内存配置和Java主目录位置(**JAVA_HOME**)）存储在版本控制中很有用，这样整个团队就可以在一致的环境中工作。

为构建建立一致的环境就像将这些设置放入`gradle.properties`文件一样简单。该配置按以下顺序应用（如果在多个位置配置了同一个选项，则取最后一个）：

- Gradle安装目录中的`gradle.properties`。

- 工程根目录中的`gradle.properties`。

- `GRADLE_USER_HOME`目录中的`gradle.properties`。

- 系统属性，例如在命令行上设置`-Dgradle.user.home`时。

以下属性可用于配置Gradle构建环境：

- **`org.gradle.caching=(true,false)`**

  设置为`true`时，Gradle将在可能的情况下重用任何先前构建的任务输出，从而使构建速度更快。了解有关[使用构建缓存](https://docs.gradle.org/current/userguide/build_cache.html#build_cache)的更多信息。

- **`org.gradle.caching.debug=(true,false)`**

  设置为`true`时，单个输入属性哈希值和每个任务的构建缓存键都记录在控制台上。了解有关[任务输出缓存](https://docs.gradle.org/current/userguide/build_cache.html#sec:task_output_caching)的更多信息。

- **`org.gradle.configureondemand=(true,false)`**

  启用[按需孵化配置](https://docs.gradle.org/current/userguide/multi_project_builds.html#sec:configuration_on_demand)，Gradle将尝试仅配置必要的项目。

- **`org.gradle.console=(auto,plain,rich,verbose)`**

  自定义控制台输出的颜色或详细程度。默认值取决于如何调用Gradle。有关其他详细信息，请参见[命令行日志记录](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_logging)。

- **`org.gradle.daemon=(true,false)`**

  设置为`true`时，将使用[Gradle Daemon](/contents/03-running-gradle-builds/01-customizing-execution/02-the-gradle-daemon)运行构建。默认为`true`。

- **`org.gradle.daemon.idletimeout=(# of idle millis)`**

  在指定的空闲毫秒数后，**Gradle Daemon** 将自行终止。默认值为`10800000`(3小时)。

- **`org.gradle.debug=(true,false)`**

  设置为`true`时，Gradle将在启用远程调试的情况下运行构建，侦听端口`5005`。请注意，这等效于将`-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=5005`添加到JVM命令行，它将挂起虚拟机，直到连接了调试器。默认为`false`。

- **`org.gradle.java.home=(path to JDK home)`**

  指定用于Gradle构建过程的Java目录。可以将值设置为`jdk`或`jre`位置，但是，根据您的构建方式，使用JDK更安全。如果未指定设置，则从您的环境（`JAVA_HOME`或`java`的路径）派生合理的默认值。这不会影响用于启动Gradle客户端VM的Java版本（[请参阅环境变量](#环境变量)）。

- **`org.gradle.jvmargs=(JVM arguments)`**

  指定用于 **Gradle Daemon** 的JVM参数。该设置对于[配置JVM内存设置](#配置jvm内存)以提高构建性能特别有用。这不会影响Gradle客户端VM的JVM设置。

- **`org.gradle.logging.level=(quiet,warn,lifecycle,info,debug)`**

  当设置为`quiet`, `warn`, `lifecycle`, `info`, `debug`时，Gradle将使用此日志级别。这些值不区分大小写。`lifecycle`级别是**默认级别**。请参阅[选择日志级别](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)。

- **`org.gradle.parallel=(true,false)`**

  配置后，Gradle将派生到`org.gradle.workers.max`JVM，以并行执行项目。要了解有关并行任务执行的更多信息，请参阅[Gradle性能指南](https://guides.gradle.org/performance/#parallel_execution)。

- **`org.gradle.warning.mode=(all,none,summary)`**

  当设置为`all`, `summary`或`none`时，Gradle将使用不同的警告类型显示。有关详细信息，请参见[命令行日志记录选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_logging)。

- **`org.gradle.workers.max=(max # of worker processes)`**

  配置后，Gradle将使用最多给定数量的处理器。默认值为CPU处理器数。另请参见[性能命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_performance)。

- **`org.gradle.priority=(low,normal)`**

  指定 **Gradle Daemon** 及其启动的所有进程的调度优先级。默认为`normal`。另请参见[性能命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_performance)。

下面的示例演示各种属性的用法。

示例1.使用`gradle.properties`文件设置属性

``` properties
# gradle.properties

gradlePropertiesProp=gradlePropertiesValue
sysProp=shouldBeOverWrittenBySysProp
systemProp.system=systemValue
```

111
<code-switcher/>

## 系统属性

## 环境变量

## 项目属性

## 配置jvm内存

## 使用项目属性配置任务

## 通过HTTP代理访问web
