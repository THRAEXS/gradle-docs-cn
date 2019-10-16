---
title: 构建Java应用
date: 2019-10-12 10:36:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/building-java-applications/)

[[toc]]

本指南演示了如何使用Gradle的Build Init插件创建遵循Gradle约定的新Java应用程序。

## 您需要什么

- 约9分钟

- 文本编辑器

- 命令提示符

- [Java开发套件](https://www.oracle.com/technetwork/java/javase/downloads/index.html)(JDK)版本8或更高版本

- [Gradle发行版](https://gradle.org/install/)5.4.1或更高版本

## 查看用户手册

Gradle带有一个称为Build Init插件的内置插件。它在Gradle用户手册中有记录。该插件提供了一个名为`init`的任务，该任务可以生成项目。该插件还使用（也是内置的）`wrapper`任务来创建Gradle Wrapper脚本`gradlew`。

## 设置

第一步是为新项目创建一个文件夹，并将目录更改为该文件夹。

``` sh
$ mkdir demo
$ cd demo
```

## 运行初始化任务

从新项目目录内部，运行`init`任务，并在出现提示时选择`java-application`项目类型。对于其他问题，请按Enter键以使用默认值。

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
Enter selection (default: basic) [1..10] 6

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
    ├── build.gradle
    ├── gradle // 1
    │   └── wrapper
    │       ├── gradle-wrapper.jar
    │       └── gradle-wrapper.properties
    ├── gradlew
    ├── gradlew.bat
    ├── settings.gradle
    └── src
        ├── main
        │   ├── java  // 2
        │   │   └── demo
        │   │       └── App.java
        │   └── resources
        └── test      
            ├── java // 3
            │   └── demo
            │       └── AppTest.java
            └── resources
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
    ├── build.gradle.kts
    ├── gradle // 1
    │   └── wrapper
    │       ├── gradle-wrapper.jar
    │       └── gradle-wrapper.properties
    ├── gradlew
    ├── gradlew.bat
    ├── settings.gradle.kts
    └── src
        ├── main
        │   ├── java  // 2
        │   │   └── demo
        │   │       └── App.java
        │   └── resources
        └── test      
            ├── java // 3
            │   └── demo
            │       └── AppTest.java
            └── resources
  ```

  </template>
</CodeSwitcher>

1. 包装器文件的生成文件夹
2. 默认Java源文件夹
3. 默认的Java测试文件夹

## 查看生成的项目文件

`settings.gradle`文件带有大量注释，但是只有一个活动行：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // settings.gradle

  rootProject.name = 'demo'
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // settings.gradle.kts

  rootProject.name = "demo"
  ```

  </template>
</CodeSwitcher>

这样会将根项目的名称设置为“demo”，这将覆盖默认名称（在其所在目录之后）。

生成的`build.gradle`文件也有很多注释。活动部分在此处复制（请注意依赖项的版本号可能会在Gradle的更高版本中更新）：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

``` groovy
// build.gradle

plugins {
    id 'java'
    id 'application'
}

repositories {
    jcenter() // 1
}

dependencies {
    implementation 'com.google.guava:guava:26.0-jre' // 2

    testImplementation 'junit:junit:4.12' // 3
}

mainClassName = 'demo.App' // 4
```

  </template>
  <template v-slot:kotlin>

``` kotlin
// build.gradle.kts

plugins {
    java
    application
}

repositories {
    jcenter() // 11
}

dependencies {
    implementation("com.google.guava:guava:26.0-jre") // 2

    testImplementation("junit:junit:4.12") // 3
}

application {
    mainClassName = "demo.App" // 4
}
```

  </template>
</CodeSwitcher>

1. 公共依赖仓库
2. Google Guava库
3. JUnit测试库
4. 具有`mian`方法的类（由应用程序插件使用）

构建文件添加了`java`和`application`插件。前者支持Java项目。后者使您可以将一个类指定为具有`main`方法，该方法可以由命令行中的内部版本执行。在演示中，`main`类的名称为App。

此处显示文件`src/main/java/demo/App.java`：

__src/main/java/App.java__
``` java
package demo;

public class App {
    public String getGreeting() {
        return "Hello world.";
    }

    public static void main(String[] args) {  // 1
        System.out.println(new App().getGreeting());
    }
}
```

1. 由应用程序插件调用"run"任务

接下来显示测试类`src/test/java/demo/AppTest.java`：

__src/test/java/AppTest.java__
``` java
package demo;

import org.junit.Test;
import static org.junit.Assert.*;

public class AppTest {
    @Test public void testAppHasAGreeting() {
        App classUnderTest = new App();
        assertNotNull("app should have a greeting", classUnderTest.getGreeting());
    }
}
```

生成的测试类具有单个测试，该测试带有JUnit的`@Test`注解。该测试实例化`App`类，调用`getGreeting`方法，并检查返回的值是否不为`null`。

## 执行构建

要构建项目，请运行`build`任务。您可以使用常规的`gradle`命令，但是当项目包含包装器脚本时，可以使用它代替它。

``` sh {1}
$ ./gradlew build
> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes
> Task :jar
> Task :startScripts
> Task :distTar
> Task :distZip
> Task :assemble
> Task :compileTestJava
> Task :processTestResources NO-SOURCE
> Task :testClasses
> Task :test
> Task :check
> Task :build

BUILD SUCCESSFUL
8 actionable tasks: 8 executed
```

::: tip
第一次运行包装程序脚本`gradlew`时，下载`gradle`版本并将其本地存储在`~/.gradle/wrapper/dists`文件夹中可能会有延迟。
:::

第一次运行构建时，Gradle将检查`~/.gradle`目录下的缓存中是否已经具有Guava和JUnit库。如果没有，这些库将被下载并存储在那里。下次运行构建时，将使用缓存的版本。构建任务将编译类，运行测试并生成测试报告。

您可以通过打开位于`build/reports/tests/test/index.html`的HTML输出文件来查看测试报告。

示例报告如下所示：

![sample report](https://guides.gradle.org/building-java-applications/images/Test-Summary.png)

## 运行应用程序

因为Gradle构建使用了Application插件，所以您可以从命令行运行该应用程序。首先，使用`tasks`任务查看插件已添加的任务。

``` sh {1}
$ ./gradlew tasks
:tasks

------------------------------------------------------------
All tasks runnable from root project
------------------------------------------------------------

Application tasks
-----------------
run - Runs this project as a JVM application

// ... many other tasks ...
```

`run`任务告诉Gradle在分配给`mainClassName`属性的类中执行`main`方法。

``` sh {1}
$ ./gradlew run
> Task :compileJava UP-TO-DATE
> Task :processResources NO-SOURCE
> Task :classes UP-TO-DATE

> Task :run
Hello world.

BUILD SUCCESSFUL in 0s
2 actionable tasks: 1 executed, 1 up-to-date


BUILD SUCCESSFUL
```

## 总结

现在，您有了一个使用Gradle的build init插件生成的新Java项目。在此过程中，您看到了：

- 如何生成Java应用程序

- 生成的构建文件和示例Java文件的结构

- 如何运行构建并查看测试报告

- 如何使用Application插件中的`run`任务执行Java应用程序

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/building-java-applications](https://github.com/gradle-guides/building-java-applications/)中添加问题或请求请求，我们将尽快与您联系。
