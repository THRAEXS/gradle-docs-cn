---
title: 使用Gradle运行Webpack
date: 2019-10-12 10:36:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/running-webpack-with-gradle/)

[[toc]]

如今，许多Web应用程序都是使用截然不同的服务器端和客户端技术构建的。为了运行这些应用程序，必须同时构建和打包服务器端和客户端源码。Webpack已经成为JavaScript开发人员打包客户端资源的首选工具。

权衡在任何工程决策中都是固有的，但是使用脱节的工具可能会减慢非常有能力的开发团队的速度。 Gradle提供了与几乎所有其他工具链（包括Webpack和其他JavaScript开发工具）集成的机制。深入的主题指南（即将推出）中介绍了有关使用Gradle管理Webpack的更多信息（包括热重载）。

本指南将引导您以最小的开销利用Gradle和[Webpack](https://webpack.js.org)的优势。

## 您会构建什么

您将创建一个Gradle任务，以利用Gradle的[最新检查](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)和[构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)的方式将网络资源与[Webpack](https://webpack.js.org)打包在一起。

## 您需要什么

- 约11分钟

- 文本编辑器或IDE

- Java开发套件(JDK)，版本1.7或更高版本

- Node.js，8.0或更高版本

- [Gradle版本](https://gradle.org/install/)4.0或更高版本

## 步骤1：创建示例项目并安装依赖项

通过运行以下命令并将源文件复制到列出的文件中，以设置普通的Web应用程序。

### 步骤1.1：创建示例项目

::: tip
该演示项目来自[Webpack入门指南](https://webpack.js.org/guides/getting-started/)。通过[https://webpack.js.org/guides/](https://webpack.js.org/guides/)了解更多Webpack的用法。
:::

``` sh
$ mkdir -p gradle-webpack-demo/app
$ cd gradle-webpack-demo
```

__app/index.js__
``` js
import _ from 'lodash';

function component () {
  var element = document.createElement('div');

  /* lodash is used here for bundling demonstration purposes */
  element.innerHTML = _.join(['Build', 'together;', 'not', 'alone'], ' ');

  return element;
}

document.body.appendChild(component());
```

__index.html__
``` html
<html>
  <head>
    <title>Gradle + Webpack Demo</title>
  </head>
  <body>
    <script src="build/js/bundle.js"></script>
  </body>
</html>
```

__Webpack生成的JS包将包括index.js和lodash__

### 步骤1.2：安装Webpack和lodash

``` sh
$ npm init -y
$ npm install --save lodash@~4
$ npm install --save-dev webpack@~2
```

成功完成后，您的项目结构应如下所示：

```
.
├── app
│   └── index.js
├── index.html
├── node_modules
│   └── lodash
│   └── webpack
├── package-lock.json
└── package.json
```

::: tip
package-lock.json仅适用于npm v5 +，建议升级。
:::

## 步骤2：使用执行任务

可以通过Gradle [Exec](https://docs.gradle.org/current/dsl/org.gradle.api.tasks.Exec.html)任务调用命令行工具。

::: tip
对于需要配置或可重用性的任何应用程序，强烈建议使用[自定义任务类](https://guides.gradle.org/writing-gradle-tasks/)。例如，允许开发（带有源映射的调试）和生产变体。
:::

### 步骤2.1：创建Gradle任务

__build.gradle__
``` groovy
task webpack(type: Exec) {
    commandLine "$projectDir/node_modules/.bin/webpack", "app/index.js", "$buildDir/js/bundle.js"
}
```

声明一个Exec任务以调用`webpack`

__执行`webpack`任务__

``` sh {1}
$ gradle webpack

> Task :webpack
Hash: cebd0a554d64bf1868af
Version: webpack 2.6.1
Time: 406ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  544 kB       0  [emitted]  [big]  main
   [0] ./~/lodash/lodash.js 540 kB {0} [built]
   [1] ./app/index.js 269 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]


BUILD SUCCESSFUL in 1s
1 actionable task: 1 executed
```

现在，您可以打开`index.html`并查看"Build together; not alone"。

## 步骤3：声明任务输入和输出

您现在可以通过Gradle执行Webpack。让我们继续通过Gradle的[最新检查](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)（又称增量构建）在需要时仅运行Webpack。

为了利用最新的检查，您必须声明任务的输入和输出。通过以下方式在Gradle构建中更改任务配置：

__build.gradle__
``` groovy
task webpack(type: Exec) {
    inputs.file("package-lock.json") // 1
    inputs.dir("app")
    // NOTE: Add inputs.file("webpack.config.js") for projects that have it
    outputs.dir("$buildDir/js") // 2     

    commandLine "$projectDir/node_modules/.bin/webpack", "app/index.js", "$buildDir/js/bundle.js"
}
```

1. 声明`package-lock.json`和`app/`下的所有内容作为输入
2. 声明`build/js`作为输出位置

执行`gradle webpack`验证您的配置。我们已经更改了声明的任务输入和输出，因此将运行webpack。

``` sh {1}
$ gradle webpack

BUILD SUCCESSFUL in 0s
1 actionable task: 1 up-to-date
```

Gradle会识别出何时JS源文件没有被更改。`webpack`包是`UP-TO-DATE`的，不需要生成。

## 步骤4：利用Gradle构建缓存

从Gradle 4.0开始，Gradle可以避免通过[Build Cache](https://docs.gradle.org/current/userguide/build_cache.html)在其他VCS分支或其他计算机上已经完成的工作。

假设其他人推送了随后由CI构建并在远程构建缓存中共享的JS更改。如果您具有相同的Webpack配置，并且没有更改JS，则可以避免通过Webpack重新打包JS，并直接从构建缓存中下载包，从而节省了构建的打包时间。

### 步骤4.1：使Webpack任务可缓存

__build.gradle__
``` groovy
task webpack(type: Exec) {
    inputs.file("package-lock.json").withPathSensitivity(PathSensitivity.RELATIVE) // 1
    inputs.dir("app").withPathSensitivity(PathSensitivity.RELATIVE)
    outputs.dir("$buildDir/js")
    outputs.cacheIf { true } // 2

    commandLine "$projectDir/node_modules/.bin/webpack", "app/index.js", "$buildDir/js/bundle.js"
}
```

1. 声明`package-lock.json`和应用程序是可重定位的。[了解为什么这对于缓存很重要](https://guides.gradle.org/using-build-cache/#relocatability)。

2. 如果启用了构建缓存，则告诉Gradle始终缓存此任务的输出。

强烈建议在编写可缓存任务时使用[自定义任务类](https://docs.gradle.org/current/userguide/custom_tasks.html)。“管理JavaScript”主题指南（即将推出）中提供了一个用于Webpack的示例。此外，您可能需要声明属性名称以进行更好的诊断。

从[Build Cache主题指南](https://guides.gradle.org/using-build-cache/)中了解有关使用Gradle Build Cache的最佳实践的更多信息。

### 步骤4.2：运行`webpack`填充Gradle Build Cache

``` sh {1}
$ gradle webpack --build-cache
Build cache is an incubating feature.
Using local directory build cache for the root build (location = ~/.gradle/caches/build-cache-1).

> Task :webpack
Hash: cebd0a554d64bf1868af
Version: webpack 2.6.1
Time: 411ms
····Asset    Size  Chunks                    Chunk Names
bundle.js  544 kB       0  [emitted]  [big]  main
···[0] ./~/lodash/lodash.js 540 kB {0} [built]
···[1] ./app/index.js 269 bytes {0} [built]
···[2] (webpack)/buildin/global.js 509 bytes {0} [built]
···[3] (webpack)/buildin/module.js 517 bytes {0} [built]


BUILD SUCCESSFUL in 2s
2 actionable tasks: 2 executed
```

启用Gradle构建缓存。也可以在`gradle.properties`中使用`org.gradle.cache=true`

### 步骤4.3：对JavaScript进行一些小的更改

注释掉一行或进行其他一些小改动。

__app/index.js__
``` diff
-  element.innerHTML = _.join(['Build', 'together;', 'not', 'alone'], ' ');
+  // element.innerHTML = _.join(['Build', 'together;', 'not', 'alone'], ' ');
```

### 步骤4.4：重新运行`webpack`打包更改

``` sh {1}
$ gradle webpack --build-cache
Build cache is an incubating feature.
Using local directory build cache for the root build (location = ~/.gradle/caches/build-cache-1).

> Task :webpack
Hash: f86580c7ddca3e9d092a
Version: webpack 2.6.1
Time: 413ms
    Asset    Size  Chunks                    Chunk Names
bundle.js  544 kB       0  [emitted]  [big]  main
   [0] ./~/lodash/lodash.js 540 kB {0} [built]
   [1] ./app/index.js 287 bytes {0} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]


BUILD SUCCESSFUL in 2s
1 actionable task: 1 executed
```

### 步骤4.5："reset"更改

取消撤消所做更改的注释。

__app/index.js__
``` diff
-  // element.innerHTML = _.join(['Build', 'together;', 'not', 'alone'], ' ');
+  element.innerHTML = _.join(['Build', 'together;', 'not', 'alone'], ' ');
```

### 步骤4.6：从构建缓存中解析JS包

``` sh {1}
$ gradle --build-cache webpack
Build cache is an incubating feature.
Using local directory build cache for the root build (location = ~/.gradle/caches/build-cache-1).

BUILD SUCCESSFUL in 1s
1 actionable task: 1 from cache
```

`webpack`没有执行。`build/js/bundle.js`是从构建缓存加载的。

即使您刚刚进行了更改，也无需重新打包。在切换git分支和其他常见开发工作流程时，这种相同的机制也很好用。

## 下一步

恭喜你！现在，您具有执行Webpack的Gradle任务，但仅在Web资源发生更改时才执行。随着项目的发展，使用Gradle的好处会增加。

您的需求可能会更复杂。从这里开始有2个下一步：

- 如果您担心在构建过程中引入远程缓存的复杂性，那么Gradle Enterprise可以[满足您的要求](https://gradle.com/build-cache?_ga=2.155640562.896254753.1571010126-1564571921.1570494734)！

- 使用Gradle[管理JavaScript主题指南](https://github.com/gradle/guides/issues/119)（即将发布）涵盖开发工作流程，与其他JS工具的集成，并提供示例Gradle任务。

打包愉快!

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/running-webpack-with-gradle](https://github.com/gradle-guides/running-webpack-with-gradle/)中添加issue或合并请求，我们将尽快与您联系。
