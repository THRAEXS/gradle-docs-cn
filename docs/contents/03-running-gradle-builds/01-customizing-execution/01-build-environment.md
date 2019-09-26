---
title: 构建环境
date: 2019-09-25 15:12:00
---

# {{ $page.title }}

> [原文链接](https://docs.gradle.org/current/userguide/build_environment.html)

[[toc]]

::: tip
有兴趣配置构建缓存以加快构建速度吗？在此处注册以参加我们的[Build Cache](https://gradle.com/training/build-cache-deep-dive/?bid=docs-build-environment&_ga=2.98322847.1480847771.1569235223-1279986108.1569235223)培训课程，以了解顶级工程团队用来提高构建速度的一些技巧。
:::

Gradle提供了多种机制来配置Gradle本身和特定项目的行为。以下是使用这些机制的参考。

在配置Gradle行为时，您可以使用以下方法，以从高到低的优先级顺序列出（第一个优先级最高）：

- [Command-line flags](https://docs.gradle.org/current/userguide/command_line_interface.html#command_line_interface)，例如`--build-cache`。这些优先于属性和环境变量。

- [System properties](#系统属性)，例如存储在`gradle.properties`文件中的`systemProp.http.proxyHost=somehost.org`。

- [Gradle properties](#gradle属性)，例如`org.gradle.caching=true`，通常存储在项目根目录或`GRADLE_USER_HOME`环境变量的`gradle.properties`文件中。

- [Environment variables](#环境变量)，例如执行Gradle的环境来源的`GRADLE_OPTS`。

除了配置构建环境之外，还可以使用[Project properties](#project属性)（例如`-PreleaseType=final`）配置给定的项目构建。

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

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  task printProps {
      doLast {
          println commandLineProjectProp
          println gradlePropertiesProp
          println systemProjectProp
          println System.properties['system']
      }
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  // Project properties can be accessed via delegation
  val commandLineProjectProp: String by project
  val gradlePropertiesProp: String by project
  val systemProjectProp: String by project

  tasks.register("printProps") {
      doLast {
          println(commandLineProjectProp)
          println(gradlePropertiesProp)
          println(systemProjectProp)
          println(System.getProperty("system"))
      }
  }
  ```

  </template>
</CodeSwitcher>

``` sh {1}
$ gradle -q -PcommandLineProjectProp=commandLineProjectPropValue -Dorg.gradle.project.systemProjectProp=systemPropertyValue printProps
commandLineProjectPropValue
gradlePropertiesValue
systemPropertyValue
systemValue
```

## 系统属性

使用`-D`命令行选项，可以将系统属性传递给运行Gradle的JVM。 gradle命令的`-D`选项与`java`命令的`-D`选项具有相同的效果。

您还可以在`gradle.properties`文件中使用前缀`systemProp`设置系统属性。

**在`gradle.properties`中指定系统属性**

``` properties
systemProp.gradle.wrapperUser=myuser
systemProp.gradle.wrapperPassword=mypassword
```

以下系统属性可用。请注意，**命令行选项优先于系统属性**。

- **`gradle.wrapperUser=(myuser)`**

  指定用户名以使用HTTP基本认证从服务器下载Gradle发行版。在[Authenticated wrapper下载](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:authenticated_download)中了解更多信息。

- **`gradle.wrapperPassword=(mypassword)`**

  指定使用Gradle包装器下载Gradle发行版的密码。

- **`gradle.user.home=(path to directory)`**

  指定Gradle用户的主目录。

在多项目构建中，将忽略除根目录以外的任何项目中设置的“`systemProp.`”属性。也就是说，将仅检查根项目的`gradle.properties`文件中以“`systemProp.`”前缀开头的属性。

## 环境变量

以下环境变量可用于`gradle`命令。请注意，**命令行选项和系统属性优先于环境变量**。

- **`GRADLE_OPTS`**

  指定启动Gradle客户端VM时要使用的JVM参数。客户端VM仅处理命令行输入/输出，因此很少需要更改其VM选项。实际的构建由 **Gradle Daemon** 运行，不受此环境变量的影响。

- **`GRADLE_USER_HOME`**

  指定Gradle用户的主目录（如果未设置，则默认为`$USER_HOME/.gradle`）。

- **`JAVA_HOME`**

  指定要用于客户端VM的JDK安装目录。除非在`org.gradle.java.home`的Gradle属性文件中指定了另一个虚拟机，否则此VM也用于守护进程。

## Project属性

您可以通过`-P`命令行选项将属性直接添加到[Project](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html)对象。

当Gradle看到特别命名的系统属性或环境变量时，它也可以设置项目属性。如果环境变量名称看起来像`ORG_GRADLE_PROJECT_prop=somevalue`，则Gradle将在项目对象上设置`prop`属性，其值为`somevalue`。 Gradle也为系统属性支持此功能，但是具有不同的命名模式，类似于`org.gradle.project.prop`。以下两个都将Project对象上的`foo`属性设置为“`bar`”。

**通过系统属性设置Project属性**

``` properties
org.gradle.project.foo=bar
```

**通过环境变量设置Project属性**

```
ORG_GRADLE_PROJECT_foo=bar
```

::: tip
**用户主目录中的属性文件优先于Project目录中的属性文件。**
:::

如果您没有持续集成服务器的管理员权限，并且需要设置不容易看到的属性值，则此功能非常有用。由于您不能在那种情况下使用`-P`选项，也不能更改系统级配置文件，因此正确的策略是更改持续集成构建作业的配置，并添加与预期模式匹配的环境变量设置。这对于系统上的普通用户是不可见的。

您可以像使用变量一样使用名称来访问构建脚本中的Project属性。

::: tip
如果引用了Project属性但该属性不存在，则将引发异常，并且构建将失败。

在使用[Project.hasProperty(java.lang.String)](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#org.gradle.api.Project:hasProperty(java.lang.String))方法访问可选Project属性之前，应检查其是否存在。
:::

## 配置JVM内存

您可以通过以下方式调整Gradle的JVM选项：

`org.gradle.jvmargs`Gradle属性控制运行构建的VM。默认为`-Xmx512m "-XX:MaxMetaspaceSize=256m"`

**更改构建VM的JVM设置**

```
org.gradle.jvmargs=-Xmx2g -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

`JAVA_OPTS`环境变量控制命令行客户端，该命令行客户端仅用于显示控制台输出。默认为`-Xmx64m`。

**更改客户端VM的JVM设置**

```
JAVA_OPTS="-Xmx64m -XX:MaxPermSize=64m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8"
```

::: tip
在一种情况下，客户端VM也可以用作构建VM：如果停用[Gradle Daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html#gradle_daemon)，并且客户端VM具有与构建VM所需的相同设置，则客户端VM将直接运行构建。否则，客户端虚拟机将派生一个新的虚拟机来运行实际的构建，以便采用不同的设置。
:::

某些任务（例如`test`任务）也会派生其他JVM进程。您可以通过任务本身来配置它们。它们默认都使用`-Xmx512m`。

示例2.为[JavaCompile](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.compile.JavaCompile.html)任务设置Java编译选项

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  plugins {
      id 'java'
  }

  tasks.withType(JavaCompile) {
      options.compilerArgs += ['-Xdoclint:none', '-Xlint:none', '-nowarn']
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  plugins {
      java
  }

  tasks.withType<JavaCompile>().configureEach {
      options.compilerArgs = listOf("-Xdoclint:none", "-Xlint:none", "-nowarn")
  }
  ```

  </template>
</CodeSwitcher>

请参阅[Test](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.testing.Test.html) API文档中的其他示例，以及[Java插件参考中的测试执行](https://docs.gradle.org/current/userguide/java_testing.html#sec:test_execution)。

使用`--scan`选项时，[Build scans](https://scans.gradle.com/?_ga=2.61875884.1480847771.1569235223-1279986108.1569235223)将告诉您有关执行构建的JVM的信息。

![](https://docs.gradle.org/current/userguide/img/build-scan-infrastructure.png)

## 使用Project属性配置任务

可以根据调用时指定的项目属性来更改任务的行为。

假设您想确保发布版本仅由CI触发。一种简单的方法是通过`isCI`项目属性。

例子3.防止CI外部发布

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  task performRelease {
      doLast {
          if (project.hasProperty("isCI")) {
              println("Performing release actions")
          } else {
              throw new InvalidUserDataException("Cannot perform release outside of CI")
          }
      }
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  tasks.register("performRelease") {
      doLast {
          if (project.hasProperty("isCI")) {
              println("Performing release actions")
          } else {
              throw InvalidUserDataException("Cannot perform release outside of CI")
          }
      }
  }
  ```

  </template>
</CodeSwitcher>

``` sh {1}
$ gradle performRelease -PisCI=true --quiet
Performing release actions
```

## 通过HTTP代理访问web

通过标准JVM系统属性来配置HTTP或HTTPS代理（例如，用于下载依赖项）。这些属性可以直接在构建脚本中设置。例如，设置HTTP代理主机将通过`System.setProperty('http.proxyHost', 'www.somehost.org')`完成。另外，可以[在gradle.properties中指定属性](#gradle属性)。

**使用`gradle.properties`配置HTTP代理**

``` properties
systemProp.http.proxyHost=www.somehost.org
systemProp.http.proxyPort=8080
systemProp.http.proxyUser=userid
systemProp.http.proxyPassword=password
systemProp.http.nonProxyHosts=*.nonproxyrepos.com|localhost
```

HTTPS有单独的设置。

**使用`gradle.properties`配置HTTPS代理**

``` properties
systemProp.https.proxyHost=www.somehost.org
systemProp.https.proxyPort=8080
systemProp.https.proxyUser=userid
systemProp.https.proxyPassword=password
systemProp.https.nonProxyHosts=*.nonproxyrepos.com|localhost
```

您可能需要设置其他属性才能访问其他网络。这里有2个参考可能会有所帮助：

- [ProxySetup.java in the Ant codebase](https://git-wip-us.apache.org/repos/asf?p=ant.git;a=blob;f=src/main/org/apache/tools/ant/util/ProxySetup.java;hb=HEAD)

- [JDK 7 Networking Properties](http://download.oracle.com/javase/7/docs/technotes/guides/net/properties.html)

### NTLM身份验证

如果您的代理服务器需要NTLM身份验证，则可能需要提供身份验证域以及用户名和密码。您可以通过两种方式提供用于向NTLM代理进行身份验证的域：

- 将`http.proxyUser`系统属性设置为`domain/username`之类的值。

- 通过`http.auth.ntlm.domain`系统属性提供身份验证域。
