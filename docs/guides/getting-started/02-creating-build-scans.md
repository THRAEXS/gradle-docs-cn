---
title: 创建构建扫描
date: 2019-10-10 09:41:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/creating-build-scans/)

[[toc]]

构建扫描是构建的可共享且集中的记录，可提供有关发生情况和原因的见解。通过将构建扫描插件应用于您的项目，您可以免费将构建扫描发布到[https://scans.gradle.com](https://scans.gradle.com)。

## 您将创建什么

本指南说明如何在不修改任何构建脚本的情况下临时发布构建扫描。您还将学习如何修改构建脚本以对给定项目的所有构建启用构建扫描。（可选）您还将修改一个初始化脚本，以对所有项目启用构建扫描。

## 您需要什么

- 您可以使用自己的示例项目，也可以使用Gradle提供的示例项目

- 联网

- 访问您的电子邮件

- 约7分钟

## 选择一个样本项目

Gradle提供了一个简单的Java项目，可用于演示构建扫描功能。如果您想使用它，请克隆或下载位于[https://github.com/gradle/gradle-build-scan-quickstart](https://github.com/gradle/gradle-build-scan-quickstart)的存储库。如果您喜欢使用自己的项目，则可以跳过此步骤。

## 自动应用构建扫描插件

从Gradle 4.3开始，您无需在构建脚本中进行任何其他配置即可启用构建扫描。当使用命令行选项`--scan`发布构建扫描时，所需的构建扫描插件将自动应用。在构建结束之前，要求您在命令行上接受许可协议。以下控制台输出演示了该行为。

``` sh {1}
$ ./gradlew build --scan

BUILD SUCCESSFUL in 6s

Do you accept the Gradle Cloud Services license agreement (https://gradle.com/terms-of-service)? [yes, no]
yes
Gradle Cloud Services license agreement accepted.

Publishing build scan...
https://gradle.com/s/czajmbyg73t62
```

这种机制使生成临时的一次性构建扫描变得非常容易，而无需在构建中配置构建扫描插件。如果需要更精细的配置，则可以按照以下各节中的说明，在构建或初始化脚本中配置构建扫描插件。

## 在项目的所有构建中启用构建扫描

将`plugins`块添加到根项目构建脚本文件中，其内容如下：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

plugins {
    id 'com.gradle.build-scan' version '2.1'
}  
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

plugins {
    id("com.gradle.build-scan") version "2.1"
}
```

</template>
</CodeSwitcher>

可以在[Gradle插件门户](https://plugins.gradle.org/plugin/com.gradle.build-scan)上找到的最新插件版本。

如果您已经有一个`plugins`块，请始终将构建扫描插件放在第一位。将其添加到任何现有插件的下方仍然可以使用，但是会丢失有用的信息。

## 接受许可协议

为了将构建扫描发布到[https://scans.gradle.com](https://scans.gradle.com)，您需要接受许可协议。发布时可以通过命令行临时完成，也可以通过添加以下部分在Gradle构建文件中指定：

## 发布构建扫描

## 在线访问构建扫描

## 为所有构建启用构建扫描(可选)

## 总结

## 下一步

## 帮助完善本指南
