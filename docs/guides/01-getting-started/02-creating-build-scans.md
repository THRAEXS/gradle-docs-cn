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

使用称为`--scan`的命令行标志发布构建扫描。

使用`--scan`选项运行构建任务。构建完成后，将构建数据上传到scans.gradle.com之后，将为您提供一个链接，以查看构建扫描。

``` sh {1}
$ ./gradlew build --scan

BUILD SUCCESSFUL in 0s

Publishing build scan...
https://gradle.com/s/uniqueid
```

## 在线访问构建扫描

首次单击该链接时，将要求您激活创建的构建扫描。

您收到的用于激活构建扫描的电子邮件将类似于：

![build scan](https://guides.gradle.org/creating-build-scans/images/build_scan_email.png)

单击电子邮件中提供的链接，您将看到创建的构建扫描。

![build scan](https://guides.gradle.org/creating-build-scans/images/build_scan_page.png)

现在，您可以浏览构建扫描中包含的所有信息，包括执行任务所花费的时间，构建每个阶段所需的时间，任何测试的结果，所使用的插件和其他依赖项，所使用的任何命令行开关，和更多。

## 为所有构建启用构建扫描(可选)

您可以避免使用Gradle初始化脚本将插件和许可协议添加到每个版本中。在`~/.gradle/init.d`目录（其中代字号代表您的主目录）中创建一个文件，其内容如下：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

initscript {
    repositories {
        gradlePluginPortal()
    }

    dependencies {
        classpath 'com.gradle:build-scan-plugin:@scanPluginVersion@'
    }
}

rootProject {
    apply plugin: com.gradle.scan.plugin.BuildScanPlugin

    buildScan {
        termsOfServiceUrl = 'https://gradle.com/terms-of-service'
        termsOfServiceAgree = 'yes'
    }
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// buildScan.init.gradle.kts

initscript {
    repositories {
        gradlePluginPortal()
    }

    dependencies {
        classpath("com.gradle:build-scan-plugin:@scanPluginVersion@")
    }
}

rootProject {
    apply<com.gradle.scan.plugin.BuildScanPlugin>()

    configure<com.gradle.scan.plugin.BuildScanExtension> {
        termsOfServiceUrl = "https://gradle.com/terms-of-service"
        termsOfServiceAgree = "yes"
    }
}
```

</template>
</CodeSwitcher>

必要时，初始化脚本将下载构建扫描插件，并将其应用于每个项目，并接受许可协议。现在，您可以在系统上的任何内部版本上使用`--scan`标志。

您可以向脚本添加其他功能，例如在什么条件下发布扫描信息。有关详细信息，请参见[《Build Scans用户手册》](https://docs.gradle.com/build-scan-plugin/?_ga=2.34500454.672448668.1570584104-1564571921.1570494734)。

## 总结

在本指南中，您学习了如何：

- 生成构建扫描

- 在线查看构建扫描信息

- 创建一个初始化脚本以启用对所有构建的构建扫描

## 下一步

其他信息可以在[《Build Scans用户手册》](https://docs.gradle.com/build-scan-plugin/?_ga=2.34500454.672448668.1570584104-1564571921.1570494734)中找到。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请向[gradle-guides/creating-build-scans](https://github.com/gradle-guides/creating-build-scans/)添加issue或合并请求，我们将尽快与您联系。
