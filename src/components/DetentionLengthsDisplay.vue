<!--
 * Detention Lengths Display Component
-->
<template>
    <div class="detention-lengths-display">
        <div v-for="day in count" :key="day"
             :class="{
                 'uk-height-1-1 uk-display-inline-block tick': true,
                 'uk-background-primary': day%365!==0,
                 'uk-background-secondary':day%365===0,
             }"
             :uk-tooltip="day%365===0?yearsText(day):null" />
        <span class="uk-text-bold uk-text-secondary uk-text-large">{{ count | numberFormat }} days</span>
        <button v-if="count<days"
                class="uk-button-small uk-button-default uk-display-block uk-pointer uk-text-muted"
                @click="count=days-1">
            Skip Animation
        </button>
    </div>
</template>

<script>
export default {
    name: 'DetentionLengthsDisplay',
    filters: {
        numberFormat: function(value) {
            if (isNaN(parseInt(value))) return value;
            return (new Intl.NumberFormat('en-GB', {})).format(value);
        },
    },
    props: {
        days: { required: true, type: Number },
    },
    data() {
        return {
            count: 1,
            clearInterval: null,
            speed: 500,
        };
    },
    watch: {
        days() {
            this.reset();
            this.tick();
        },
    },
    mounted() {
        this.tick();
    },
    methods: {
        reset() {
            this.count = 0;
            this.speed = 500;
            if (this.clearInterval) {
                clearInterval(this.clearInterval);
            }
        },
        tick() {
            this.clearInterval = setTimeout(() => {
                this.count++;
                if (this.count < this.days) {
                    this.tick();
                } else {
                    this.$emit('displayComplete');
                }
            }, 15);
        },
        yearsText(days) {
            const years = Math.floor(days/365);
            return years + (years === 1?' year':' years');
        },
    },
};
</script>

<style lang="scss" scoped>
    .detention-lengths-display {
        width: 100%;
        .tick {
            &.uk-background-secondary {
                width: 4px;
            }
            &.uk-background-primary {
                opacity: .5;
            }
            height: 20px;
            margin-right: 2px;
            margin-top: 5px;
            width: 4px;
        }
    }
</style>

