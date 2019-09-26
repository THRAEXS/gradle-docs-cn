---
title: Gradle Daemon
date: 2019-09-25 15:12:00
---

# {{ $page.title }}

> [原文链接](https://docs.gradle.org/current/userguide/gradle_daemon.html)

[[toc]]

::: danger Wikipedia
守护进程是一种计算机程序，它作为后台进程运行，而不是受交互式用户的直接控制。
:::

Gradle在Java虚拟机（JVM）上运行，并使用几个支持库，它们需要很短的初始化时间。结果，有时启动似乎有些慢。这个问题的解决方案是 **Gradle Daemon**：一个长期存在的后台进程，比起其他情况，它可以更快地执行构建。通过避免昂贵的引导过程以及利用缓存（将有关项目的数据保留在内存中），我们可以实现这一目标。使用Daemon运行Gradle构建与没有运行没有什么不同。只需配置您是否要使用它-其他所有事情都由Gradle透明地处理。

## 为什么Gradle Daemon对性能很重要

Daemon是一个长期存在的进程，因此我们不仅可以避免每次构建都需要启动JVM的成本，而且还可以在内存中缓存有关项目结构，文件，任务等信息。

推理很简单：通过重用以前构建的计算来提高构建速度。但是，这样做的好处是巨大的：我们通常会在以后的构建中将构建时间减少15-75％。我们建议您使用`--profile`对构建进行概要分析，以了解 **Gradle Daemon** 对您的影响。

**Gradle Daemon** 从Gradle 3.0开始默认启用，因此您无需做任何事情即可从中受益。

如果您在不重用任何进程的临时环境(例如容器)中运行CI构建，那么使用守护进程将会轻微地降低性能(由于缓存了额外的信息)，而且没有任何好处，并且可能会被禁用。

## Daemon运行状态

要获取正在运行的Gradle守护程序及其状态的列表，请使用--status命令。

输出样本：

``` sh
PID VERSION                 STATUS
 28411 3.0                     IDLE
 34247 3.0                     BUSY
```

当前，给定的Gradle版本只能连接到相同版本的Daemon。这意味着状态输出将仅显示正在调用的Gradle版本的Daemon，而不显示任何其他版本的Daemon。 Gradle的未来版本将解除此约束，并将显示所有Gradle版本的正在运行的Daemon。

## 禁用Daemon

**Gradle Daemon** 默认情况下处于启用状态，我们建议始终启用它。有几种方法可以禁用守护程序，但是最常见的一种方法是添加该行

``` properties
org.gradle.daemon=false
```

到文件`«USER_HOME»/.gradle/gradle.properties`，其中`«USER_HOME»`是您的主目录。通常是以下之一，具体取决于您的平台：

- `C:\Users\<username>` (Windows Vista & 7+)
- `/Users/<username>` (macOS)
- `/home/<username>` (Linux)

如果该文件不存在，只需使用文本编辑器创建它即可。您可以在下面的“[Daemon FAQ](#faq)”中找到其他禁用（启用）Daemon的方法的详细信息。该部分还包含有关Daemon如何工作的更多详细信息。

请注意，启用了Daemon后，无论特定构建使用的Gradle版本如何，所有构建都将利用速度提升。

::: tip Continuous integration(持续集成, CI)
从Gradle 3.0开始，我们默认启用Daemon并建议将其用于开发人员的计算机和Continuous Integration服务器。但是，如果您怀疑Daemon使CI构建不稳定，则可以将其禁用以对每个构建使用全新的运行时，因为运行时与任何先前的构建完全隔离。
:::

## 停止现有的Daemon

如前所述，Daemon是一个后台进程。不过，您不必担心计算机上会建立Gradle进程。与可用的系统内存总量相比，每个Daemon都会监视其内存使用情况，如果可用系统内存不足，则每个空闲进程都会在空闲时停止运行。如果您出于任何原因要明确停止运行Daemon进程，只需使用命令`gradle --stop`。

这将终止所有与用于执行命令的相同Gradle版本一起启动的Daemon进程。如果安装了 Java Development Kit (JDK)，则可以通过运行`jps`命令轻松地验证守护程序是否已停止。您会看到所有名为`GradleDaemon`的正在运行的Daemon。

## FAQ

### 如何禁用Gradle Daemon？

有两种建议的方法可以永久禁用Daemon：

- 通过环境变量：将`-Dorg.gradle.daemon=false`添加到`GRADLE_OPTS`环境变量

- 通过属性文件：将`org.gradle.daemon=false`添加到`«GRADLE_USER_HOME»/gradle.properties`文件中

::: tip
注意，`«GRADLE_USER_HOME»`默认为`«USER_HOME»/.gradle`，其中`«USER_HOME»`是当前用户的主目录。可以通过`-g`和`--gradle-user-home`命令行开关以及`GRADLE_USER_HOME`环境变量和`org.gradle.user.home`JVM系统属性来配置此位置。
:::

两种方法具有相同的效果。使用哪一个取决于个人喜好。大多数Gradle用户选择第二个选项，并将条目添加到用户`gradle.properties`文件中。

在Windows上，此命令将为当前用户禁用Daemon：

``` sh
(if not exist "%USERPROFILE%/.gradle" mkdir "%USERPROFILE%/.gradle") && (echo. >> "%USERPROFILE%/.gradle/gradle.properties" && echo org.gradle.daemon=false >> "%USERPROFILE%/.gradle/gradle.properties")
```

在类似UNIX的操作系统上，以下Bash shell命令将为当前用户禁用Daemon：

``` sh
mkdir -p ~/.gradle && echo "org.gradle.daemon=false" >> ~/.gradle/gradle.properties
```

一旦以这种方式为构建环境禁用了守护程序，除非使用`--daemon`选项明确请求，否则不会启动Gradle守护程序。

使用Gradle命令行界面时，`--daemon`和`--no-daemon`命令行选项启用和禁用对单个构建调用的守护程序使用。在考虑构建环境时，这些命令行选项具有最高优先级。通常，为环境（例如用户帐户）启用Daemon更为方便，以便所有构建都使用Daemon，而无需记住提供`--daemon`选项。

### 为什么我的机器上有多个Daemon进程？

Gradle为什么要创建一个新的Daemon，而不是使用已经运行的Daemon，有几个原因。基本规则是，如果没有可用的空闲或兼容Daemon，则Gradle将启动新的Daemon。 Gradle将杀死任何闲置3个小时或更长时间的Daemon，因此您不必担心手动清理它们。

- **idle**

  空闲的Daemon是当前未执行构建或未执行其他有用工作的进程。

- **compatible**

  兼容的Daemon是可以（或可以使其）满足所请求构建环境的要求的Daemon。用于执行构建的Java运行时是构建环境的一个示例方面。另一个示例是构建运行时所需的JVM系统属性集。

Daemon可能无法满足所请求的构建环境的某些方面。如果Daemon与Java 8运行时一起运行，但是请求的环境要求Java 10，则该Daemon不兼容，必须启动另一个Daemon。而且，一旦JVM启动，就无法更改Java运行时的某些属性。例如，无法更改正在运行的JVM的内存分配（例如`-Xmx1024m`），默认文本编码，默认语言环境等。

通常，“请求的构建环境”是从构建客户端（例如Gradle命令行客户端，IDE等）环境的各个方面隐式构建的，并且是通过命令行开关和设置显式构建的。有关如何指定和控制构建环境的详细信息，请参见[构建环境](/contents/03-running-gradle-builds/01-customizing-execution/01-build-environment)。

以下JVM系统属性实际上是不可变的。如果请求的构建环境需要这些属性中的任何一个，且其值与Daemon的JVM具有的此属性不同，则该Daemon不兼容。

- file.encoding

- user.language

- user.country

- user.variant

- java.io.tmpdir

- javax.net.ssl.keyStore

- javax.net.ssl.keyStorePassword

- javax.net.ssl.keyStoreType

- javax.net.ssl.trustStore

- javax.net.ssl.trustStorePassword

- javax.net.ssl.trustStoreType

- com.sun.management.jmxremote

所需的Gradle版本是所请求的构建环境的另一方面。Daemon进程与特定的Gradle运行时耦合。在使用不同Gradle版本的会话中处理多个Gradle项目是导致多个Daemon进程运行的常见原因。

### Daemon使用多少内存，可以分配更多空间吗？

如果请求的构建环境未指定最大堆大小，则Daemon将使用最多512MB的堆。它将使用JVM的默认最小堆大小。对于大多数构建来说，512MB绰绰有余。具有数百个子项目的较大内部版本，大量配置和源代码可能需要或具有更好的性能，并具有更多的内存。

要增加Daemon可以使用的内存量，请在请求的构建环境中指定适当的标志。有关详细信息，请参见[构建环境](/contents/03-running-gradle-builds/01-customizing-execution/01-build-environment)。

### 如何停止Daemon？

闲置3个小时或更短的时间后，Daemon进程将自动终止。如果您希望在此之前停止Daemon进程，则可以通过操作系统终止该进程或运行`gradle --stop`命令。`--stop`开关使Gradle请求 _所有正在运行_ 的，与用于运行命令的Gradle版本相同的Daemon进程自行终止。

### Daemon会有什么问题？

在日常开发过程中，为了使守护进程健壮、透明和不引人注目，已经进行了大量的工程工作。然而，Daemon进程有时会被破坏或耗尽。Gradle构建从多个源执行任意代码。虽然Gradle本身是为Daemon进程设计的，并通过Daemon进程进行了大量测试，但是用户构建脚本和第三方插件可能会通过内存泄漏或全局状态损坏等缺陷破坏Daemon进程的稳定。

通过运行无法正确释放资源的构建，还可能破坏Daemon程序的稳定性（通常是构建环境）。当使用Microsoft Windows时，这是一个特别棘手的问题，因为它对读取或写入后无法关闭文件的程序的宽容度较小。

Gradle主动监视堆使用情况，并尝试检测何时泄漏开始耗尽守护程序中的可用堆空间。当检测到问题时，**Gradle Daemon** 将完成当前正在运行的构建，并在下一个构建中主动重新启动该Daemon。默认情况下启用此监视，但是可以通过将`org.gradle.daemon.performance.enable-monitoring`系统属性设置为`false`来禁用此监视。

如果怀疑Daemon进程变得不稳定，则可以将其杀死。回想一下，可以为构建指定`--no-daemon`开关，以防止使用Daemon。这对于诊断Daemon是否为问题的罪魁祸首非常有用。

## Tools & IDEs

IDE和其他工具用于与Gradle集成的Gradle Tooling API始终使用 **Gradle Daemon** 来执行构建。如果要在IDE中执行Gradle构建，则使用的是 **Gradle Daemon**，而无需为您的环境启用它。

## Gradle Daemon如何使构建更快？

**Gradle Daemon** 是一个 _长期存在的构建进程_。在两次构建之间，它空闲地等待下一次构建。这具有明显的好处，即对于多个构建只需要一次将Gradle加载到内存中，而不是对于每个构建加载一次。这本身就是一项重大的性能优化，但并非止于此。

现代JVM性能的一个重要方面是运行时代码优化。例如，HotSpot（Oracle提供的JVM实现，用作OpenJDK的基础）在运行时对代码进行优化。优化是渐进的，不是瞬时的。也就是说，在执行过程中对代码进行了逐步优化，这意味着纯粹由于此优化过程而使得后续构建可以更快。使用HotSpot进行的实验表明，需要5到10次构建才能稳定优化。守护程序的第一个构建和第10个构建之间的可感知构建时间差异可能非常明显。

Daemon还允许跨构建更有效地进行内存缓存。例如，构建所需的类（例如插件，构建脚本）可以保存在构建之间的内存中。同样，Gradle可以维护构建数据的内存缓存，例如用于增量构建的任务输入和输出的哈希值。
