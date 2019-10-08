module.exports = {
  base: '/gradle-docs/',
  title: 'Gradle Build Tool',
  description: 'Gradle Chinese document',
  port: 8086,
  head: [
    [ 'link', { rel: 'icon', href: '/favicon.ico' } ]
  ],
  plugins: ['code-switcher'],
  configureWebpack: (config, isServer) => {
    console.log(config)
  },
  themeConfig: {
    nav: [
      { text: 'Docs Home', link: '/contents/01-docs-home/' },
      { text: 'Tutorials', link: 'https://gradle.org/guides' },
      { text: 'Release Notes', link: 'https://docs.gradle.org/current/release-notes.html' },
      { text: 'Gradle API', items: [
        { text: 'Javadoc', link: 'https://gradle.org/guides' },
        { text: 'Groovy DSL Reference', link: 'https://gradle.org/guides2' },
        { text: 'Groovy DSL Primer', link: 'https://gradle.org/guides3' },
        { text: 'Kotlin DSL API', link: 'https://gradle.org/guides4' },
        { text: 'Kotlin DSL Primer', link: 'https://gradle.org/guides5' }
      ] },
    ],
    sidebar: [
      {
        title: 'About Gradle',
        children: [
          '/contents/00-about-gradle/'
        ]
      },
      {
        title: 'User Manual',
        children: [
          '/contents/02-user-manual/01-getting-started',
          '/contents/02-user-manual/02-installing-gradle',
          {
            title: '升级Gradle...',
            children: [
              // ['/contents/02-user-manual/03-upgrading-gradle-01', 'version 5.X'],
              // ['/contents/02-user-manual/03-upgrading-gradle-02', 'version 4.X to 5.0']
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
          '/contents/02-user-manual/05-troubleshooting-builds'
        ]
      },
      {
        title: 'Running Gradle Builds',
        children: [
          {
            title: '自定义Execution',
            children: [
              ['/contents/03-running-gradle-builds/01-customizing-execution/01-build-environment', '配置构建环境'],
              ['/contents/03-running-gradle-builds/01-customizing-execution/02-the-gradle-daemon', '配置Gradle Daemon'],
              ['/contents/03-running-gradle-builds/01-customizing-execution/03-initialization-scripts', '使用初始化脚本']
            ]
          },
          '/contents/03-running-gradle-builds/02-executing-multi-project-builds',
          ['https://guides.gradle.org/creating-build-scans/', '检查Gradle构建'],
          {
            title: '优化构建时间',
            children: []
          },
          ['/contents/03-running-gradle-builds/05-integrating-separate-gradle-builds', '集成单独的Gradle构建(复合构建)']
        ]
      },
      {
        title: 'Authoring Gradle Builds',
        children: []
      },
      {
        title: 'Extending Gradle',
        children: []
      },
      {
        title: 'Reference',
        children: []
      }
    ]
  }
}
