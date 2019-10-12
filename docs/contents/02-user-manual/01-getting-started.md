---
title: 入门
date: 2019-09-24 08:36:00
---

# {{ $page.title }}

> [原文链接](https://docs.gradle.org/current/userguide/getting_started.html)

[[toc]]

每个人都必须从某个地方开始，如果您是Gradle的新手，那么这就是开始的地方。

## 开始前

为了有效地使用Gradle，您需要了解Gradle是什么并了解其一些基本概念。因此，在您开始认真使用Gradle之前，我们强烈建议您阅读[Gradle是什么?](https://docs.gradle.org/current/userguide/what_is_gradle.html#what_is_gradle)。

即使您有使用Gradle的经验，我们还是建议您阅读[有关Gradle的第5部分要了解的知识](https://docs.gradle.org/current/userguide/what_is_gradle.html#five_things)，因为它可以消除一些常见的误解。

## 安装

如果您要做的只是运行现有的Gradle构建，那么如果构建具有[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html#gradle_wrapper)，则无需安装Gradle，可以通过构建根目录中的`gradlew`和/或`gradlew.bat`文件进行识别。您只需要确保您的系统满足[Gradle的先决条件](https://docs.gradle.org/current/userguide/installation.html#sec:prerequisites)即可。

Android Studio已安装有效的Gradle，因此在这种情况下，您无需单独安装Gradle。

为了创建一个新的构建或将一个**Wrapper**添加到一个现有的构建，您将需要[根据这些说明](https://docs.gradle.org/current/userguide/installation.html#installation)安装Gradle。请注意，除了该页面上所述的方法以外，还有其他安装Gradle的方法，因为几乎不可能跟踪所有的程序包管理器。

## 尝试Gradle

积极使用Gradle是了解它的好方法，因此，一旦安装了Gradle，请尝试以下入门实践教程之一：

- [Creating a basic Gradle build(创建一个基本的Gradle构建)](/guides/01-getting-started/01-creating-new-gradle-builds)
- [Building Android apps(构建Android应用)](https://developer.android.com/training/basics/firstapp/)
- [Building Java libraries(构建Java库)](https://guides.gradle.org/building-java-libraries/)
- [Building Kotlin JVM libraries(构建Kotlin JVM库)](https://guides.gradle.org/building-kotlin-jvm-libraries/)
- [Building C++ libraries(构建C++库)](https://guides.gradle.org/building-cpp-libraries/)
- [Creating build scans(创建构建扫描)](/guides/01-getting-started/02-creating-build-scans)

还有许多其他[教程和指南](https://gradle.org/guides/)可用，您可以按类别进行过滤-例如[基础知识](https://gradle.org/guides/?q=Fundamentals)。

## 命令行与IDE

有些人是命令行重度用户，而另一些人则更喜欢使用IDE。许多人愉快地使用两者，Gradle努力兼容。[几个主要的IDE](https://docs.gradle.org/current/userguide/third_party_integration.html#ides)支持Gradle，并且可以通过IDE调用[Tooling API](https://docs.gradle.org/current/userguide/embedding.html#embedding)进行命令行中的所有操作。

Android Studio和IntelliJ IDEA用户在编辑它们时应考虑使用[Kotlin DSL build scripts](https://docs.gradle.org/current/userguide/kotlin_dsl.html#kotlin_dsl)来获得高级IDE支持。

## 执行Gradle构建

如果您遵循[上面链接](#尝试gradle)的任何教程，则将执行Gradle构建。但是，如果没有任何说明就获得了Gradle构建，该怎么办？

以下是一些有用的步骤：

1. 确定项目是否具有 **Gradle Wrapper** ，并在其中[使用它](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:using_wrapper) - 主IDE默认在可用时使用包装器。

2. 发现项目结构。

    可以使用IDE导入构建，也可以从命令行运行`gradle projects`。如果仅列出了根项目，则为单项目构建。否则，它是一个[多项目构建](https://docs.gradle.org/current/userguide/intro_multi_project_builds.html#intro_multi_project_builds)。

3. 找出可以运行的任务。

    如果已将内部版本导入到IDE，则应该有权访问显示所有可用任务的视图。从命令行运行`gradle tasks`。

4. 通过`gradle help --task <taskname>`了解更多有关任务的信息。

    `help`任务可以显示有关任务的其他信息，包括哪些项目包含该任务以及该任务支持哪些选项。

5. 运行您感兴趣的任务。

    许多基于约定的构建都与Gradle的[生命周期任务](https://docs.gradle.org/current/userguide/base_plugin.html#sec:base_tasks)集成在一起，因此，当您对构建没有更具体的要求时，可以使用它们。例如，大多数构建都有`clean`, `check`, `assemble`和`build`任务。

    在命令行中，只需运行`gradle <taskname>`即可执行特定任务。您可以在[相应的用户手册章节](https://docs.gradle.org/current/userguide/command_line_interface.html#command_line_interface)中了解有关命令行执行的更多信息。如果您使用的是IDE，请查看其文档以了解如何运行任务。

Gradle构建通常会在项目结构和任务上遵循标准约定，因此，如果您熟悉相同类型的其他构建（例如Java，Android或本机构建），那么也应熟悉构建的文件和目录结构以及许多任务和项目属性。

对于更专业的构建或具有重大定制的构建，理想情况下，您应该可以访问有关如何运行构建以及可以配置哪些[build properties](https://docs.gradle.org/current/userguide/build_environment.html#build_environment)的文档。

## 编写Gradle构建

学习创建和维护Gradle构建是一个过程，需要花费一些时间。我们建议您从适用于您项目的适当核心插件及其约定开始，然后在您进一步了解该工具时逐渐合并自定义项。

以下是掌握Gradle的一些有用的第一步：

1. 尝试一两个[基本教程](#尝试gradle)，以了解Gradle构建的概貌，特别是与您使用的项目类型（Java，本机，Android等）相匹配的构建。

2. 确保您已阅读[有关Gradle的5件事](https://docs.gradle.org/current/userguide/what_is_gradle.html#five_things)！

3. 了解Gradle构建的基本元素：[projects](https://docs.gradle.org/current/userguide/tutorial_using_tasks.html#sec:projects_and_tasks)，[tasks](https://docs.gradle.org/current/userguide/more_about_tasks.html#more_about_tasks)和[file API](https://docs.gradle.org/current/userguide/working_with_files.html#working_with_files)。

4. 如果要为JVM构建软件，请确保在[Building Java & JVM projects](https://docs.gradle.org/current/userguide/building_java_projects.html#building_java_projects)以及[Testing in Java & JVM projects](https://docs.gradle.org/current/userguide/java_testing.html#java_testing)中阅读有关这些类型项目的详细信息。

5. 熟悉Gradle自带的[核心插件](https://docs.gradle.org/current/userguide/plugin_reference.html#plugin_reference)，因为它们提供了许多开箱即用的有用功能。

6. 了解如何[编写可维护的构建脚本](https://docs.gradle.org/current/userguide/authoring_maintainable_build_scripts.html#authoring_maintainable_build_scripts)以及[如何最好地组织Gradle项目](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#organizing_gradle_projects)。

该用户手册包含许多其他有用的信息，您可以在[Gradle Guides](https://gradle.org/guides/)中找到有关Gradle各种功能的更多教程。

## Gradle与第三方工具集成

Gradle的灵活性意味着它可以轻松地与其他工具配合使用，例如在[Gradle & Third-party Tools](https://docs.gradle.org/current/userguide/third_party_integration.html#third_party_integration)页面上列出的工具。

集成有两种主要模式：

- 工具驱动Gradle — 用它来提取有关构建的信息并通过[Tooling API](https://docs.gradle.org/current/userguide/embedding.html#embedding)运行它

- Gradle通过第三方工具的API调用或生成工具信息 - 通常是通过插件和自定义任务类型来完成

具有现有的基于Java的API的工具通常易于集成。您可以在Gradle的[插件门户](https://plugins.gradle.org)网站上找到许多此类集成。
