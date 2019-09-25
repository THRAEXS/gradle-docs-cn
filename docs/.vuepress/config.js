module.exports = {
  // base: '/gradle-docs/',
  title: 'Gradle Build Tool',
  description: 'Gradle Chinese document',
  port: 8086,
  head: [
    [ 'link', { rel: 'icon', href: '/favicon.ico' } ]
  ],
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
        children: []
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
