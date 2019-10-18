---
title: 设计Gradle插件
date: 2019-10-17 16:22:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/designing-gradle-plugins/)

[[toc]]

对于Gradle的初学者来说，实现插件似乎是一项艰巨的任务，其中包括许多注意事项和深厚的知识：组织和构造插件逻辑，测试和调试插件代码以及将插件构件发布到存储库中以供使用。您可以在[插件开发指南](https://gradle.org/guides/?q=Plugin%20Development)中找到许多问题的答案。

本指南是一系列主题指南的第一部分，深入介绍了Gradle插件开发的各个方面。您将学习如何根据既定做法正确设计Gradle插件并将其应用于您自己的项目。

本指南假定您具有：

- 对软件工程实践的基本了解

- 了解Gradle基础知识，例如项目组织，任务创建和配置以及Gradle构建生命周期

如果您碰巧是Gradle的初学者，请先阅读Gradle使用手册，然后再阅读Gradle用户手册，以更深入地了解入门指南。

如果你是一个刚开始使用Gradle的人，请先从[使用Gradle的入门指南](/guides/01-getting-started/01-creating-new-gradle-builds)开始，同时参考[Gradle用户手册](/contents/01-docs-home/)进行更深入的学习。

## 1. 体系结构

### 1.1. 可重用逻辑应写为二进制插件

Gradle用户手册区分了两种类型的插件：[脚本插件和二进制插件](https://docs.gradle.org/current/userguide/plugins.html#sec:types_of_plugins)。脚本插件基本上只是具有不同名称的普通Gradle构建脚本。尽管脚本插件可以在Gradle项目中组织构建逻辑，但是很难保持它们的良好维护，它们很难测试，因此您无法在其中定义新的可重用类型。

每当需要在独立项目中重用或共享逻辑时，都应使用[二进制插件](https://docs.gradle.org/current/userguide/plugins.html#sec:binary_plugins)。它们允许将代码正确地构造为类和包，是可缓存的，可以遵循版本控制方案以实现平稳的升级过程，并且易于测试。

### 1.2. 考虑对性能的影响

作为Gradle插件的开发者，你可以完全自由地定义和组织代码。任何可以想象到的逻辑都可以实现。在设计Gradle插件时，一定要注意对最终用户的影响。看似简单的逻辑可能对构建的执行性能产生相当大的影响。特别是当插件的代码在[构建生命周期的配置阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases)执行时，例如通过遍历它们来解决依赖关系、进行HTTP调用或写入文件。[优化Gradle构建性能](https://guides.gradle.org/performance/)的指南将为您提供额外的代码示例、缺陷和建议。

在编写插件代码时，请考虑一下代码是否应该在执行阶段运行。如果您怀疑您的插件代码有问题，请尝试创建一个[构建扫描](https://scans.gradle.com/?_ga=2.52496993.896254753.1571010126-1564571921.1570494734)来识别瓶颈。[Gradle profiler](https://github.com/gradle/gradle-profiler)可以帮助自动构建扫描生成和收集更多的底层信息。

### 1.3. 约定优于配置

约定优于配置是一种软件工程范式，它允许工具或框架尝试减少用户必须做出的决策数量而不会失去灵活性。对于Gradle插件意味着什么？ Gradle插件可以在特定情况下为用户提供合理的默认值和标准(**_conventions_**)。让我们以[Java插件](https://docs.gradle.org/current/userguide/java_plugin.html)为例。

- 它将目录`src/main/java`定义为编译的默认源目录。

- 编译后的源代码和其他构件(如JAR文件)的输出目录将被构建。

只要插件的用户不喜欢使用其他约定，使用的构建脚本中就不需要其他配置。它开箱即用。但是，如果用户喜欢其他标准，则可以重新配置默认约定。您将两全其美。

实际上，您会发现大多数用户都对默认约定感到满意，直到有充分的理由更改它们为止，例如，如果您必须使用旧项目。编写自己的插件时，请确保选择合理的默认值。如果您发现大多数插件使用者不必重新配置它们，则可以了解是否为插件选择了合理的约定。

让我们来看一个插件引入的约定的示例。该插件通过进行HTTP调用从服务器检索信息。插件使用的默认URL配置为指向开发插件的组织内的服务器：[http://www.myorg.com/server](http://www.myorg.com/server)。使默认URL可配置的一个好方法是引入扩展名。一个扩展公开了一个自定义DSL，用于捕获影响运行时行为的用户输入。以下示例显示了所讨论示例的定制DSL：

__build.gradle__
``` groovy
apply plugin: 'org.myorg.server'

server {
    url = 'http://localhost:8080/server'
}
```

如您所见，用户仅声明"what"（即插件应与之联系的服务器）。最终用户完全看不到实际的内部工作原理-"how"。

### 1.4. 功能与约定

插件带来的功能可能非常强大，但也很顽固。如果插件预先定义了项目在应用时自动继承的任务和约定，则尤其如此。有时，作为插件开发人员，为用户选择的实际情况与预期不同。因此，您需要使插件尽可能灵活和可配置。

提供这些质量标准的一种方法是将功能与约定分开。实际上，这意味着将通用功能与预先配置的自有功能分开。让我们看一个例子来解释这个看似抽象的概念。有两个Gradle核心插件完美地展示了这一概念：[Java基本插件](https://docs.gradle.org/current/userguide/plugin_reference.html#sec:base_plugins)和[Java插件](https://docs.gradle.org/current/userguide/java_plugin.html)。

- Java基本插件仅提供了非自定义的功能和通用概念。例如，它正式化了SourceSet的概念并引入了依赖管理配置。但是，它实际上并不创建您作为Java开发人员经常使用的任务，也不会创建SourceSet实例。

- Java插件在内部应用Java基本插件并继承其所有功能。最重要的是，它创建SourceSet实例（例如`main`和`test`），并创建Java开发人员众所周知的任务，例如`classes`，`jar`或`javadoc`。它还在对域有意义的那些任务之间建立了生命周期。

![Java plugin apply](https://guides.gradle.org/designing-gradle-plugins/images/java-plugin-composition.png)

底线是我们将功能与约定分开。如果用户不喜欢创建的任务，或者不希望重新配置很多约定(因为项目结构不是这样的)，那么他可以回到应用Java基本插件，自己动手解决问题。

在设计自己的插件时，您应该考虑使用相同的技术。您可以在同一个项目中开发这两个插件，并使用相同的二进制构件交付它们的编译类和标识符。以下代码示例显示了如何从另一个插件中应用插件，即所谓的插件组合：

__MyBasePlugin.java__
``` java
import org.gradle.api.Plugin;
import org.gradle.api.Project;

public class MyBasePlugin implements Plugin<Project> {
    public void apply(Project project) {
        // define capabilities
    }
}
```

__MyPlugin.java__
``` java
import org.gradle.api.Plugin;
import org.gradle.api.Project;

public class MyPlugin implements Plugin<Project> {
    public void apply(Project project) {
        project.getPlugins().apply(MyBasePlugin.class);

        // define conventions
    }
}
```

为了获得启发，这里有两个应用该概念的开源插件：

- [Docker plugin](https://github.com/bmuschko/gradle-docker-plugin#provided-plugins)

- [Cargo plugin](https://github.com/bmuschko/gradle-cargo-plugin#provided-plugins)

## 2. 技术

### 2.1. 首选使用静态类型的语言来实现插件

Gradle不限制您应该选择用于实现插件的编程语言。只要插件二进制文件可以在JVM上执行，开发人员就可以选择。

建议使用Java或Kotlin之类的静态类型的语言来实现插件，以减少二进制不兼容的可能性。如果您决定在插件实现中使用Groovy，那么最好使用注解[@groovy.transform.CompileStatic](https://docs.groovy-lang.org/latest/html/gapi/groovy/transform/CompileStatic.html)。

使用静态类型语言的建议独立于为插件代码编写测试的语言选择。使用动态Groovy和（非常强大的测试和模拟框架）[Spock](http://spockframework.org/spock/docs/1.1-rc-3/index.html)是一个非常可行且常见的选择。

### 2.2. 将插件实现限制为Gradle的公共API

为了能够构建Gradle插件，您需要告诉您的项目使用对Gradle API的编译时依赖。您的构建脚本通常将包含以下声明：

__build.gradle__
``` groovy
dependencies {
    compile gradleApi()
}
```

重要的是要了解这种依赖包括完整的Gradle运行时。由于历史原因，尚未将公共和内部Gradle API分开。我们正计划以一种新的方式来明确[区分和声明Gradle API的各个部分](https://github.com/gradle/gradle/issues/1156)。

为了确保与其他Gradle版本的最佳向前和向后兼容性，您应该仅使用公共API。在大多数情况下，它将支持您尝试通过插件支持的用例。请记住，内部API可能会发生变化，并且很容易将您的插件从一个Gradle版本切换到另一个版本。如果您正在寻找当前仅内部使用的公共API，请[在GitHub上打开一个issue](https://github.com/gradle/gradle/issues)。

您如何知道某个类是否属于公共API？如果您可以在[DSL指南](https://docs.gradle.org/current/dsl/)或[javadocs](https://docs.gradle.org/current/javadoc/)中找到引用的类，则可以放心地假定它是公共的。将来，我们计划将公共API与内部API明确分开，这将允许最终用户在构建脚本中声明相关的依赖关系。请关注[GitHub上的相应issue](https://github.com/gradle/gradle/issues/1156)。

### 2.3. 尽量减少使用外部库

作为应用开发人员，我们已经非常习惯于使用外部库来避免编写基本功能。您可能不想离开你心爱的Guava或HttpClient库了。请记住，当通过Gradle的依赖管理系统进行声明时，某些库可能会引入巨大的传递性依赖关系图。依赖性报告不会呈现为构建脚本的`classpath`配置声明的依赖，实际上不会呈现已声明插件的类路径及其传递性依赖。但是，您可以调用帮助任务`buildEnvironment`来呈现完整的依赖关系图。为了演示该功能，我们假设以下构建脚本：

__build.gradle__
``` groovy
plugins {
    id 'org.asciidoctor.gradle.asciidoctor' version '1.5.1'
}
```

任务的输出清楚地指示了`classpath`配置：

``` sh {1}
$ gradle buildEnvironment

> Task :buildEnvironment

------------------------------------------------------------
Root project
------------------------------------------------------------

classpath
\--- org.asciidoctor:asciidoctor-gradle-plugin:1.5.1

BUILD SUCCESSFUL
```

重要的是要了解Gradle插件不能在自己的独立的类加载器中运行。反过来，这些依赖可能与从其他插件解析的同一库的其他版本冲突，并可能导致意外的运行时行为。在编写Gradle插件时，请考虑您是否真的需要特定的库，或者是否可以自己实现一个简单的方法。Gradle的未来版本将为插件引入适当的类路径隔离。

## 3. 总结

设计插件的体系结构是创建面向未来的实现的重要且必要的步骤。在编写一行代码之前，请务必记住本指南中列出的方法和建议。现在您已经具备了插件开发的良好实践，现在该将这些技术应用于编写插件了。

## 4. 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/designing-gradle-plugins](https://github.com/gradle-guides/designing-gradle-plugins/)中添加issue或合并请求，我们将尽快与您联系。

## 5. 后续步骤

现在，您已经熟悉了设计Gradle插件的基础知识，您可能会感兴趣：

- [实现Gradle插件](./02-implementing-gradle-plugins)

- [测试Gradle插件](./03-testing-gradle-plugins)
