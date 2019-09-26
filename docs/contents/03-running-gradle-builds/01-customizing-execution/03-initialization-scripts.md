---
title: 初始化脚本
date: 2019-09-25 15:12:00
---

# {{ $page.title }}

> [原文链接](https://docs.gradle.org/current/userguide/init_scripts.html)

[[toc]]

Gradle提供了一个强大的机制，允许基于当前环境定制构建。该机制还支持希望与Gradle集成的工具。

请注意，这与“`build-init`”插件提供的“`init`”任务完全不同（请参阅[Build Init插件](https://docs.gradle.org/current/userguide/build_init_plugin.html#build_init_plugin)）。

## 基本用法

初始化脚本（**Initialization scripts**, a.k.a. **init scripts**）与Gradle中的其他脚本相似。但是，这些脚本是在构建开始之前运行的。以下是几种可能的用途：

- 设置企业范围的配置，例如在哪里可以找到自定义插件。

- 根据当前环境设置属性，例如开发人员的计算机与持续集成服务器。

- 提供构建所需的有关用户的个人信息，例如存储库或数据库身份验证凭据。

- 定义机器特定的详细信息，例如JDK的安装位置。

- 注册构建侦听器。希望监听Gradle事件的外部工具可能会发现这很有用。

- 注册构建记录器。您可能希望自定义Gradle如何记录它生成的事件。

初始化脚本的一个主要限制是它们不能访问`buildSrc`项目中的类（有关此功能的详细信息，请参见[使用buildSrc提取命令式逻辑](https://docs.gradle.org/current/userguide/organizing_gradle_projects.html#sec:build_sources)）。

## 使用初始化脚本

有几种使用初始化脚本的方法：

- 在命令行上指定一个文件。命令行选项是`-I`或`--init-script`，后跟脚本路径。命令行选项可以多次出现，每次添加另一个初始化脚本。如果命令行上指定的任何文件不存在，则构建将失败。

- 将一个名为`init.gradle`的文件（或Kotlin的`init.gradle.kts`）放在`USER_HOME/.gradle/`目录中。

- 将以`.gradle`（或Kotlin的`.init.gradle.kts`）结尾的文件放在`USER_HOME/.gradle/init.d/`目录中。

- 将以`.gradle`（或Kotlin的`.init.gradle.kts`）结尾的文件放在Gradle发行版的`GRADLE_HOME/init.d/`目录中。这使您可以打包包含一些自定义构建逻辑和插件的自定义Gradle发行版。您可以将其与[Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html#gradle_wrapper)结合使用，以使自定义逻辑可用于企业中的所有内部版本。

如果发现一个以上的初始化脚本，它们将全部按照上述指定的顺序执行。给定目录中的脚本 **按字母顺序执行**。例如，这允许使用一种工具在命令行上指定一个初始化脚本，并且用户可以将一个脚本放入其主目录中以定义环境，并且在执行Gradle时，这两个脚本都将运行。

## 编写一个初始化脚本

类似于Gradle构建脚本，初始化脚本是Groovy或Kotlin脚本。每个初始化脚本都有一个与之关联的[Gradle](https://docs.gradle.org/current/dsl/org.gradle.api.invocation.Gradle.html)实例。初始化脚本中的任何属性引用和方法调用都将委托给此`Gradle`实例。

每个初始化脚本还实现[脚本](https://docs.gradle.org/current/dsl/org.gradle.api.Script.html)接口。

### 通过初始化脚本配置项目

您可以使用初始化脚本来配置构建中的项目。这与在多项目构建中配置项目的方式类似。以下示例显示了在评估项目之前如何通过初始化脚本执行额外的配置。此样本使用此功能来配置额外的存储库，以仅用于某些环境。

示例1.在评估项目之前，使用初始化脚本执行额外的配置

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // build.gradle

  repositories {
      mavenCentral()
  }

  task showRepos {
      doLast {
          println "All repos:"
          println repositories.collect { it.name }
      }
  }

  // init.gradle

  allprojects {
      repositories {
          mavenLocal()
      }
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // build.gradle.kts

  repositories {
      mavenCentral()
  }

  tasks.register("showRepos") {
      doLast {
          println("All repos:")
          //TODO:kotlin-dsl remove filter once we're no longer on a kotlin eap
          println(repositories.map { it.name }.filter { it != "maven" })
      }
  }

  // init.gradle.kts

  allprojects {
      repositories {
          mavenLocal()
      }
  }
  ```

  </template>
</CodeSwitcher>

### 应用初始化脚本时的输出

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` sh {1}
  > gradle --init-script init.gradle -q showRepos
  All repos:
  [MavenLocal, MavenRepo]
  ```

  </template>
  <template v-slot:kotlin>

  ``` sh {1}
  > gradle --init-script init.gradle.kts -q showRepos
  All repos:
  [MavenLocal, MavenRepo]
  ```

  </template>
</CodeSwitcher>

## 初始化脚本的外部依赖关系

在构建脚本的外部依赖关系中，说明了如何向构建脚本添加外部依赖关系。初始化脚本也可以声明依赖关系。您可以使用`initscript()`方法执行此操作，并传入一个声明初始化脚本类路径的闭包。

示例2.声明一个初始化脚本的外部依赖

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // init.gradle

  initscript {
      repositories {
          mavenCentral()
      }
      dependencies {
          classpath 'org.apache.commons:commons-math:2.0'
      }
  }
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // init.gradle.kts

  initscript {
      repositories {
          mavenCentral()
      }
      dependencies {
          classpath("org.apache.commons:commons-math:2.0")
      }
  }
  ```

  </template>
</CodeSwitcher>

传递给`initscript()`方法的闭包可配置[ScriptHandler](https://docs.gradle.org/current/javadoc/org/gradle/api/initialization/dsl/ScriptHandler.html)实例。您可以通过将依赖项添加到类路径配置中来声明初始化脚本类路径。这与您声明Java编译类路径的方式相同。可以使用[Declaring Dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html#declaring_dependencies)中描述的任何依赖项类型，项目依赖项除外。

声明了初始化脚本的类路径后，您可以像使用该类路径上的任何其他类一样，使用初始化脚本中的类。以下示例将添加到前面的示例中，并使用初始化脚本类路径中的类。

示例3.具有外部依赖关系的初始化脚本

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // init.gradle

  import org.apache.commons.math.fraction.Fraction

  initscript {
      repositories {
          mavenCentral()
      }
      dependencies {
          classpath 'org.apache.commons:commons-math:2.0'
      }
  }

  println Fraction.ONE_FIFTH.multiply(2)
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // init.gradle.kts

  import org.apache.commons.math.fraction.Fraction

  initscript {
      repositories {
          mavenCentral()
      }
      dependencies {
          classpath("org.apache.commons:commons-math:2.0")
      }
  }

  println(Fraction.ONE_FIFTH.multiply(2))
  ```

  </template>
</CodeSwitcher>

应用初始化脚本时的输出

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` sh {1}
  > gradle --init-script init.gradle -q doNothing
  2 / 5
  ```

  </template>
  <template v-slot:kotlin>

  ``` sh {1}
  > gradle --init-script init.gradle.kts -q doNothing
  2 / 5
  ```

  </template>
</CodeSwitcher>

## 初始化脚本插件

类似于Gradle构建脚本或Gradle设置文件，可以将插件应用于初始化脚本。

示例4.在初始化脚本中使用插件

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // init.gradle

  import org.apache.commons.math.fraction.Fraction

  initscript {
      repositories {
          mavenCentral()
      }
      dependencies {
          classpath 'org.apache.commons:commons-math:2.0'
      }
  }

  println Fraction.ONE_FIFTH.multiply(2)
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // init.gradle.kts

  import org.apache.commons.math.fraction.Fraction

  initscript {
      repositories {
          mavenCentral()
      }
      dependencies {
          classpath("org.apache.commons:commons-math:2.0")
      }
  }

  println(Fraction.ONE_FIFTH.multiply(2))
  ```

  </template>
</CodeSwitcher>

应用初始化脚本时的输出

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` groovy
  // init.gradle

  apply plugin: EnterpriseRepositoryPlugin

  class EnterpriseRepositoryPlugin implements Plugin<Gradle> {

      private static String ENTERPRISE_REPOSITORY_URL = "https://repo.gradle.org/gradle/repo"

      void apply(Gradle gradle) {
          // ONLY USE ENTERPRISE REPO FOR DEPENDENCIES
          gradle.allprojects { project ->
              project.repositories {

                  // Remove all repositories not pointing to the enterprise repository url
                  all { ArtifactRepository repo ->
                      if (!(repo instanceof MavenArtifactRepository) ||
                            repo.url.toString() != ENTERPRISE_REPOSITORY_URL) {
                          project.logger.lifecycle "Repository ${repo.url} removed. Only $ENTERPRISE_REPOSITORY_URL is allowed"
                          remove repo
                      }
                  }

                  // add the enterprise repository
                  maven {
                      name "STANDARD_ENTERPRISE_REPO"
                      url ENTERPRISE_REPOSITORY_URL
                  }
              }
          }
      }
  }

  // build.gradle

  /*
   * Copyright 2013 the original author or authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *      http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  // tag::show-repos-task[]
  repositories{
      mavenCentral()
  }

   task showRepositories {
       doLast {
           repositories.each {
               println "repository: ${it.name} ('${it.url}')"
           }
       }
  }
  // end::show-repos-task[]
  ```

  </template>
  <template v-slot:kotlin>

  ``` kotlin
  // init.gradle.kts

  apply<EnterpriseRepositoryPlugin>()

  class EnterpriseRepositoryPlugin : Plugin<Gradle> {
      companion object {
          const val ENTERPRISE_REPOSITORY_URL = "https://repo.gradle.org/gradle/repo"
      }

      override fun apply(gradle: Gradle) {
          // ONLY USE ENTERPRISE REPO FOR DEPENDENCIES
          gradle.allprojects {
              repositories {

                  // Remove all repositories not pointing to the enterprise repository url
                  all {
                      if (this !is MavenArtifactRepository || url.toString() != ENTERPRISE_REPOSITORY_URL) {
                          project.logger.lifecycle("Repository ${(this as? MavenArtifactRepository)?.url ?: name} removed. Only $ENTERPRISE_REPOSITORY_URL is allowed")
                          remove(this)
                      }
                  }

                  // add the enterprise repository
                  add(maven {
                      name = "STANDARD_ENTERPRISE_REPO"
                      url = uri(ENTERPRISE_REPOSITORY_URL)
                  })
              }
          }
      }
  }

  // build.gradle.kts

  // tag::show-repos-task[]
  repositories{
      mavenCentral()
  }

  tasks.register("showRepositories") {
      doLast {
          repositories.map { it as MavenArtifactRepository }.forEach {
              println("repository: ${it.name} ('${it.url}')")
          }
      }
  }
  // end::show-repos-task[]
  ```

  </template>
</CodeSwitcher>

应用初始化脚本时的输出

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
  <template v-slot:groovy>

  ``` sh {1}
  > gradle --init-script init.gradle -q showRepositories
  repository: STANDARD_ENTERPRISE_REPO ('https://repo.gradle.org/gradle/repo')
  ```

  </template>
  <template v-slot:kotlin>

  ``` sh {1}
  > gradle --init-script init.gradle.kts -q showRepositories
  repository: STANDARD_ENTERPRISE_REPO ('https://repo.gradle.org/gradle/repo')
  ```

  </template>
</CodeSwitcher>

初始化脚本中的插件可确保在运行构建时仅使用指定的存储库。

在初始化脚本中应用插件时，Gradle实例化插件并调用插件实例的[Plugin.apply(T)](1)方法。`gradle`对象作为参数传递，可用于配置构建的各个方面。当然，可以将应用的插件解析为外部依赖项，如[初始化脚本的外部依赖项](#初始化脚本的外部依赖关系)中所述
