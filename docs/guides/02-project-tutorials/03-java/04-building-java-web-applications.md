---
title: 构建Java Web应用
date: 2019-10-12 10:36:00
---

# {{ $page.title }}

> [原文链接](https://guides.gradle.org/building-java-web-applications/)

[[toc]]

Gradle包含一个用于构建Java Web应用的`war`插件，并且社区提供了一个名为`gretty`的优秀插件，用于在Jetty或Tomcat上测试和部署Web应用程序。本指南演示了如何使用`gretty`插件构建一个简单的Web应用程序并将其部署在Jetty上。您还将学习如何使用Mockito框架为Servlet编写单元测试，以及如何使用`gretty`和Selenium为网络应用编写功能测试。

## 您需要什么

- 约20分钟

- 文本编辑器或IDE

- Java发行版

    - 版本7或更高版本（如果使用Gradle Groovy DSL）

    - 版本8或更高版本（如果使用Gradle Kotlin DSL）

- [Gradle版本](https://gradle.org/install/)4.10.3或更高版本

## 创建Web应用的结构

Gradle包含一个`war`插件，在用户手册的[WAR插件一章](https://docs.gradle.org/4.10.3/userguide/war_plugin.html)中进行了介绍。`war`插件扩展了Java插件，以添加对Web应用的支持。默认情况下，它使用一个名为`src/main/webapp`的文件夹来获取与Web相关的资源。

::: tip
用户手册中的"Web Application Quickstart"部分仍指`jetty`插件，不推荐使用该插件，而推荐使用此处使用的`gretty`插件。但是，特定于`war`插件的零件很好，该部分将很快更新。
:::

因此，为名为`webdemo`的项目创建以下文件结构：

__Sample project layout__
```
webdemo/
    src/
        main/
            java/
            webapp/
        test
            java/
```

任何servlet或其他Java类都将进入`src/main/java`，测试将进入`src/test/java`，其他Web构件将进入`src/main/webapp`。

## 添加Gradle构建文件

将一个名为`build.gradle`（如果使用Groovy DSL）或`build.gradle.kts`（如果使用Kotlin DSL）的文件添加到项目的根目录，其内容如下：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

plugins {
    id 'war' // 1
}

repositories {
    jcenter()
}

dependencies {
    providedCompile 'javax.servlet:javax.servlet-api:3.1.0' // 2
    testCompile 'junit:junit:4.12'
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

plugins {
    war // 1
}

repositories {
    jcenter()
}

dependencies {
    providedCompile("javax.servlet:javax.servlet-api:3.1.0") // 2
    testCompile("junit:junit:4.12")
}
```

</template>
</CodeSwitcher>

1. 使用`war`插件
2. Servlet API的当前发行版

war插件添加了`providerCompile`和`providerRuntime`配置，类似于常规Java应用程序中的`compile`和`runtime`，以表示本地所需的依赖关系，但不应将其添加到生成的`webdemo.war`文件中。

`plugins`语法用于应用`java`和`war`插件。两者都不需要版本，因为它们包含在Gradle发行版中。

通过执行`wrapper`任务为项目生成Gradle包装器是一个好习惯：

``` sh {1}
$ gradle wrapper --gradle-version=4.10.3
:wrapper
```

如用户手册的[包装器部分](https://docs.gradle.org/4.10.3/userguide/gradle_wrapper.html)所述，这将生成`gradlew`和`gradlew.bat`脚本以及内部装有包装器的`gradle`文件夹。

::: tip
如果您使用的是Gradle 4.0或更高版本，则控制台中的输出可能会比本指南中看到的少。在本指南中，使用命令行上的`--console=plain`标志显示输出。这样做是为了显示Gradle正在执行的任务。
:::

## 向项目添加Servlet和元数据

定义Web应用程序元数据有两个选项。在Servlet规范3.0版之前，元数据位于项目的`WEB-INF`文件夹中的部署描述符中，称为`web.xml`。从3.0开始，可以使用注解定义元数据。

在`src/main/java`文件夹下创建一个软件包文件夹`org/gradle/demo`。添加一个具有以下内容的servlet文件`HelloServlet.java`：

__src/main/java/org/gradle/demo/HelloServlet.java__
``` java
package org.gradle.demo;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "HelloServlet", urlPatterns = {"hello"}, loadOnStartup = 1) // 1
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        response.getWriter().print("Hello, World!"); // 2
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        String name = request.getParameter("name");
        if (name == null) name = "World";
        request.setAttribute("user", name);
        request.getRequestDispatcher("response.jsp").forward(request, response); // 3
    }
}
```

1. 基于注解的servlet
2. GET请求返回一个简单的字符串
3. POST请求转发到JSP页面

Servlet使用`@WebServlet`注解进行配置。`doGet`方法通过向输出写入器写入"Hello, World!"来响应HTTP GET请求。它通过查找名为`name`的请求参数并将其作为名为`user`的属性添加到`request`中，然后转发到`response.jsp`页面来对HTTP POST请求做出反应。

::: tip
`war`插件支持使用较旧的`web.xml`部署描述符，默认情况下，该描述符应位于`src/main/webapp`下的`WEB-INF`文件夹中。随意使用它作为基于注解的方法的替代方法。
:::

现在，您有一个简单的servlet，它可以响应HTTP GET和POST请求。

## 将JSP页面添加到演示应用中

通过在`src/main/webapp`文件夹中创建文件`index.html`，将索引页添加到应用程序的根目录，其内容如下：

__src/main/webapp/index.html__
``` html
<html>
<head>
  <title>Web Demo</title>
</head>
<body>
<p>Say <a href="hello">Hello</a></p> <!-- 1 -->

<form method="post" action="hello"> <!-- 2 -->
  <h2>Name:</h2>
  <input type="text" id="say-hello-text-input" name="name" />
  <input type="submit" id="say-hello-button" value="Say Hello" />
</form>
</body>
</html>
```

1. 链接提交GET请求
2. 表单使用POST请求

`index.html`页面使用一个链接向Servlet提交HTTP GET请求，并使用一个表单提交HTTP POST请求。表单包含一个名为`name`的文本字段，该servlet可以通过其`doPost`方法访问该文本字段。

Servlet在其`doPost`方法中将控制权转发到另一个JSP页面，该页面称为`response.jsp`。因此，请在`src/main/webapp`中定义具有以下名称的文件：

__src/main/webapp/response.jsp__
``` html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
        <title>Hello Page</title>
    </head>
    <body>
        <h2>Hello, ${user}!</h2>
    </body>
</html>
```

`response`页面从请求中访问`user`变量，并将其呈现在`h2`标签内。

## 添加`gretty`插件并运行应用

`gretty`插件是一个出色的社区支持插件，可以在Gradle插件存储库中找到，网址为[https://plugins.gradle.org/plugin/org.akhikhl.gretty](https://plugins.gradle.org/plugin/org.akhikhl.gretty)。该插件可以轻松在Jetty或Tomcat上运行或测试Web应用。

通过将以下行添加到构建脚本中的`plugins`块中，将其添加到我们的项目中。

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

plugins {
    id 'war'
    id 'org.gretty' version '2.2.0' // 1
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

plugins {
    war
    id("org.gretty") version "2.2.0" // 1
}
```

</template>
</CodeSwitcher>

1. 添加`gretty`插件

`gretty`插件向应用添加了大量任务，对于在Jetty或Tomcat环境中运行或测试很有用。现在，您可以使用`appRun`任务将应用构建并部署到默认（Jetty）容器。

__执行`appRun`任务__
``` sh {1}
$ ./gradlew appRun
:prepareInplaceWebAppFolder
:createInplaceWebAppFolder UP-TO-DATE
:compileJava
:processResources UP-TO-DATE
:classes
:prepareInplaceWebAppClasses
:prepareInplaceWebApp
:appRun
12:25:13 INFO  Jetty 9.2.15.v20160210 started and listening on port 8080
12:25:13 INFO  webdemo runs at:
12:25:13 INFO    http://localhost:8080/webdemo
Press any key to stop the server.
> Building 87% > :appRun

BUILD SUCCESSFUL
```

您现在可以在http://localhost:8080/webdemo上访问Web应用程序，然后单击链接以执行GET请求或提交表单以执行POST请求。

尽管输出显示`尽管输出显示按任意键停止服务器，但Gradle不会拦截标准输入。要停止该过程，请按ctrl-C。`，但Gradle不会拦截标准输入。要停止该过程，请按`ctrl-C`。

## 使用Mockito对Servlet进行单元测试

开源[Mockito框架](https://site.mockito.org)使对Java应用进行单元测试变得容易。将Mockito依赖项添加到`testCompile`配置下的构建脚本。

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

dependencies {
    providedCompile 'javax.servlet:javax.servlet-api:3.1.0'
    testCompile 'junit:junit:4.12'
    testCompile 'org.mockito:mockito-core:2.7.19' // 1
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

dependencies {
    providedCompile("javax.servlet:javax.servlet-api:3.1.0")
    testCompile("junit:junit:4.12")
    testCompile("org.mockito:mockito-core:2.7.19") // 1
}
```

</template>
</CodeSwitcher>

1. 添加Mockito

要对Servlet进行单元测试，请在`src/test/java`下创建一个软件包文件夹`org.gradle.demo`。添加具有以下内容的测试类文件`HelloServletTest.java`：

__src/test/java/org/gradle/demo/HelloServletTest.java__
``` java
package org.gradle.demo;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

public class HelloServletTest {
    @Mock private HttpServletRequest request;
    @Mock private HttpServletResponse response;
    @Mock private RequestDispatcher requestDispatcher;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void doGet() throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);

        when(response.getWriter()).thenReturn(printWriter);

        new HelloServlet().doGet(request, response);

        assertEquals("Hello, World!", stringWriter.toString());
    }

    @Test
    public void doPostWithoutName() throws Exception {
        when(request.getRequestDispatcher("response.jsp"))
            .thenReturn(requestDispatcher);

        new HelloServlet().doPost(request, response);

        verify(request).setAttribute("user", "World");
        verify(requestDispatcher).forward(request,response);
    }

    @Test
    public void doPostWithName() throws Exception {
        when(request.getParameter("name")).thenReturn("Dolly");
        when(request.getRequestDispatcher("response.jsp"))
            .thenReturn(requestDispatcher);

        new HelloServlet().doPost(request, response);

        verify(request).setAttribute("user", "Dolly");
        verify(requestDispatcher).forward(request,response);
    }
}
```

该测试会为`HttpServletRequest`，`HttpServletResponse`和`RequestDispatcher`类创建模拟对象。对于`doGet`测试，将创建一个使用`StringWriter`的`PrintWriter`，并将模拟请求对象配置为在调用`getWriter`方法时将其返回。调用`doGet`方法后，测试将检查返回的字符串是否正确。

对于POST请求，将模拟请求配置为返回给定名称（如果存在）或返回`null`，并且`getRequestDispatcher`方法返回关联的模拟对象。调用`doPost`方法将执行请求。然后Mockito验证是否在模拟响应上使用适当的参数调用了`setAttribute`方法，并验证了在请求分发器上调用了`forward`方法。

现在，您可以将Gradle与`test`任务（或依赖于它的任何任务，如`build`）一起使用Gradle进行测试。

``` sh {1}
$ ./gradlew build
:compileJava UP-TO-DATE
:processResources UP-TO-DATE
:classes UP-TO-DATE
:war
:assemble
:compileTestJava
:processTestResources UP-TO-DATE
:testClasses
:test
:check
:build

BUILD SUCCESSFUL
```

可以按常规方式从`build/reports/tests/test/index.html`访问测试输出。您应该得到类似于以下结果：

![mockito test](https://guides.gradle.org/building-java-web-applications/images/test-results.png)

## 添加功能测试

`gretty`插件与Gradle结合使用，可以轻松地向Web应用程序添加功能测试。为此，将以下行添加到您的构建脚本中：

<CodeSwitcher :languages="{ groovy: 'Groovy', kotlin: 'Kotlin' }">
<template v-slot:groovy>

``` groovy
// build.gradle

gretty {
    integrationTestTask = 'test' // 1
}

// ... rest from before ...

dependencies {
    providedCompile 'javax.servlet:javax.servlet-api:3.1.0'
    testCompile 'junit:junit:4.12'
    testCompile 'org.mockito:mockito-core:2.7.19'
    testCompile 'io.github.bonigarcia:webdrivermanager:1.6.1' // 2
    testCompile 'org.seleniumhq.selenium:selenium-java:3.3.1' // 3
}
```

</template>
<template v-slot:kotlin>

``` kotlin
// build.gradle.kts

gretty {
    integrationTestTask = "test" // 1
}

// ... rest from before ...

dependencies {
    providedCompile("javax.servlet:javax.servlet-api:3.1.0")
    testCompile("junit:junit:4.12")
    testCompile("org.mockito:mockito-core:2.7.19")
    testCompile("io.github.bonigarcia:webdrivermanager:1.6.1") // 2
    testCompile("org.seleniumhq.selenium:selenium-java:3.3.1") // 3
}
```

</template>
</CodeSwitcher>

1. 告诉gretty启动和停止测试服务器
2. 自动安装浏览器驱动程序
3. 使用Selenium进行功能测试

`gretty`插件需要知道哪个任务需要启动和停止服务器。通常，这是分配给您自己的任务的，但是为了使事情简单，只需使用现有的`test`任务即可。

[Selenium](https://www.seleniumhq.org)是用于编写功能测试的流行开源API。2.0版基于WebDriver API。最新版本要求测试人员为他们的浏览器下载并安装WebDriver版本，该版本繁琐且难以自动化。[WebDriverManager](https://github.com/bonigarcia/webdrivermanager)项目使Gradle可以轻松地为您处理该过程。

在`src/test/java`目录中，将以下功能测试添加到您的项目中：

__src/test/java/org/gradle/demo/HelloServletFunctionalTest.java__
``` java
package org.gradle.demo;

import io.github.bonigarcia.wdm.ChromeDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import static org.junit.Assert.assertEquals;

public class HelloServletFunctionalTest {
    private WebDriver driver;

    @BeforeClass
    public static void setupClass() {
        ChromeDriverManager.getInstance().setup(); // 1
    }

    @Before
    public void setUp() {
        driver = new ChromeDriver(); // 2              
    }

    @After
    public void tearDown() {
        if (driver != null)
            driver.quit(); // 3                         
    }

    @Test
    public void sayHello() throws Exception { // 4      
        driver.get("http://localhost:8080/webdemo");

        driver.findElement(By.id("say-hello-text-input")).sendKeys("Dolly");
        driver.findElement(By.id("say-hello-button")).click();

        assertEquals("Hello Page", driver.getTitle());
        assertEquals("Hello, Dolly!", driver.findElement(By.tagName("h2")).getText());
    }
}
```

1. 必要时下载并安装浏览器驱动程序
2. 启动浏览器自动化
3. 完成后关闭浏览器
4. 使用Selenium API运行功能测试

此测试的WebDriverManager部分检查二进制文件的最新版本，并在不存在该二进制文件时下载并安装它。然后，`sayHello`测试方法将Chrome浏览器驱动到应用程序的根目录，填写输入文本字段，单击按钮，并验证目标页面的标题，并且`h2`标签包含预期的字符串。

WebDriverManager系统支持Chrome，Opera，Internet Explorer，Microsoft Edge，PhantomJS和Firefox。查看项目文档以获取更多详细信息。

## 运行功能测试

使用`test`任务运行测试：

``` sh {1}
$ ./gradlew test
:prepareInplaceWebAppFolder UP-TO-DATE
:createInplaceWebAppFolder UP-TO-DATE
:compileJava UP-TO-DATE
:processResources UP-TO-DATE
:classes UP-TO-DATE
:prepareInplaceWebAppClasses UP-TO-DATE
:prepareInplaceWebApp UP-TO-DATE
:compileTestJava UP-TO-DATE
:processTestResources UP-TO-DATE
:testClasses UP-TO-DATE
:appBeforeIntegrationTest
12:57:56 INFO  Jetty 9.2.15.v20160210 started and listening on port 8080
12:57:56 INFO  webdemo runs at:
12:57:56 INFO    http://localhost:8080/webdemo
:test
:appAfterIntegrationTest
Server stopped.

BUILD SUCCESSFUL
```

`gretty`插件在默认端口上启动Jetty 9的嵌入式版本，执行测试，然后关闭服务器。观看时，您会看到Selenium系统打开一个新的浏览器，访问该站点，填写表格，单击按钮，检查新页面，最后关闭浏览器。

集成测试通常通过创建单独的源集和专用任务进行处理，但这超出了本指南的范围。有关详细信息，请参见[Gretty文档](https://akhikhl.github.io/gretty-doc/)。

## 总结

在本指南中，您学习了如何：

- 在Gradle构建中使用`war`插件定义Web应用

- 将Servlet和JSP页面添加到Web应用

- 使用`gretty`插件部署应用程序

- 使用Mockito框架对Servlet进行单元测试

- 使用`gretty`和Selenium功能测试Web应用

## 下一步

Gretty是一个非常强大的API。有关详细信息，请参见[Gretty文档](https://akhikhl.github.io/gretty-doc/)。可以在Selenium网站上找到有关Selenium的更多详细信息，有关WebDriverManager系统的更多信息可以在[WebdriverDriverManager GitHub存储库](https://github.com/bonigarcia/webdrivermanager)中找到。

如果您对功能测试感兴趣，请查看开源的[Geb](https://gebish.org)库，该库基于Selenium和WebDriver提供了强大的用于浏览器自动化的Groovy DSL。

## 帮助完善本指南

有意见或问题吗？找到错字了？像所有Gradle指南一样，帮助只是GitHub issue而已。请在[gradle-guides/building-java-web-applications](https://github.com/gradle-guides/building-java-web-applications/)中添加issue或合并请求，我们将尽快与您联系。
