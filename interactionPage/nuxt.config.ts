export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    baseURL: "/interactionPage",
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/interactionPage/favicon.ico' }
      ]
    }
  }
})
