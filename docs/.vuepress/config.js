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
        { text: 'Groovy DSL Reference', link: 'https://gradle.org/guides' },
        { text: 'Groovy DSL Primer', link: 'https://gradle.org/guides' },
        { text: 'Kotlin DSL API', link: 'https://gradle.org/guides' },
        { text: 'Kotlin DSL Primer', link: 'https://gradle.org/guides' }
      ] },
    ],
    sidebar: [
      {
        title: 'User Manual',
        // path: '/contents/02-user-manual/',
        children: [
          '/contents/02-user-manual/01-getting-started',
          '/contents/02-user-manual/02-installing-gradle'
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
