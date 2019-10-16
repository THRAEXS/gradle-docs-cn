---
title: 构建Java库
date: 2019-10-12 10:36:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/building-java-libraries/)

[[toc]]

本指南将引导您完成使用Gradle的Build Init插件生成新的Java库的过程，该Java库可在其他JVM库和应用程序中使用。

## 您会构建什么

您将生成一个遵循Gradle约定的Java库。

## 您需要什么

- 约12分钟

- 文本编辑器或IDE

- [Java开发套件](https://www.oracle.com/technetwork/java/javase/downloads/index.html)(JDK)版本8或更高版本

- [Gradle版本](https://gradle.org/install/)5.0或更高版本

## 创建一个库项目

Gradle带有一个称为Build Init插件的内置插件。它在Gradle[用户手册](https://docs.gradle.org/current/userguide/build_init_plugin.html)中有记录。该插件提供了一个名为`init`的任务，该任务可以生成项目。`init`任务使用（也是内置的）`wrapper`任务来创建Gradle包装器脚本`gradlew`。

第一步是为新项目创建一个文件夹，并将目录更改为该文件夹。

``` sh
$ mkdir demo
$ cd demo
```

## 运行初始化任务

在新项目目录内部，运行`init`任务，并在出现提示时选择`java-library`项目类型。对于其他问题，请按Enter键以使用默认值。

``` sh {1}
$ gradle init

Select type of project to generate:
  1: basic
  2: cpp-application
  3: cpp-library
  4: groovy-application
  5: groovy-library
  6: java-application
  7: java-library
  8: kotlin-application
  9: kotlin-library
  10: scala-library
Enter selection (default: basic) [1..10] 7

Select build script DSL:
  1: groovy
  2: kotlin
Enter selection (default: groovy) [1..2]

Select test framework:
  1: junit
  2: testng
  3: spock
Enter selection (default: junit) [1..3]

Project name (default: demo):

Source package (default: demo):


BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
```

如果您更喜欢Kotlin DSL，则可以选择`kotlin`作为构建脚本DSL。

`init`任务首先运行`wrapper`任务，该任务将生成`gradlew`和`gradlew.bat`包装器脚本。然后，它使用以下结构创建新项目：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
    // Groovy DSL

    .
    ├── build.gradle
    ├── gradle
    │   └── wrapper // 1
    │       ├── gradle-wrapper.jar
    │       └── gradle-wrapper.properties
    ├── gradlew
    ├── gradlew.bat
    ├── settings.gradle
    └── src
      ├── main
      │   └── java // 2
      │       └── demo
      │           └── Library.java
      └── test
          └── java // 3
              └── demo
                  └── LibraryTest.java
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
    // Kotlin DSL

    .
    ├── build.gradle.kts
    ├── gradle
    │   └── wrapper // 1
    │       ├── gradle-wrapper.jar
    │       └── gradle-wrapper.properties
    ├── gradlew
    ├── gradlew.bat
    ├── settings.gradle.kts
    └── src
      ├── main
      │   └── java // 2
      │       └── demo
      │           └── Library.java
      └── test
          └── java // 3
              └── demo
                  └── LibraryTest.java
  ```

  </template>
</CodeSwitcher>

1. 包装器文件的生成文件夹
2. 默认Java源文件夹
3. 默认的Java测试文件夹

现在，您已经具有用于简单Java库项目的必要组件。

## 查看生成的项目文件

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// Generated settings.gradle

rootProject.name = 'building-java-libraries' // 1
```

</template>
<template v-slot:kotlin>

``` kotlin
// Generated settings.gradle.kts

rootProject.name = "building-java-libraries" // 1
```

</template>
</CodeSwitcher>

1. 这将分配根项目的名称。

生成的`build.gradle`文件也有很多注释。活动部分在此处复制（请注意依赖项的版本号可能会在Gradle的更高版本中更新）：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// Generated build.gradle

plugins {
    id 'java-library'
}

repositories {
    jcenter() // 1
}

dependencies {
    api 'org.apache.commons:commons-math3:3.6.1' // 2

    implementation 'com.google.guava:guava:27.0.1-jre' // 3

    testImplementation 'junit:junit:4.12' // 4
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// Generated build.gradle.kts

plugins {
    `java-library`
}

repositories {
    jcenter() // 1
}

dependencies {
    api("org.apache.commons:commons-math3:3.6.1") // 2

    implementation("com.google.guava:guava:27.0.1-jre") // 3

    testImplementation("junit:junit:4.12") // 4
}
```

</template>
</CodeSwitcher>

1. 公共依赖仓库
2. 这是一个依赖关系的示例，该依赖关系已导出到使用者，也就是说可以在其编译类路径上找到。
3. 这是一个依赖关系的示例，该依赖关系在内部使用，并且不会在其自己的编译类路径中暴露给使用者。
4. JUnit测试库

构建脚本会添加[java-library](https://docs.gradle.org/5.0/userguide/java_library_plugin.html)插件。这是`java-base`的插件的扩展，并添加了用于编译Java源代码的其他任务。

此处显示文件`src/main/java/guidesamples/Library.java`：

__Generated src/main/java/demo/Library.java__
``` java
package demo;

public class Library {
    public boolean someLibraryMethod() {
        return true;
    }
}
```

接下来显示生成的JUnit规范`src/test/java/demo/LibraryTest.java`：

__Generated src/test/java/demo/LibraryTest.java__
``` java
package demo;

import org.junit.Test;
import static org.junit.Assert.*;

public class LibraryTest {
    @Test public void testSomeLibraryMethod() {
        Library classUnderTest = new Library();
        assertTrue("someLibraryMethod should return 'true'", classUnderTest.someLibraryMethod());
    }
}
```

生成的测试类具有单个[JUnit 4](https://junit.org/junit4/)测试。该测试实例化`Library`类，调用`someLibraryMethod`方法，并检查返回的值是否为`true`。

## 组装库JAR

要构建项目，请运行`build`任务。您可以使用常规的`gradle`命令，但是当项目包含包装器脚本时，可以使用它代替它。

``` sh {1}
$ ./gradlew build
> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes
> Task :jar
> Task :assemble
> Task :compileTestJava
> Task :processTestResources NO-SOURCE
> Task :testClasses
> Task :test
> Task :check
> Task :build

BUILD SUCCESSFUL in 11s
4 actionable tasks: 4 executed
```

::: tip
第一次运行包装程序脚本`gradlew`时，下载`gradle`版本并将其本地存储在`~/.gradle/wrapper/dists`文件夹中可能会有延迟。
:::

第一次运行构建时，Gradle将检查`~/.gradle`目录下的缓存中是否已经具有JUnit库和其他列出的依赖项。如果没有，这些库将被下载并存储在那里。下次运行构建时，将使用缓存的版本。`build`任务将编译类，运行测试并生成测试报告。

您可以通过打开位于`build/reports/tests/test/index.html`的HTML输出文件来查看测试报告。

示例报告如下所示：

![sample report](https://guides.gradle.org/building-java-libraries/images/Test-Summary.png)

您可以在`build/libs`目录中找到名称为`building-java-libraries.jar`的新打包的JAR文件。通过运行以下命令来验证归档文件是否有效：

``` sh {1}
$ jar tf build/libs/building-java-libraries.jar
META-INF/
META-INF/MANIFEST.MF
Library.class
```

您应该看到所需的清单文件— `MANIFEST.MF` —和已编译的`Library`类。

::: tip
由于Gradle的`java-library`插件假定您的项目源码按[常规项目布局排列](https://docs.gradle.org/5.0/userguide/java_plugin.html#sec:java_project_layout)，因此无需在构建脚本中进行任何其他配置即可完成所有这些操作。您可以根据[用户手册的要求](https://docs.gradle.org/5.0/userguide/java_plugin.html#sec:changing_java_project_layout)自定义项目布局。
:::

恭喜，您已经完成了创建Java库的第一步！现在，您可以根据自己的项目需求对其进行自定义。

## 定制库JAR

您通常会希望JAR文件的名称包含库 _版本_。可以通过在构建脚本中设置顶级版本属性来轻松实现，如下所示：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

version = '0.1.0'
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

version = "0.1.0"
```

</template>
</CodeSwitcher>

现在运行`jar`任务：

``` sh
$ ./gradlew jar
```

并注意生成的`build/libs/building-java-libraries-0.1.0.jar`中的JAR文件包含预期的版本。

另一个常见要求是自定义清单文件，通常是通过添加一个或多个属性来进行。通过[配置`jar`任务](https://docs.gradle.org/5.0/userguide/more_about_tasks.html#sec:configuring_tasks)，在清单文件中包含库名称和版本。在构建脚本的末尾添加以下内容：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

jar {
    manifest {
        attributes('Implementation-Title': project.name,
                   'Implementation-Version': project.version)
    }
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

tasks {
    jar {
        manifest {
            attributes(
                mapOf("Implementation-Title" to project.name,
                      "Implementation-Version" to project.version)
            )
        }
    }
}
```

</template>
</CodeSwitcher>

为了确认这些更改是否按预期工作，请再次运行`jar`任务，这一次还要从JAR解压缩清单文件：

``` sh
$ ./gradlew jar
$ jar xf build/libs/building-java-libraries-0.1.0.jar META-INF/MANIFEST.MF
```

现在查看`META-INF/MANIFEST.MF`文件的内容，您应该看到以下内容：

__META-INF/MANIFEST.MF__
``` properties
Manifest-Version: 1.0
Implementation-Title: building-java-libraries
Implementation-Version: 0.1.0
```

::: tip 了解有关配置JAR的更多信息
`manifest`只是可以在`jar`任务上配置的许多属性之一。有关完整列表，请参见[Gradle语言参考](https://docs.gradle.org/5.0/dsl/)的[Jar部分](https://docs.gradle.org/5.0/dsl/org.gradle.api.tasks.bundling.Jar.html)以及Gradle[用户手册](/contents/01-docs-home/)的[Jar](https://docs.gradle.org/5.0/userguide/java_plugin.html#sec:jar)和[创建归档](https://docs.gradle.org/5.0/userguide/working_with_files.html#sec:archives)部分。
:::

现在，您可以尝试编译一些使用刚刚构建的库的Java代码来完成此练习。

## 添加API文档

`java-library`插件通过`javadoc`任务内置了对Java API文档工具的支持。

由Build Init插件生成的代码已经在`Library.java`文件中添加了注释。修改注释以成为`javadoc`标记。

__src/main/java/Library.java__
``` java
/**
 * This java source file was generated by the Gradle 'init' task.
 */
package demo;

public class Library {
    public boolean someLibraryMethod() {
        return true;
    }
}
```

运行`javadoc`任务。

``` sh {1}
$ ./gradlew javadoc

> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes
> Task :javadoc

BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
```

您可以通过打开位于`build/docs/javadoc/index.html`的HTML文件来查看生成的`javadoc`文件。

## 总结

就是这样! 您现在已经成功构建了Java库项目，将其打包为JAR，并在单独的应用程序中使用了它。在此过程中，您已经学会了如何：

- 生成一个Java库

- 调整生成的`build.gradle`和示例Java文件结构

- 运行构建并查看测试报告

- 自定义JAR文件的名称及其清单的内容

- 生成API文档。

## 下一步

建立库只是跨项目边界重用代码的一个方面。从这里，您可能会感兴趣：

- [Consuming JVM libraries](https://docs.gradle.org/current/userguide/dependency_management_for_java_projects.html)

- [Publishing JVM libraries](https://docs.gradle.org/5.0/userguide/artifact_management.html)

- [Working with multi-project builds](https://docs.gradle.org/5.0/userguide/intro_multi_project_builds.html)

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/building-java-libraries](https://github.com/gradle-guides/building-java-libraries/)中添加问题或请求请求，我们将尽快与您联系。
