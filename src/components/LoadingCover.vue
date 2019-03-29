<!--
 * Loading Cover Component
-->
<template>
    <div class="loading-cover-component uk-position-z-index uk-position-top-left uk-height-1-1 uk-width-1-1">
        <div :class="{
            'cover uk-background-cover uk-height-1-1 uk-width-1-1': true,
            'uk-background-secondary': displayStyle === 'dark',
            'uk-background-default': displayStyle === 'light',
        }" />
        <div class="uk-position-center uk-text-center uk-position-z-index">
            <font-awesome-icon icon="circle-notch" class="uk-text-primary" size="2x" spin />
            <p v-if="message" :class="{ 'uk-text-large': true, 'uk-light': displayStyle === 'dark' }">{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingCover',
    props: {
        message: { type: String, default: null },
        displayStyle: { type: String, default: 'light' }, // or 'dark'
    },
};
</script>

<style lang="scss">
    .cover {
        opacity: .9;
    }
</style>

