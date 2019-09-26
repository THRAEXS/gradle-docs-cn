---
title: Gradle是什么？
date: 2019-09-25 09:44:00
---

# {{ $page.title }}

> [原文链接](https://docs.gradle.org/current/userguide/what_is_gradle.html#what_is_gradle)

[[toc]]

## 概述

Gradle是一个开放源代码的[自动化构建](1)工具，旨在灵活地构建几乎任何类型的软件。以下是其一些最重要功能的高级概述：

- **High performance(高性能)**

  Gradle通过仅运行需要运行的任务来避免不必要的工作，因为它们的输入或输出已更改。您还可以使用构建缓存来重用以前运行的任务输出，甚至可以重用其他机器（带有共享构建缓存）的任务输出。

  Gradle还实施了许多其他优化措施，并且开发团队不断努力以提高Gradle的性能。

- **JVM foundation(JVM基础)**

  Gradle在JVM上运行，并且必须安装Java开发工具包（JDK）才能使用它。对于熟悉Java平台的用户来说，这是一个好处，因为您可以在构建逻辑中使用标准Java API，例如自定义任务类型和插件。它还使在不同平台上运行Gradle变得容易。

  请注意，Gradle不仅限于构建JVM项目，它甚至附带对构建本机项目的支持。

- **Conventions(约定)**

  Gradle从Maven的书中抽出了一片叶子，并使常见类型的项目（例如Java项目）易于通过实现约定来构建。应用适当的插件，您可以轻松地为许多项目使用苗条的构建脚本。但是这些约定并没有限制您：Gradle允许您覆盖它们，添加自己的任务以及对基于约定的构建进行许多其他自定义。

- **Extensibility(可扩展性)**

  您可以轻松扩展Gradle以提供您自己的任务类型甚至构建模型。有关此示例，请参见Android构建支持：它添加了许多新的构建概念，例如口味和构建类型。

- **IDE support(IDE支持)**

  几个主要的IDE允许您导入Gradle构建并与其进行交互：Android Studio，IntelliJ IDEA，Eclipse和NetBeans。 Gradle还支持生成将项目加载到Visual Studio所需的解决方案文件。

- **Insight(洞察力)**

  [Build scans](https://scans.gradle.com/?_ga=2.70265232.1480847771.1569235223-1279986108.1569235223)提供了有关构建运行的广泛信息，可用于识别构建问题。他们特别擅长帮助您确定构建性能方面的问题。您还可以与其他人共享构建扫描，如果您在解决构建问题时需要征求意见，这将特别有用。

## 您需要了解有关Gradle的五件事

Gradle是一种灵活而强大的构建工具，当您初次启动时，很容易感到恐惧。但是，了解以下核心原则将使Gradle更加容易上手，并且您将在不了解该工具的情况下熟练掌握它。


### 1.Gradle是通用构建工具

Gradle允许您构建任何软件，因为它对要构建的内容或应如何完成的工作几乎没有任何假设。最明显的限制是，依赖项管理当前仅支持与Maven和Ivy兼容的存储库以及文件系统。

这并不意味着您需要做很多工作来创建构建。借助添加[插件](https://docs.gradle.org/current/userguide/plugins.html#plugins)的约定和预构建功能，Gradle可以轻松构建常见类型的项目（例如Java库）。您甚至可以创建和发布自定义插件来封装自己的约定并构建功能。

### 2.核心模型基于任务

Gradle将其构建模型建模为任务（工作单元）的 **Directed Acyclic Graphs (DAGs)**。这意味着构建实质上是配置一组任务并将其连接在一起 —— 基于它们的依赖关系 —— 以创建该DAG。创建任务图后，Gradle将确定需要按顺序运行的任务，然后继续执行它们。

此图显示了两个示例任务图，一个是抽象图，另一个是具体图，其中任务之间的依赖性表示为箭头：

![Figure 1. Two examples of Gradle task graphs](https://docs.gradle.org/current/userguide/img/task-dag-examples.png)

这样，几乎所有构建过程都可以建模为任务图，这就是Gradle如此灵活的原因之一。任务图可以由插件和您自己的构建脚本定义，任务通过任务依赖机制链接在一起。

任务本身包括：

- Actions: 做某事的工作，例如复制文件或编译源代码

- Inputs: actions使用或操作的values，files和directories

- Outputs: actions修改或生成的files和directories

实际上，以上所有内容都是可选的，具体取决于任务需要执行的操作。有些任务 —— 例如[标准生命周期任务](https://docs.gradle.org/current/userguide/base_plugin.html#sec:base_tasks) —— 甚至没有任何动作。他们只是为了方便而将多个任务聚合在一起。

::: tip
您可以选择运行哪个任务。通过指定执行所需任务来节省时间，但不要超过这个范围。如果您只想运行单元测试，请选择执行该任务的任务 —— 通常是`test`。如果您想打包应用程序，大多数构建都有相应的`assemble`任务。
:::

最后一件事：Gradle的[增量构建](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)支持是强大且可靠的，因此，除非您确实想要执行清理，否则避免清理任务可保持构建快速运行。

### 3.Gradle有几个固定的构建阶段

重要的是要了解Gradle分三个阶段评估和执行构建脚本：

1. Initialization

    设置构建环境，并确定哪些项目将参与其中。

2. Configuration

    构造和配置用于构建的任务图，然后根据用户要运行的任务确定需要运行的任务和顺序。

3. Execution

    运行在配置阶段结束时选择的任务。

这些阶段构成了Gradle的[Build Lifecycle](https://docs.gradle.org/current/userguide/build_lifecycle.html#build_lifecycle)。

::: tip
**与Apache Maven术语的比较**

Gradle的构建阶段与Maven的阶段不同。 Maven使用其阶段将构建执行划分为多个阶段。它们的作用类似于Gradle的任务图，但灵活性较差。

Maven的构建生命周期概念与Gradle的[lifecycle tasks](https://docs.gradle.org/current/userguide/base_plugin.html#sec:base_tasks)大致相似。
:::

设计良好的构建脚本主要由声明性配置而不是命令性逻辑组成。可以理解，在配置阶段评估该配置。即便如此，许多此类构建也具有任务操作（例如，通过`doLast {}` 和`doFirst {}`块），这些任务在执行阶段进行评估。这很重要，因为在配置阶段评估的代码不会看到在执行阶段发生的更改。

配置阶段的另一个重要方面是，每次运行构建时都会评估其中涉及的所有内容。因此，最佳做法是[在配置阶段避免昂贵的工作](https://docs.gradle.org/current/userguide/authoring_maintainable_build_scripts.html#sec:minimize_logic_executed_configuration_phase)。[Build scans](https://scans.gradle.com/?_ga=2.65399086.1480847771.1569235223-1279986108.1569235223)可以帮助您识别此类热点。

### 4.Gradle的扩展方式不止一种

如果您可以仅使用Gradle捆绑的构建逻辑来构建项目，那将是很好的，但是这种情况很少发生。大多数构建都有一些特殊要求，这意味着您需要添加自定义构建逻辑。

Gradle提供了多种机制来扩展它，例如：

- [自定义任务类型](#custom_task)。

    当您希望构建完成现有任务无法完成的工作时，只需编写自己的任务类型即可。通常最好将自定义任务类型的源文件放在[buildSrc](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources)目录或打包的插件中。然后，您可以像Gradle提供的任何任务一样使用自定义任务类型。

- 自定义任务操作。

    您可以通过`Task.doFirst()`和`Task.doLast()`方法附加在任务之前或之后执行的自定义构建逻辑。

- [projects](https://docs.gradle.org/current/userguide/writing_build_scripts.html#sec:extra_properties)和[tasks](https://docs.gradle.org/current/userguide/writing_build_scripts.html#sec:extra_task_properties)的额外属性。

    这些允许您将自己的属性添加到项目或任务中，然后可以从您自己的自定义操作或任何其他构建逻辑中使用它们。甚至可以将额外的属性应用于您未明确创建的任务，例如由Gradle的核心插件创建的任务。

- 自定义约定。

    约定是简化构建的强大方法，因此用户可以更轻松地理解和使用它们。使用标准项目结构和命名约定的构建（例如[Java builds](https://docs.gradle.org/current/userguide/building_java_projects.html#building_java_projects)）可以看到这一点。您可以编写自己的提供约定的插件 —— 它们只需要为构建的相关方面配置默认值。

- [自定义模型](https://guides.gradle.org/implementing-gradle-plugins/#modeling_dsl_like_apis)。

    Gradle允许您将新概念引入除任务，文件和依赖项配置之外的内部版本。您可以在大多数语言插件中看到这一点，这些插件将[source sets](https://docs.gradle.org/current/userguide/building_java_projects.html#sec:java_source_sets)的概念添加到了构建中。对构建过程进行适当的建模可以大大提高构建的易用性及其效率。

### 5.构建脚本针对API进行操作

将Gradle的构建脚本视为可执行代码很容易，因为这就是它们。但这只是一个实现细节：精心设计的构建脚本描述了构建软件所需的步骤，而不是这些步骤应如何工作。这是定制任务类型和插件的工作。

::: tip
人们普遍误认为Gradle的功能和灵活性来自其构建脚本是代码这一事实。这与事实相去甚远。正是底层模型和API提供了强大的功能。正如我们在最佳实践中建议的那样，您应该[避免在构建脚本中放置太多（如果有）命令式逻辑](https://docs.gradle.org/current/userguide/authoring_maintainable_build_scripts.html#sec:avoid_imperative_logic_in_scripts)。
:::

然而，在一个区域中，将构建脚本视为可执行代码很有用：了解构建脚本的语法如何映射到Gradle的API。由[Groovy DSL Reference](https://docs.gradle.org/current/dsl/)和[Javadocs](https://docs.gradle.org/current/javadoc/)组成的API文档列出了方法和属性，并引用了闭包和操作。这些在构建脚本的上下文中是什么意思？查看[Groovy Build Script Primer](https://docs.gradle.org/current/userguide/groovy_build_script_primer.html#groovy_build_script_primer)，以了解该问题的答案，以便您可以有效地使用API​​文档。

::: tip
由于Gradle在JVM上运行，因此构建脚本也可以使用标准[Java API](https://docs.oracle.com/javase/8/docs/api/)。 Groovy构建脚本可以另外使用Groovy API，而Kotlin构建脚本可以使用Kotlin。
:::
