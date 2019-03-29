<!--
 * Navigation
 *
 * Navigation Menu
-->
<template>
    <nav class="component-navigation uk-background-secondary">
        <!-- Nav Bar Links -->
        <ul class="uk-nav uk-light uk-margin-remove">
            <!-- Overview -->
            <li :class="{ 'uk-active': active==='index', 'uk-padding-small  uk-box-shadow-medium': true }">
                <router-link to="/" class="uk-height-1-1">Overview</router-link>
                <!--<div class="arrow-right"></div>-->
            </li>
            <!-- Further Analysis -->
            <li :class="{ 'uk-active': active==='detainee-origin', 'uk-padding-small': true }">
                <router-link to="/detainee-origin" class="uk-height-1-1">Origin of Detainees</router-link>
            </li>
            <li :class="{ 'uk-active': active==='todo', 'uk-padding-small': true }">
                <router-link to="/analysis" class="uk-height-1-1">Annual Trends</router-link>
            </li>
            <li :class="{ 'uk-active': active==='todo', 'uk-padding-small': true }">
                <router-link to="/analysis" class="uk-height-1-1">People Entering/<br>Leaving Detention</router-link>
            </li>
            <li :class="{ 'uk-active': active==='todo', 'uk-padding-small': true }">
                <router-link to="/analysis" class="uk-height-1-1">Detention Centres</router-link>
            </li>
            <li :class="{ 'uk-active': active==='todo', 'uk-padding-small': true }">
                <router-link to="/analysis" class="uk-height-1-1">Prosecutions for <br>Immigration Offences</router-link>
            </li>
            <!-- References -->
            <li :class="{ 'uk-active': active==='references', 'uk-padding-small': true }">
                <router-link to="/references" class="uk-height-1-1">References</router-link>
            </li>
        </ul>
    </nav>
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

<style lang="scss" scoped>
    @import '../assets/scss/variables';
    nav {
        font-size: 20px;
        li {
            height: 4em;
            border-bottom: solid 3px $global-secondary-background;
            &.uk-active {
                border-bottom: solid 3px $global-emphasis-color;
                background: lighten($global-secondary-background, 5%);
                a, a:active, a:focus, a:hover {
                    color: $text-on-secondary-color;
                }
            }
        }
    }
</style>
