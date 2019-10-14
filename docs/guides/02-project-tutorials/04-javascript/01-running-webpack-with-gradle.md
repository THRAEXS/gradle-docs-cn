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
    inputs.file("package-lock.json")
    inputs.dir("app")
    // NOTE: Add inputs.file("webpack.config.js") for projects that have it
    outputs.dir("$buildDir/js")      

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

## 下一步

## 帮助完善本指南
