<template>
  <v-app>
    <v-main>
      <SnakeApp/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import SnakeApp from './components/SnakeApp.vue';

export default Vue.extend({
  name: 'App',

  components: {
    SnakeApp,
  },

  data: () => ({
    //
  }),
});
</script>
