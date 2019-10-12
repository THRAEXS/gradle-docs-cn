---
title: 创建新的Gradle构建
date: 2019-10-10 09:41:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/creating-new-gradle-builds/)

[[toc]]

遵循本指南，您将创建一个简单的Gradle项目，调用一些基本的Gradle命令，并了解Gradle如何管理该项目。

## 您需要什么

- 约11分钟
- 终端
- Java Runtime Environment(JRE)或Java Development Kit(JDK)，版本1.8或更高版本(仅对于运行Gradle必要)
- [Gradle版本](https://gradle.org/install/)4.10.3或更高版本

::: tip
将显示针对基于Unix的系统的Shell命令。 Windows每个都有类似的命令。
:::

## 初始化项目

首先，让我们创建一个新目录，该目录将用于我们的项目。

``` sh
❯ mkdir basic-demo
❯ cd basic-demo
```

现在，我们可以使用Gradle的`init`命令生成一个简单的项目。我们将探索产生的一切，以便您确切地了解发生了什么。

``` sh {1}
❯ gradle init
Starting a Gradle Daemon (subsequent builds will be faster)

BUILD SUCCESSFUL in 3s
2 actionable tasks: 2 executed
```

如果要使用Kotlin DSL，请使用`gradle init --dsl kotlin`。有关详细信息，请参见[文档](https://docs.gradle.org/4.10.3/userguide/build_init_plugin.html#sec:what_to_set_up)。

该命令应显示"BUILD SUCCESSFUL"，并生成以下"empty"项目。如果没有，请确保[正确安装了Gradle](https://gradle.org/install/)，并且已正确设置了`JAVA_HOME`环境变量。

这就是Gradle为您生成的。

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  ├── build.gradle  
  ├── gradle
  │   └── wrapper
  │       ├── gradle-wrapper.jar  
  │       └── gradle-wrapper.properties  
  ├── gradlew  
  ├── gradlew.bat  
  └── settings.gradle  
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  ├── build.gradle.kts  
  ├── gradle
  │   └── wrapper
  │       ├── gradle-wrapper.jar  
  │       └── gradle-wrapper.properties  
  ├── gradlew  
  ├── gradlew.bat  
  └── settings.gradle.kts  
  ```

  </template>
</CodeSwitcher>

- `build.gradle`: 用于配置当前项目的Gradle构建脚本

- `gradle-wrapper.jar`: [Gradle Wrapper](https://docs.gradle.org/4.10.3/userguide/gradle_wrapper.html)可执行JAR

- `gradle-wrapper.properties`: Gradle Wrapper配置属性

- `gradlew`: 基于Unix的系统的Gradle Wrapper脚本

- `gradlew.bat`: 适用于Windows的Gradle Wrapper脚本

- `settings.gradle`: 用于配置Gradle构建的Gradle设置脚本

::: tip
`gradle init`可以生成[各种不同类型的项目](https://docs.gradle.org/4.10.3/userguide/build_init_plugin.html#sec:build_init_types)，甚至知道如何将简单的`pom.xml`文件转换为Gradle。
:::

Boom! Roasted. 我们可以在这里结束指南，但是您可能想知道如何在该项目中使用Gradle。来做吧。

## 创建一个任务

Gradle提供了用于通过Groovy或基于Kotlin的DSL创建和配置任务的API。一个`Project`包括一组`Task`，每个任务都执行一些基本操作。

Gradle带有一个任务库，您可以在自己的项目中对其进行配置。例如，有一个称为`Copy`的核心类型，它将文件从一个位置复制到另一个位置。`Copy`任务非常有用（有关详细信息，请[参见文档](https://docs.gradle.org/4.10.3/dsl/org.gradle.api.tasks.Copy.html)），但是这里还是让我们保持简单。执行以下步骤：

1. 创建一个名为`src`的目录。

2. 在`src`目录中添加一个名为`myfile.txt`的文件。内容是任意的（甚至可以为空），但为方便起见，请添加单行`Hello，World!`。

3. 在构建文件中定义一个名为`Copy`类型的`copy`的任务（注意大写字母），该任务将`src`目录复制到名为`dest`的新目录中。 （您不必创建`dest`目录，任务将为您完成。）

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  task copy(type: Copy, group: "Custom", description: "Copies sources to the dest directory") {
      from "src"
      into "dest"
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  tasks.create<Copy>("copy") {
      description = "Copies sources to the dest directory"
      group = "Custom"

      from("src")
      into("dest")
  }  
  ```

  </template>
</CodeSwitcher>

在这里，`group`和`description`可以是您想要的任何东西。您甚至可以忽略它们，但是这样做也会在以后使用的任务报告中忽略它们。

现在执行新的`copy`任务：

``` sh
❯ ./gradlew copy
> Task :copy

BUILD SUCCESSFUL in 0s
1 actionable task: 1 executed
```

通过检查`dest`目录中现在是否存在一个名为`myfile.txt`的文件，并且其内容与`src`目录中相同文件的内容相匹配，来验证它是否按预期工作。

## 应用插件

Gradle包括一系列插件，并且在[Gradle插件门户](https://plugins.gradle.org)上可以找到许多很多插件。发行版随附的插件之一是`base`插件。结合称为[Zip](https://docs.gradle.org/4.10.3/dsl/org.gradle.api.tasks.bundling.Zip.html)的核心类型，您可以使用配置的名称和位置创建项目的zip存档。

使用`plugins`语法将`base`插件添加到您的构建脚本文件中。确保在文件顶部添加`plugins {}`块。

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  plugins {
      id "base"
  }

  ... rest of the build file ...
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  plugins {
      id("base")
  }

  ... rest of the build file ...
  ```

  </template>
</CodeSwitcher>

现在添加一个任务，该任务从`src`目录创建一个zip存档。

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  task zip(type: Zip, group: "Archive", description: "Archives sources in a zip file") {
      from "src"
      setArchiveName "basic-demo-1.0.zip"
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  tasks.create<Zip>("zip") {
      description = "Archives sources in a zip file"
      group = "Archive"

      from("src")
      setArchiveName("basic-demo-1.0.zip")
  }
  ```

  </template>
</CodeSwitcher>

`base`插件与设置一起使用，以在`build/distributions`文件夹中创建一个名为`basic-demo-1.0.zip`的存档文件。

在这种情况下，只需运行新的`zip`任务，然后查看生成的zip文件是否在您期望的位置。

``` sh
❯ ./gradlew zip
> Task :zip

BUILD SUCCESSFUL in 0s
1 actionable task: 1 executed
```

## 探索和调试您的构建

让我们看看在新项目中，Gradle还可以做什么。还提供了对[命令行界面的完整参考](https://docs.gradle.org/4.10.3/userguide/command_line_interface.html)。

### 发现可用`tasks`

`tasks`命令列出了您可以调用的Gradle任务，包括由`base`插件添加的任务，以及刚刚添加的自定义任务。

``` sh
❯ ./gradlew tasks

> Task :tasks

------------------------------------------------------------
All tasks runnable from root project
------------------------------------------------------------

Archive tasks
-------------
zip - Archives sources in a zip file

Build tasks
-----------
assemble - Assembles the outputs of this project.
build - Assembles and tests this project.
clean - Deletes the build directory.

Build Setup tasks
-----------------
init - Initializes a new Gradle build.
wrapper - Generates Gradle wrapper files.

Custom tasks
------------
copy - Simply copies sources to a the build directory

Help tasks
----------
buildEnvironment - Displays all buildscript dependencies declared in root project 'basic-demo'.
components - Displays the components produced by root project 'basic-demo'. [incubating]
dependencies - Displays all dependencies declared in root project 'basic-demo'.
dependencyInsight - Displays the insight into a specific dependency in root project 'basic-demo'.
dependentComponents - Displays the dependent components of components in root project 'basic-demo'. [incubating]
help - Displays a help message.
model - Displays the configuration model of root project 'basic-demo'. [incubating]
projects - Displays the sub-projects of root project 'basic-demo'.
properties - Displays the properties of root project 'basic-demo'.
tasks - Displays the tasks runnable from root project 'basic-demo'.

Verification tasks
------------------
check - Runs all checks.

Rules
-----
Pattern: clean<TaskName>: Cleans the output files of a task.
Pattern: build<ConfigurationName>: Assembles the artifacts of a configuration.
Pattern: upload<ConfigurationName>: Assembles and uploads the artifacts belonging to a configuration.

To see all tasks and more detail, run gradlew tasks --all

To see more detail about a task, run gradlew help --task <task>

BUILD SUCCESSFUL in 0s
1 actionable task: 1 executed
```

### 分析和调试您的构建

Gradle还提供了基于构建的丰富的基于Web的视图，称为[build scan](https://scans.gradle.com/?_ga=2.103180743.672448668.1570584104-1564571921.1570494734)。

![build scan](https://guides.gradle.org/creating-new-gradle-builds/images/basic-demo-build-scan.png)

通过使用`--scan`选项或将构建扫描插件显式应用于您的项目，您可以在[scans.gradle.com](https://scans.gradle.com/?_ga=2.7884661.672448668.1570584104-1564571921.1570494734)免费创建构建扫描。将构建扫描发布到scans.gradle.com会将[这些](https://docs.gradle.com/build-scan-plugin/?_ga=2.7884661.672448668.1570584104-1564571921.1570494734#captured_information)数据传输到Gradle的服务器。要将数据保存在自己的服务器上，请签出[Gradle Enterprise](https://gradle.com/enterprise?_ga=2.105906628.672448668.1570584104-1564571921.1570494734)。

尝试通过在执行任务时添加`--scan`来创建构建扫描。

``` sh
❯ ./gradlew zip --scan

BUILD SUCCESSFUL in 0s
1 actionable task: 1 up-to-date

Publishing a build scan to scans.gradle.com requires accepting the Terms of Service defined at https://scans.gradle.com/terms-of-service. Do you accept these terms? [yes, no]
Gradle Cloud Services license agreement accepted.

Publishing build scan...
https://gradle.com/s/repnge6srr5qs
```

如果浏览构建扫描，则应该能够轻松找出执行了哪些任务，花费了多长时间，应用了哪些插件等等。下一次在StackOverflow上调试某些内容时，请考虑共享构建扫描。

在[《构建扫描插件用户手册》](https://docs.gradle.com/build-scan-plugin/?_ga=2.261989962.672448668.1570584104-1564571921.1570494734)中了解有关如何配置和使用构建扫描的更多信息。

### 发现可用属性

`properties`命令可告诉您有关项目属性的信息。

``` sh
❯ ./gradlew properties
```

输出是广泛的。以下是一些可用的属性：

``` sh
> Task :properties

------------------------------------------------------------
Root project
------------------------------------------------------------

buildDir: /Users/.../basic-demo/build
buildFile: /Users/.../basic-demo/build.gradle
description: null
group:
name: basic-demo
projectDir: /Users/.../basic-demo
version: unspecified

BUILD SUCCESSFUL
```

默认情况下，项目`name`与文件夹名称匹配。您还可以指定`group`和`version`属性，但目前它们采用其默认值，如`description`所示。

`buildFile`属性是构建脚本的标准路径名，默认情况下位于`projectDir`中。

您可以更改许多属性。例如，您可以尝试将以下行添加到构建脚本文件中，然后重新执行`gradle properties`。

``` properties
description = "A trivial Gradle build"
version = "1.0"
```

## 下一步

恭喜你！您已经创建了新的Gradle构建并学习了如何检查Gradle构建！

您可能想为特定平台创建库或应用程序，因此以下是一些指南，这些指南将教您有关在所选平台上创建构建的更多信息：

- [Building Android Apps](https://developer.android.com/training/basics/firstapp/)
- [Building Java Libraries](https://guides.gradle.org/building-java-libraries/)
- [Building Kotlin JVM Libraries](https://guides.gradle.org/building-kotlin-jvm-libraries/)
- [Building C++ Applications](https://guides.gradle.org/building-cpp-applications/)
- [Building Groovy Libraries](https://guides.gradle.org/building-groovy-libraries/)
- [Building Scala Libraries](https://guides.gradle.org/building-scala-libraries/)

您还可以[在GitHub上签出许多示例Gradle构建](https://github.com/gradle/gradle/tree/master/subprojects/docs/src/samples)。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/creating-new-gradle-builds](https://github.com/gradle-guides/creating-new-gradle-builds/)中添加问题或请求，我们将尽快与您联系。
