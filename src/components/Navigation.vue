<!--
 * Navigation
 *
 * Navigation Menu
-->
<template>
    <div class="component-navigation">
        <nav class="uk-position-fixed uk-background-secondary">
            <!-- Nav Bar Links -->
            <ul class="uk-nav uk-light uk-margin-remove">
                <!-- Overview -->
                <li :class="{ 'uk-active': active==='index', 'uk-padding-small  uk-box-shadow-medium': true }">
                    <router-link to="/" class="uk-height-1-1">Overview</router-link>
                </li>
                <!-- Further Analysis -->
                <li :class="{ 'uk-active': active==='entering-detention', 'uk-padding-small': true }">
                    <router-link to="/entering-detention" class="uk-height-1-1">
                        People Entering Detention
                    </router-link>
                </li>
                <li :class="{ 'uk-active': active==='detainee-origin', 'uk-padding-small': true }">
                    <router-link to="/detainee-origin" class="uk-height-1-1">Origin of Detainees</router-link>
                </li>
                <li :class="{ 'uk-active': active==='detention-centres', 'uk-padding-small': true }">
                    <router-link to="/detention-centres" class="uk-height-1-1">Detention Centres</router-link>
                </li>
                <li :class="{ 'uk-active': active==='people-in-detention', 'uk-padding-small': true }">
                    <router-link to="/people-in-detention" class="uk-height-1-1">
                        Active Detentions Each Quarter
                    </router-link>
                </li>
                <li :class="{ 'uk-active': active==='detention-lengths', 'uk-padding-small': true }">
                    <router-link to="/detention-lengths" class="uk-height-1-1">
                        Longest Detention Lengths
                    </router-link>
                </li>
                <li :class="{ 'uk-active': active==='leaving-detention', 'uk-padding-small': true }">
                    <router-link to="/leaving-detention" class="uk-height-1-1">
                        People Leaving Detention
                    </router-link>
                </li>
                <!-- References -->
                <li :class="{ 'uk-active': active==='references', 'uk-padding-small': true }">
                    <router-link to="/references" class="uk-height-1-1">References</router-link>
                </li>
            </ul>
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

<style lang="scss" scoped>
    @import '../assets/scss/variables';
    .component-navigation {
        &, nav {
            width: 210px;
        }
        nav {
            height: 100%;
            min-height: 100vh;
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
    }
</style>
