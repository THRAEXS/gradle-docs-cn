(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{223:function(e,r,a){"use strict";a.r(r);var t=a(0),s=Object(t.a)({},(function(){var e=this,r=e.$createElement,a=e._self._c||r;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"page-title"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#page-title","aria-hidden":"true"}},[e._v("#")]),e._v(" "+e._s(e.$page.title))]),e._v(" "),a("blockquote",[a("p",[a("a",{attrs:{href:"https://docs.gradle.org/current/userguide/installation.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("原文链接"),a("OutboundLink")],1)])]),e._v(" "),a("p"),a("div",{staticClass:"table-of-contents"},[a("ul",[a("li",[a("a",{attrs:{href:"#先决条件"}},[e._v("先决条件")])]),a("li",[a("a",{attrs:{href:"#使用软件包管理器进行安装"}},[e._v("使用软件包管理器进行安装")])]),a("li",[a("a",{attrs:{href:"#手动安装"}},[e._v("手动安装")]),a("ul",[a("li",[a("a",{attrs:{href:"#step1-下载-https-gradle-org-releases-最新的gradle发行版"}},[e._v("Step1.下载最新的Gradle发行版")])]),a("li",[a("a",{attrs:{href:"#step2-解压发行包-zip"}},[e._v("Step2.解压发行包(ZIP)")])]),a("li",[a("a",{attrs:{href:"#step3-配置系统环境"}},[e._v("Step3.配置系统环境")])])])]),a("li",[a("a",{attrs:{href:"#验证安装"}},[e._v("验证安装")])]),a("li",[a("a",{attrs:{href:"#下一步"}},[e._v("下一步")])])])]),a("p"),e._v(" "),a("p",[e._v("您可以在Linux，macOS或Windows上安装Gradle构建工具。本文档涵盖使用软件包管理器（如SDKMAN!）进行安装或Homebrew，以及手动安装。")]),e._v(" "),a("p",[e._v("建议使用"),a("a",{attrs:{href:"https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:upgrading_wrapper",target:"_blank",rel:"noopener noreferrer"}},[e._v("Gradle Wrapper"),a("OutboundLink")],1),e._v("升级Gradle。")]),e._v(" "),a("p",[e._v("您可以在"),a("a",{attrs:{href:"https://gradle.org/releases/",target:"_blank",rel:"noopener noreferrer"}},[e._v("releases page"),a("OutboundLink")],1),e._v("上找到所有版本及其校验。")]),e._v(" "),a("h2",{attrs:{id:"先决条件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#先决条件","aria-hidden":"true"}},[e._v("#")]),e._v(" 先决条件")]),e._v(" "),a("p",[e._v("Gradle可在所有主要操作系统上运行，并且仅需要"),a("a",{attrs:{href:"https://jdk.java.net",target:"_blank",rel:"noopener noreferrer"}},[e._v("Java Development Kit"),a("OutboundLink")],1),e._v("版本8或更高版本即可运行。要进行检查，请运行"),a("code",[e._v("java -version")]),e._v("。您应该会看到以下内容：")]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("div",{staticClass:"highlight-lines"},[a("div",{staticClass:"highlighted"},[e._v(" ")]),a("br"),a("br"),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[e._v("❯ java -version\njava version "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v('"1.8.0_151"')]),e._v("\nJava"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("TM"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" SE Runtime Environment "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("build "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("1.8")]),e._v(".0_151-b12"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\nJava HotSpot"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("TM"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("64")]),e._v("-Bit Server VM "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("build "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("25.151")]),e._v("-b12, mixed mode"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),a("p",[e._v("Gradle附带了自己的Groovy库，因此不需要安装Groovy。 Gradle将忽略任何现有的Groovy安装。")]),e._v(" "),a("p",[e._v("Gradle使用在路径中找到的任何JDK。另外，您可以将"),a("code",[e._v("JAVA_HOME")]),e._v("环境变量设置为指向所需JDK的安装目录。")]),e._v(" "),a("h2",{attrs:{id:"使用软件包管理器进行安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用软件包管理器进行安装","aria-hidden":"true"}},[e._v("#")]),e._v(" 使用软件包管理器进行安装")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://sdkman.io",target:"_blank",rel:"noopener noreferrer"}},[e._v("SDKMAN!"),a("OutboundLink")],1),e._v("是用于在大多数类Unix系统（macOS，Linux，Cygwin，Solaris和FreeBSD）上管理多个软件开发套件的并行版本的工具。我们部署并维护可从SDKMAN!获得的版本。")]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[e._v("❯ sdk "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" gradle\n")])])]),a("p",[a("a",{attrs:{href:"http://brew.sh",target:"_blank",rel:"noopener noreferrer"}},[e._v("Homebrew"),a("OutboundLink")],1),e._v("是“macOS缺少的软件包管理器”。")]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[e._v("❯ brew "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("install")]),e._v(" gradle\n")])])]),a("p",[e._v("可以使用其他软件包管理器，但是它们分发的Gradle版本不受 "),a("strong",[e._v("Gradle, Inc.")]),e._v(" 的控制。Linux软件包管理器可能会分发与正式版本相比不兼容或不完整的Gradle修改版(从SDKMAN!或更低版本提供)。")]),e._v(" "),a("p",[a("a",{attrs:{href:"#%E4%B8%8B%E4%B8%80%E6%AD%A5"}},[e._v("↓进行下一步")])]),e._v(" "),a("h2",{attrs:{id:"手动安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#手动安装","aria-hidden":"true"}},[e._v("#")]),e._v(" 手动安装")]),e._v(" "),a("h3",{attrs:{id:"step1-下载最新的gradle发行版"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#step1-下载最新的gradle发行版","aria-hidden":"true"}},[e._v("#")]),e._v(" Step1."),a("a",{attrs:{href:"https://gradle.org/releases/",target:"_blank",rel:"noopener noreferrer"}},[e._v("下载"),a("OutboundLink")],1),e._v("最新的Gradle发行版")]),e._v(" "),a("p",[e._v("发行的ZIP文件有两种形式：")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("Binary-only(bin): 仅有可运行的二进制文件")])]),e._v(" "),a("li",[a("p",[e._v("Complete(all) with docs and sources: 附带文档和源码")])])]),e._v(" "),a("p",[e._v("如需使用旧版本，请参阅"),a("a",{attrs:{href:"https://gradle.org/releases/",target:"_blank",rel:"noopener noreferrer"}},[e._v("releases page"),a("OutboundLink")],1),e._v("。")]),e._v(" "),a("h3",{attrs:{id:"step2-解压发行包-zip"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#step2-解压发行包-zip","aria-hidden":"true"}},[e._v("#")]),e._v(" Step2.解压发行包(ZIP)")]),e._v(" "),a("h4",{attrs:{id:"linux和macos用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#linux和macos用户","aria-hidden":"true"}},[e._v("#")]),e._v(" Linux和MacOS用户")]),e._v(" "),a("p",[e._v("在您选择的目录中解压缩发行版zip文件，例如：")]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("div",{staticClass:"highlight-lines"},[a("br"),a("div",{staticClass:"highlighted"},[e._v(" ")]),a("br"),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[e._v("❯ "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("mkdir")]),e._v(" /opt/gradle\n❯ "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("unzip")]),e._v(" -d /opt/gradle gradle-5.6.2-bin.zip\n❯ "),a("span",{pre:!0,attrs:{class:"token function"}},[e._v("ls")]),e._v(" /opt/gradle/gradle-5.6.2\nLICENSE  NOTICE  bin  getting-started.html  init.d  lib  media\n")])])]),a("h4",{attrs:{id:"microsoft-windows用户"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#microsoft-windows用户","aria-hidden":"true"}},[e._v("#")]),e._v(" Microsoft Windows用户")]),e._v(" "),a("p",[e._v("使用文件资源管理器创建一个新目录"),a("code",[e._v("C:\\Gradle")]),e._v("。")]),e._v(" "),a("p",[e._v("打开第二个“文件资源管理器”窗口，然后转到下载Gradle发行版的目录。双击ZIP存档以显示内容。将内容文件夹"),a("code",[e._v("gradle-5.6.2")]),e._v("拖到新创建的"),a("code",[e._v("C:\\Gradle")]),e._v("文件夹中。")]),e._v(" "),a("p",[e._v("另外，您可以使用压缩工具将Gradle发行版ZIP解压至"),a("code",[e._v("C:\\Gradle")]),e._v("。")]),e._v(" "),a("h3",{attrs:{id:"step3-配置系统环境"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#step3-配置系统环境","aria-hidden":"true"}},[e._v("#")]),e._v(" Step3.配置系统环境")]),e._v(" "),a("p",[e._v("要运行Gradle，从Gradle网站到解压缩文件的路径必须在您的终端路径上。对于每个操作系统，执行此操作的步骤都不同。")]),e._v(" "),a("h4",{attrs:{id:"linux和macos用户-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#linux和macos用户-2","aria-hidden":"true"}},[e._v("#")]),e._v(" Linux和MacOS用户")]),e._v(" "),a("p",[e._v("配置"),a("code",[e._v("PATH")]),e._v("环境变量以包含解压缩发行版的bin目录，例如：")]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[e._v("❯ "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[e._v("export")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[a("span",{pre:!0,attrs:{class:"token environment constant"}},[e._v("PATH")])]),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),a("span",{pre:!0,attrs:{class:"token environment constant"}},[e._v("$PATH")]),e._v(":/opt/gradle/gradle-5.6.2/bin\n")])])]),a("p",[e._v("或者，您也可以添加环境变量"),a("code",[e._v("GRADLE_HOME")]),e._v("并将其指向解压缩的发行版。可以将"),a("code",[e._v("$GRADLE_HOME/bin")]),e._v("添加到"),a("code",[e._v("PATH")]),e._v("，而不是将特定版本的Gradle添加到"),a("code",[e._v("PATH")]),e._v("。升级到其他版本的Gradle时，只需更改"),a("code",[e._v("GRADLE_HOME")]),e._v("环境变量即可。")]),e._v(" "),a("h4",{attrs:{id:"microsoft-windows用户-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#microsoft-windows用户-2","aria-hidden":"true"}},[e._v("#")]),e._v(" Microsoft Windows用户")]),e._v(" "),a("p",[e._v("在文件资源管理器中，右键单击“此PC（或计算机）”图标，然后单击“属性”→“高级系统设置”→“环境变量”。")]),e._v(" "),a("p",[e._v("在“系统变量”下，选择“路径”，然后单击“编辑”。为"),a("code",[e._v("C:\\Gradle\\gradle-5.6.2\\bin")]),e._v("bin添加一个条目。单击确定保存。")]),e._v(" "),a("p",[e._v("或者，您也可以添加环境变量"),a("code",[e._v("GRADLE_HOME")]),e._v("并将其指向解压缩的发行版。可以将"),a("code",[e._v("％GRADLE_HOME％/bin")]),e._v("添加到您的"),a("code",[e._v("Path")]),e._v("中，而不是将特定版本的Gradle添加到"),a("code",[e._v("Path")]),e._v("中。升级到其他版本的Gradle时，只需更改"),a("code",[e._v("GRADLE_HOME")]),e._v("环境变量即可。")]),e._v(" "),a("p",[a("a",{attrs:{href:"#%E4%B8%8B%E4%B8%80%E6%AD%A5"}},[e._v("↓进行下一步")])]),e._v(" "),a("h2",{attrs:{id:"验证安装"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#验证安装","aria-hidden":"true"}},[e._v("#")]),e._v(" 验证安装")]),e._v(" "),a("p",[e._v("打开控制台（或Windows命令提示符）并运行"),a("code",[e._v("gradle -v")]),e._v("以运行gradle并显示版本，例如：")]),e._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("div",{staticClass:"highlight-lines"},[a("div",{staticClass:"highlighted"},[e._v(" ")]),a("br"),a("br"),a("br"),a("br"),a("br"),a("br"),a("br")]),a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[e._v("❯ gradle -v\n\n------------------------------------------------------------\nGradle "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("5.6")]),e._v(".2\n------------------------------------------------------------\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),e._v("environment specific information"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n")])])]),a("p",[e._v("如果遇到任何麻烦，请参阅"),a("a",{attrs:{href:"https://docs.gradle.org/current/userguide/troubleshooting.html#sec:troubleshooting_installation",target:"_blank",rel:"noopener noreferrer"}},[e._v("排除安装故障部分"),a("OutboundLink")],1),e._v("。")]),e._v(" "),a("p",[e._v("您可以通过下载SHA-256文件（可从"),a("a",{attrs:{href:"https://gradle.org/releases/",target:"_blank",rel:"noopener noreferrer"}},[e._v("releases page"),a("OutboundLink")],1),e._v("中获得）并按照以下"),a("a",{attrs:{href:"https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:verification",target:"_blank",rel:"noopener noreferrer"}},[e._v("验证指示信息"),a("OutboundLink")],1),e._v("来验证Gradle发行版的完整性。")]),e._v(" "),a("h2",{attrs:{id:"下一步"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#下一步","aria-hidden":"true"}},[e._v("#")]),e._v(" 下一步")]),e._v(" "),a("p",[e._v("现在您已经安装了Gradle，请使用以下资源进行入门：")]),e._v(" "),a("ul",[a("li",[a("p",[e._v("按照"),a("a",{attrs:{href:"https://guides.gradle.org/creating-new-gradle-builds/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Creating New Gradle Builds"),a("OutboundLink")],1),e._v("教程创建第一个Gradle项目。")])]),e._v(" "),a("li",[a("p",[e._v("与核心工程师一起注册"),a("a",{attrs:{href:"https://gradle.com/training",target:"_blank",rel:"noopener noreferrer"}},[e._v("Gradle现场入门培训"),a("OutboundLink")],1),e._v("。")])]),e._v(" "),a("li",[a("p",[e._v("了解如何通过"),a("a",{attrs:{href:"https://docs.gradle.org/current/userguide/command_line_interface.html#command_line_interface",target:"_blank",rel:"noopener noreferrer"}},[e._v("command-line interface"),a("OutboundLink")],1),e._v("完成常见任务。")])]),e._v(" "),a("li",[a("p",[a("a",{attrs:{href:"https://docs.gradle.org/current/userguide/build_environment.html#build_environment",target:"_blank",rel:"noopener noreferrer"}},[e._v("Configure Gradle execution"),a("OutboundLink")],1),e._v("，例如使用HTTP代理下载依赖项。")])]),e._v(" "),a("li",[a("p",[e._v("订阅"),a("a",{attrs:{href:"https://newsletter.gradle.com/?_ga=2.23577274.1480847771.1569235223-1279986108.1569235223",target:"_blank",rel:"noopener noreferrer"}},[e._v("Gradle Newsletter"),a("OutboundLink")],1),e._v("以获取每月发布和社区更新。")])])])])}),[],!1,null,null,null);r.default=s.exports}}]);