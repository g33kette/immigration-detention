<!--
 * Navigation
 *
 * Navigation Menu
-->
<template>
    <div class="component-navigation uk-container uk-container-expand uk-background-primary">
        <nav class="uk-navbar uk-light" uk-navbar>
            <div class="uk-navbar-left uk-width-1-1">
                <!-- Nav Bar Logo -->
                <a class="uk-navbar-item uk-logo" href="#">
                    <img alt="Drop Logo"
                         src="./../assets/images/drop-small-green.png"
                         style="height: 1.5em; width: 1.5em">
                </a>
                <!-- Nav Bar Links -->
                <ul class="uk-navbar-nav">
                    <!-- Overview -->
                    <li :class="{ 'uk-active': active==='index' }">
                        <router-link to="/">Overview</router-link>
                    </li>
                    <!-- Further Analysis -->
                    <li :class="{ 'uk-active': active==='analysis' }">
                        <router-link to="/analysis">Data Analysis</router-link>
                    </li>
                    <!-- References -->
                    <li :class="{ 'uk-active': active==='references' }">
                        <router-link to="/references">References</router-link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    data() {
        // Set active route name
        return { active: this.$router.currentRoute.name };
    },
    watch: {
        $route() {
            // Update on route change
            this.active = this.$router.currentRoute.name;
        },
    },
};
</script>

