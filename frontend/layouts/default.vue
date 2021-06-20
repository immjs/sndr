<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="#151515"
      flat
    >
      <v-avatar
        :color="$vuetify.breakpoint.smAndDown ? 'grey darken-1' : 'transparent'"
        size="32"
      />

      <v-tabs
        centered
        class="ml-n9"
        color="white"
      >
        <v-tab
          v-for="link in links"
          :key="link.href"
        >
          {{ link.display }}
        </v-tab>
      </v-tabs>

      <v-avatar
        class="hidden-sm-and-down"
        color="grey darken-1 shrink"
        size="32"
      ></v-avatar>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
export default {
  data: () => ({
    links: [
      {
        display: 'Home',
        href: '/',
      },
      {
        display: 'Modules',
        href: '/modules',
      },
      {
        display: 'Getting Started',
        href: '/getting-started',
      },
      {
        display: 'Updates',
        href: '/updates',
      },
    ],
  }),
}
</script>