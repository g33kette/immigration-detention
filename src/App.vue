<!--
 * App
 *
 * Main/entry component
-->
<template>
  <div id="app">
    <header class="uk-position-fixed uk-position-top uk-position-z-index">
      <navigation />
    </header>
    <div style="margin-top: 80px;">
      <div class="uk-container uk-container-expand">
        <div class="uk-margin-top uk-margin-bottom">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigation from './components/Navigation';

  export default {
    name: 'App',
    components: { Navigation },
  };
</script>

<style lang="scss">
  @import 'assets/scss/theme';
</style>
