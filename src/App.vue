<!--
 * App
 *
 * Main/entry component
-->
<template>
    <div id="app" class="uk-position-absolute uk-height-1-1 uk-width-1-1">
        <div class="uk-background-cover uk-position-fixed uk-position-top-left uk-height-1-1 uk-width-1-1" />
        <div class="uk-grid uk-grid-collapse uk-margin-top expand-height uk-width-1-1">
            <navigation class="uk-width-auto expand-height uk-background-secondary" />
            <div id="content" class="uk-width-expand">
                <div class="uk-container uk-container-expand uk-width-1-1">
                    <div class="uk-margin-bottom">
                        <div class="uk-width-1-1 uk-padding-small uk-text-left">
                            <h1 class="uk-heading-primary uk-heading-bullet">Immigration Detention in the UK</h1>
                        </div>
                        <router-view />
                    </div>
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
    @import './assets/scss/variables.scss';
    @import 'assets/scss/theme';
    #app > .uk-background-cover {
        background-image: url(assets/images/bars-shadow-dark.jpg);
        z-index: -1;
    }
</style>
