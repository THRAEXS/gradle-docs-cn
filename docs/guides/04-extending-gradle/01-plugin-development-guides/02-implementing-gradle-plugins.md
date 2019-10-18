---
title: 实现Gradle插件
date: 2019-10-17 16:22:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/implementing-gradle-plugins/)

[[toc]]

编写插件代码是高级构建者的日常活动。该活动通常包括编写插件实现，创建用于执行所需功能的自定义任务类型，以及通过暴露声明性和表达性DSL来使最终用户可配置运行时行为。在本指南中，您将学习既定实践，以使您成为更好的插件开发人员，以及如何使插件对用户尽可能地易于使用和有用。在阅读本指南之前，请考虑阅读有关[设计Gradle插件](./01-designing-gradle-plugins)的指南。

本指南假定您具有：

- 对软件工程实践的基本了解

- 了解Gradle基础知识，例如项目组织，任务创建和配置以及Gradle构建生命周期

- 编写Java代码的工作知识

如果您是Gradle的初学者，请先阅读[Gradle开发入门指南](1)，同时参阅[Gradle用户手册](1)进行更深入的了解。

## 1. 您需要什么

- 约38分钟

- 文本编辑器或IDE

- Java开发套件(JDK)，版本1.8或更高版本

- [Gradle版本](https://gradle.org/install)5.0或更高版本

## 2. 实践

### 2.1. 使用Plugin Development插件编写插件

设置Gradle插件项目应该需要尽可能少的样板代码。[Java Gradle插件开发插件](https://docs.gradle.org/5.0/userguide/java_gradle_plugin.html)在此方面提供了帮助。首先，将以下代码添加到`build.gradle`文件中：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

plugins {
    id 'java-gradle-plugin'
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

plugins {
    id("java-gradle-plugin")
}
```

</template>
</CodeSwitcher>

通过应用插件，可以应用必要的插件并添加相关的依赖。它还有助于在将二进制构件发布到Gradle插件门户之前验证插件元数据。每个插件项目都应应用此插件。

### 2.2. 首选编写和使用自定义任务类型

可以将Gradle任务定义为[ad-hoc任务](https://guides.gradle.org/writing-gradle-tasks/)，具有一个或多个操作的`DefaultTask`类型的简单任务定义，或定义为[增强型任务](https://docs.gradle.org/5.0/userguide/more_about_tasks.html)，即使用自定义任务类型并借助属性公开其可配置性的任务。一般而言，自定义任务提供了可重用性，可维护性，可配置性和可测试性的手段。将任务作为插件的一部分提供时，同样的原则也适用。相较于ad-hoc任务始终首选自定义任务类型。如果您的插件使用者希望向构建脚本中添加更多任务，他们也将有机会重用现有任务类型。

假设您实现了一个插件，该插件通过提供自定义任务类型进行HTTP调用来解析二进制存储库中最新版本的依赖关系。定制任务由一个插件提供，该插件负责通过HTTP进行通信并以机器可读格式（例如XML或JSON）处理响应。

__LatestArtifactVersion.java__
``` java
package com.company.gradle.binaryrepo;

import org.gradle.api.DefaultTask;
import org.gradle.api.tasks.Input;
import org.gradle.api.tasks.TaskAction;

public class LatestArtifactVersion extends DefaultTask {
    private String coordinates;
    private String serverUrl;

    @Input
    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    @Input
    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    @TaskAction
    public void resolveLatestVersion() {
        System.out.println("Retrieving artifact " + coordinates + " from " + serverUrl);
        // issue HTTP call and parse response
    }
}
```

现在，任务的最终用户可以轻松创建具有不同配置的该类型的多个任务。自定义任务实现中完全隐藏了所有必要的，潜在的复杂逻辑。

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

import com.company.gradle.binaryrepo.LatestArtifactVersion

tasks.register("latestVersionMavenCentral", LatestArtifactVersion) {
    coordinates = 'commons-lang:commons-lang:1.5'
    serverUrl = 'http://repo1.maven.org/maven2/'
}

tasks.register("latestVersionInhouseRepo", LatestArtifactVersion) {
    coordinates = 'commons-lang:commons-lang:2.6'
    serverUrl = 'http://my.company.com/maven2'
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

import com.company.gradle.binaryrepo.LatestArtifactVersion

tasks.register<LatestArtifactVersion>("latestVersionMavenCentral") {
    coordinates = "commons-lang:commons-lang:1.5"
    serverUrl = "http://repo1.maven.org/maven2/"
}

tasks.register<LatestArtifactVersion>("latestVersionInhouseRepo") {
    coordinates = "commons-lang:commons-lang:2.6"
    serverUrl = "http://my.company.com/maven2"
}
```

</template>
</CodeSwitcher>

### 2.3. 从增量任务中受益

### 2.4. DSL-like API建模

#### 2.4.1. 扩展与约定

### 2.5. 捕获用户输入以配置插件运行时行为

### 2.6. 声明DSL配置容器

### 2.7. 对插件做出反应

### 2.8. 提供插件的默认依赖项

### 2.9. 分配适当的插件标识符

## 3. 总结

## 4. 帮助完善本指南

## 5. 下一步
