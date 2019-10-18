---
title: 使用Gradle构建Spring Boot 2应用
date: 2019-10-12 10:36:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/building-spring-boot-2-projects-with-gradle/)

[[toc]]

本指南显示了如何为Spring Boot 2.0构建新的Gradle项目。首先，我们展示一些Spring Boot及其Gradle插件的值得注意的功能。接下来，我们将设置Gradle项目，应用Spring Boot插件，使用Gradle BOM支持来定义依赖关系，并创建示例项目以显示与[Gradle Build Scans](https://gradle.com/build-scans?_ga=2.149882495.896254753.1571010126-1564571921.1570494734)的集成。

## 值得注意的Spring Boot 2功能

Spring Boot使用的是Spring Framework 5.x，支持Java 9，最低Java版本已提高到8。在此发行版中，Spring还包括对Kotlin 1.2.x的支持。

除此之外，它现在完全支持Reactive Spring，您可以使用它来构建响应式应用程序。Spring Boot提供的整个自动配置机制也已经通过MongoDB，Redis等其他一些新的响应版本得到了丰富。

Spring Boot Gradle插件进行了重大改进，具有以下改进：

-  为了构建可执行的`jar`和`war`，分别将`bootRepackage`任务替换为`bootJar`和`bootWar`。

- 插件本身不再自动应用Spring依赖项管理插件。相反，它会对Spring依赖项管理插件的应用做出反应，并使用`spring-boot-dependencies`BOM(材料清单)进行配置。我们将在这篇文章的后面详细介绍BOM的支持。)

## 您需要什么

- 约13分钟

- 文本编辑器或IDE

- Java开发套件(JDK)，版本1.8或更高版本

- [Gradle版本](https://gradle.org/install/)4.6或更高版本

## 初始化Gradle项目

首先，我们需要初始化Gradle项目。为此，我们使用Gradle的`init`任务来创建带有空构建文件的模板项目。生成的项目包括开箱即用的Gradle包装器，以便您可以轻松地与未在本地安装Gradle的用户共享该项目。它还添加了默认源目录，测试依赖项和JCenter作为默认依赖项存储库。请查看其[文档](https://docs.gradle.org/current/userguide/build_init_plugin.html)以了解有关`init`任务的更多信息。

首先，我们需要在主目录中创建示例项目文件夹，并初始化项目：

``` sh
$ mkdir ~/gradle-spring-boot-project
$ cd ~/gradle-spring-boot-project
$ gradle init  --type java-application
```

生成的项目具有以下结构：

```
gradle-spring-boot-project
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── settings.gradle
└── src
    ├── main
    │   └── java
    │       └── App.java
    └── test
        └── java
            └── AppTest.java
```

接下来，我们需要应用Spring Boot插件并定义依赖项。

## 应用Spring Boot插件并配置依赖项

Spring提供了一个独立的Spring Boot Gradle插件，该插件添加了一些任务和配置，以简化基于Spring Boot的项目的工作。首先，我们首先需要应用插件。为此，打开`build.gradle`文件并调整`plugin`块，使其看起来像以下片段：

__build.gradle__
``` groovy
plugins {
    id 'java'
    id 'com.gradle.build-scan' version '2.0.2'
    id 'org.springframework.boot' version '2.0.5.RELEASE'
    id 'io.spring.dependency-management' version '1.0.7.RELEASE'
}
```

我们还应用了Gradle的`java`和构建扫描插件，通过该插件我们可以创建构建扫描。我们将在本指南的后面部分介绍构建扫描。

接下来，我们需要添加编译和运行示例所需的依赖，因为我们没有使用Spring的依赖关系管理插件。为此，我们使用了Gradle的BOM支持并加载了Spring Boot BOM文件，以便能够使用正确的版本解决所有必需的依赖。

__build.gradle__
``` groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-dependencies:2.0.5.RELEASE'
    implementation 'org.springframework.boot:spring-boot-starter-web'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'

    components {
        withModule('org.springframework:spring-beans') {
            allVariants {
                withDependencyConstraints {
                    // Need to patch constraints because snakeyaml is an optional dependency
                    it.findAll { it.name == 'snakeyaml' }.each { it.version { strictly '1.19' } }
                }
            }
        }
    }
}
```

为了遵循Spring Boot BOM，`components`块需要严格使用版本`1.19`的`snakeyaml`依赖项，因为`spring-beans`依赖项有版本`1.20`作为传递依赖项。

如果使用5.0之前的Gradle版本，则需要通过在项目根目录的`settings.gradle`文件中添加以下行来启用此功能：

__settings.gradle__
``` groovy
enableFeaturePreview('IMPROVED_POM_SUPPORT')
```

如果您想浏览所使用的依赖项的版本，包括那些传递性依赖项，或者查看您在哪里有冲突，可以在[构建扫描](https://gradle.com/build-scans?_ga=2.226429267.896254753.1571010126-1564571921.1570494734)中找到此信息。

以下屏幕截图显示了构建扫描的“依赖项”部分的示例：

![build scan](https://guides.gradle.org/building-spring-boot-2-projects-with-gradle/images/dependencies.png)

您也可以[在此处](https://gradle.com/s/ofnoymriygxtw?_ga=2.150988287.896254753.1571010126-1564571921.1570494734)浏览上述构建扫描。

要启用此功能，您需要将以下块添加到`build.gradle`文件中。这将始终在每次构建后发布构建扫描，并始终接受[许可协议](https://gradle.com/legal/terms-of-service?_ga=2.155061617.896254753.1571010126-1564571921.1570494734)。

__build.gradle__
``` groovy
buildScan {

    // always accept the terms of service
    termsOfServiceUrl = 'https://gradle.com/terms-of-service'
    termsOfServiceAgree = 'yes'

    // always publish a build scan
    publishAlways()
}
```

## 创建一个"Hello Gradle"示例应用程序

对于示例应用，我们创建一个简单的“Hello Gradle”应用。首先，我们需要将`App`和`AppTest`类移至`hello`包中，以方便进行Spring的组件扫描。为此，创建`src/main/java/hello`和`src/test/java/hello`目录，将相应的类移至文件夹。

接下来，修改位于`src/main/java/hello`文件夹中的`App`类，并将其内容替换为以下内容：

__App.java__
``` java
package hello;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

}
```

__HelloGradleController.java__
``` java
package hello;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/")
public class HelloGradleController {

    @GetMapping
    public String helloGradle() {
        return "Hello Gradle!";
    }

}
```

在上面的代码片段中，我们创建了一个新的Spring Boot应用和一个`HelloGradleController`，它返回`Hello Gradle!`在应用的根路径上处理`GET`请求时。

要测试此功能，我们需要创建一个集成测试。为此，请改修改于`src/test/java/hello`文件夹中的`AppTest`类，并将其内容替换为以下内容：

__AppTest.java__
``` java
package hello;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = App.class)
@AutoConfigureMockMvc
public class AppTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void helloGradle() throws Exception {
        mvc.perform(get("/"))
            .andExpect(status().isOk())
            .andExpect(content().string("Hello Gradle!"));
    }

}
```

`helloGradle`测试方法启动`App`Spring Boot应用，并在根路径上执行`GET`请求时判断返回的内容。

最后一步，我们需要为Spring Boot jar文件定义主类名称。为此，我们需要在`bootJar`配置闭包上定义`mainClassName`属性。将以下代码段添加到`build.gradle`中，然后我们就可以运行Spring Boot应用了。

__build.gradle__
``` groovy
bootJar {
    mainClassName = 'hello.App'
}
```

## 构建并运行Spring Boot应用

要构建可执行jar，可以执行以下命令：
``` sh
./gradlew bootJar
```

可执行jar位于`build/libs`目录中，您可以通过执行以下命令来运行它：
``` sh
java -jar build/libs/gradle-spring-boot-project.jar
```

运行应用程序的另一种方法是通过执行以下Gradle命令：
``` sh
./gradlew bootRun
```

该命令将直接在默认端口`8080`上运行Spring Boot应用。成功启动后，您可以打开浏览器并访问http://localhost:8080，您应该会看到`Hello Gradle!`浏览器窗口中显示消息。

## 从现有的Spring Boot 1.5项目迁移

如果您已经有一个1.5.x Spring Boot项目，并且想要迁移到更新的2.x版本，则可以遵循[本指南](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide#spring-boot-gradle-plugin)。请仔细阅读升级说明，以成功升级到最新的Spring Boot Gradle插件。

## 下一步

现在您已经知道新的Spring Boot Gradle插件的基础知识，您可以阅读[其文档](https://docs.spring.io/spring-boot/docs/2.0.3.RELEASE/gradle-plugin/reference/html)以获取更多详细信息。

如果您对构建扫描以及内部构建的更多度量标准和工具感兴趣，还请查看[Gradle Enterprise](https://gradle.com/?_ga=2.224414163.896254753.1571010126-1564571921.1570494734)。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/building-spring-boot-2-projects-with-gradle](https://github.com/gradle-guides/building-spring-boot-2-projects-with-gradle/)中添加issue或合并请求，我们将尽快与您联系。
