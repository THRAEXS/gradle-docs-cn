module.exports = {
  base: '/gradle-docs-cn/',
  title: 'Gradle Build Tool',
  description: 'Gradle Chinese document',
  port: 8086,
  head: [
    [ 'link', { rel: 'icon', href: '/favicon.ico' } ]
  ],
  plugins: ['code-switcher'],
  configureWebpack: (config, isServer) => {
    if (!isServer && config.mode === 'production') {
      const Storage = require('dom-storage')
      global.localStorage = new Storage(null, { strict: true })
    }
  },
  themeConfig: {
    nav: [
      // { text: 'Guides', link: '/guides/' },
      { text: '文档主页', link: '/contents/01-docs-home/' },
      // { text: '教程', link: 'https://gradle.org/guides' },
      { text: '指南', link: '/guides/01-getting-started/01-creating-new-gradle-builds' },
      { text: '发布说明', link: 'https://docs.gradle.org/current/release-notes.html' },
      { text: 'Gradle API', items: [
        { text: 'Javadoc', link: 'https://gradle.org/guides' },
        { text: 'Groovy DSL Reference', link: 'https://gradle.org/guides2' },
        { text: 'Groovy DSL Primer', link: 'https://gradle.org/guides3' },
        { text: 'Kotlin DSL API', link: 'https://gradle.org/guides4' },
        { text: 'Kotlin DSL Primer', link: 'https://gradle.org/guides5' }
      ] },
    ],
    sidebar: {
      '/contents/': [
        {
          title: '关于Gradle',
          children: [
            '00-about-gradle/'
          ]
        },
        {
          title: '用户手册',
          children: [
            '02-user-manual/01-getting-started',
            '02-user-manual/02-installing-gradle',
            {
              title: '升级Gradle...',
              children: [
                // ['02-user-manual/03-upgrading-gradle-01', 'version 5.X'],
                // ['02-user-manual/03-upgrading-gradle-02', 'version 4.X to 5.0']
                ['https://docs.gradle.org/current/userguide/upgrading_version_5.html', 'version 5.X'],
                ['https://docs.gradle.org/current/userguide/upgrading_version_4.html', 'version 4.X to 5.0']
              ]
            },
            {
              title: '迁移至Gradle...',
              children: [
                ['https://docs.gradle.org/current/userguide/migrating_from_maven.html', 'from Maven'],
                ['https://docs.gradle.org/current/userguide/migrating_from_ant.html', 'from Ant']
              ]
            },
            '02-user-manual/05-troubleshooting-builds'
          ]
        },
        {
          title: '运行Gradle构建',
          children: [
            {
              title: '自定义Execution',
              children: [
                ['03-running-gradle-builds/01-customizing-execution/01-build-environment', '配置构建环境'],
                ['03-running-gradle-builds/01-customizing-execution/02-the-gradle-daemon', '配置Gradle Daemon'],
                ['03-running-gradle-builds/01-customizing-execution/03-initialization-scripts', '使用初始化脚本']
              ]
            },
            '03-running-gradle-builds/02-executing-multi-project-builds',
            ['https://guides.gradle.org/creating-build-scans/', '检查Gradle构建'],
            {
              title: '优化构建时间',
              children: []
            },
            ['03-running-gradle-builds/05-integrating-separate-gradle-builds', '集成单独的Gradle构建(复合构建)']
          ]
        },
        {
          title: '编写Gradle构建',
          children: []
        },
        {
          title: '扩展Gradle',
          children: []
        },
        {
          title: '参考',
          children: []
        }
      ],
      '/guides/': [
        ['/contents/01-docs-home/', '用户手册'],
        ['https://gradle.org/guides/', '教程'],
        ['https://docs.gradle.org/current/dsl/', 'DSL参考'],
        {
          title: '入门',
          children: [
            '01-getting-started/01-creating-new-gradle-builds',
            '01-getting-started/02-creating-build-scans',
            ['https://docs.gradle.org/current/userguide/migrating_from_maven.html', '从Maven迁移']
          ]
        },
        {
          title: '项目教程',
          children: [
              {
                  title: 'C++',
                  children: [
                      ['https://guides.gradle.org/building-cpp-applications/', '构建C++应用'],
                      ['https://guides.gradle.org/building-cpp-libraries/', '构建和测试C++库']
                  ]
              },
              {
                  title: 'Groovy',
                  children: [
                      ['https://guides.gradle.org/building-groovy-libraries/', '构建Groovy库']
                  ]
              },
              {
                  title: 'Java',
                  children: [
                      '02-project-tutorials/03-java/01-building-java-applications',
                      '02-project-tutorials/03-java/02-building-java-libraries',
                      '02-project-tutorials/03-java/03-building-java9-modules',
                      '02-project-tutorials/03-java/04-building-java-web-applications',
                      ['02-project-tutorials/03-java/05-building-spring-boot-2x-applications', '构建Spring Boot 2.x应用']
                  ]
              },
              {
                  title: 'JavaScript',
                  children: [
                      '02-project-tutorials/04-javascript/01-running-webpack-with-gradle'
                  ]
              },
              {
                  title: 'Kotlin',
                  children: [
                      ['https://guides.gradle.org/building-kotlin-jvm-libraries/', '构建Kotlin JVM库']
                  ]
              },
              {
                  title: 'Scala',
                  children: [
                      ['https://guides.gradle.org/building-scala-libraries/', '构建Scala库']
                  ]
              },
              {
                  title: 'Spring',
                  children: [
                      '02-project-tutorials/03-java/05-building-spring-boot-2x-applications'
                  ]
              }
          ]
        },
        {
          title: '集成Gradle',
          children: [
              {
                  title: '持续集成',
                  children: [
                      '03-integrating-gradle/01-continuous-integration/01-using-gradle-with-jenkins',
                      '03-integrating-gradle/01-continuous-integration/02-using-gradle-with-teamcity',
                      '03-integrating-gradle/01-continuous-integration/03-gradle-with-travis-ci'
                  ]
              }
          ]
        },
        {
          title: '扩展Gradle',
          children: [
              {
                  title: '插件开发指南',
                  children: [
                      '04-extending-gradle/01-plugin-development-guides/01-designing-gradle-plugins',
                      '04-extending-gradle/01-plugin-development-guides/02-implementing-gradle-plugins',
                      '04-extending-gradle/01-plugin-development-guides/03-testing-gradle-plugins',
                      ['04-extending-gradle/01-plugin-development-guides/04-publishing-gradle-plugins', '发布Gradle插件']
                  ]
              },
              ['04-extending-gradle/02-developing-parallel-tasks', '开发并行任务']
          ]
        }
      ]
    }
  }
}
