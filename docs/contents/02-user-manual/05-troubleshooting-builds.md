---
title: 故障排除
date: 2019-08-24 16:43:00
---

# {{ $page.title }}

以下是常见问题的集合以及解决这些问题的建议。您可以获取其他提示，并搜索[Gradle forums](https://discuss.gradle.org/c/help-discuss)和[StackOverflow #gradle](https://stackoverflow.com/questions/tagged/gradle)答案以及来自[help.gradle.org](https://gradle.org/help/)的Gradle文档。

## 对Gradle安装进行故障排除

如果您按照[安装说明](/contents/02-user-manual/02-installing-gradle)进行操作，但无法执行Gradle构建，则以下一些提示可能会有所帮助。

如果在调用[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html#gradle_wrapper)之外安装了Gradle，则可以通过在终端中运行`gradle --version`来检查Gradle的安装。

您应该会看到以下内容：

``` sh {1}
❯ gradle --version

-----------------------------------------------------------
Gradle 4.6
------------------------------------------------------------

Build time:   2018-02-21 15:28:42 UTC
Revision:     819e0059da49f469d3e9b2896dc4e72537c4847d

Groovy:       2.4.12
Ant:          Apache Ant(TM) version 1.9.9 compiled on February 2 2017
JVM:          1.8.0_151 (Oracle Corporation 25.151-b12)
OS:           Mac OS X 10.13.3 x86_64
```

如果没有，您可能会看到一些其他的东西。

### Command not found: gradle

如果提示“command not found: gradle”，则需要确保Gradle已正确添加到`PATH`中。

### JAVA_HOME is set to an invalid directory

如果您得到以下信息：

```
ERROR: JAVA_HOME is set to an invalid directory

Please set the JAVA_HOME variable in your environment to match the location of your Java installation.
```

您需要确保[正确安装](https://www.java.com/en/download/help/index_installing.xml)了[Java Development Kit](https://jdk.java.net)版本8或更高版本，已设置`JAVA_HOME`环境变量，并将[Java添加到`PATH`](https://www.java.com/en/download/help/path.xml)中。

### Permission denied

如果提示“Permission denied”，则表示Gradle可能存在于正确的位置，但不可执行。您可以在 **\*nix-based** 的系统上使用`chmod +x path/to/executable`来解决此问题。

### 其他安装失败

如果`gradle --version`工作正常，但是所有构建都因相同的错误而失败，则其中一个Gradle构建配置脚本可能存在问题。

您可以通过运行执行配置脚本但不执行Gradle任务的`gradle help`来验证问题是否出在Gradle脚本上。如果错误仍然存​​在，则构建配置存在问题。如果不是，则问题在于执行一个或多个请求的任务（Gradle首先执行配置脚本，然后执行构建步骤）。

## 调试依赖项解析

[解决依赖性冲突问题](https://docs.gradle.org/current/userguide/troubleshooting_dependency_resolution.html#troubleshooting_dependency_resolution)中涵盖了常见的依赖性问题，例如解决版本冲突。

通过单击 _Dependencies view_ 并使用搜索功能，并指定解析原因，您可以看到依赖关系树，并查看哪些已解析的依赖关系版本与请求的版本有所不同。

![Figure 1. Debugging dependency conflicts with build scans](https://docs.gradle.org/current/userguide/img/troubleshooting-dependency-management-build-scan.png)

可以使用带有筛选条件的[实际构建扫描](https://scans.gradle.com/s/sample/troubleshooting-userguide/dependencies?expandAll&filters=WzFd&toggled=W1swXSxbMF0sWzAsMF0sWzAsMV1d&_ga=2.36167712.1480847771.1569235223-1279986108.1569235223)进行探索。

## 对缓慢的Gradle构建进行故障排除

有关构建性能问题（包括“同步速度慢”），请参阅[Improving the Performance of Gradle Builds(《提高Gradle构建的性能指南》)](https://guides.gradle.org/performance/)。

Android开发人员应观看Android SDK工具团队的[Speeding Up Your Android Gradle Builds(有关加速Android Gradle构建)](https://youtu.be/7ll-rkLCtyk)的演示。 Android Studio用户指南还介绍了许多有关[优化构建速度](https://developer.android.com/studio/build/optimize-your-build.html)的技巧。

## 调试构建逻辑

### 将调试器附加到构建

您可以通过将`org.gradle.debug`属性设置为`true`，然后将远程调试器附加到端口`5005`，来设置断点并在Gradle构建自身中调试[buildSrc 和 standalone plugins](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:packaging_a_plugin)。

``` sh
❯ gradle help -Dorg.gradle.debug=true
```

此外，如果您采用了Kotlin DSL，则还可以自己调试构建脚本。

以下视频演示了如何使用IntelliJ IDEA调试示例构建。

![Figure 2. Interactive debugging of a build script](https://docs.gradle.org/current/userguide/img/remote-debug-gradle.gif)

### 添加和更改日志记录

### 应该在UP-TO-DATE执行的任务
