<!--
 * IndexController
 *
 * Index/home page
-->
<template>
    <div class="component-index-controller">
        <div uk-grid>
            <div class="uk-width-2-3">
                <div class="detainees uk-card uk-card-default uk-padding uk-text-center uk-text-bottom">
                    <h3 class="uk-heading-divider uk-h3">
                        People Detained Under UK Immigration Law <span class="uk-text-muted">Throughout 2018</span>
                    </h3>
                    <div uk-grid>
                        <div class="uk-width-1-3 uk-inline">
                            <div class="">
                                <font-awesome-icon icon="male" size="10x" />
                                <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large">
                                    <span class="uk-text-secondary uk-text-bold">{{ men | numberFormat }}</span> Men
                                </p>
                            </div>
                        </div>
                        <div class="uk-width-1-3 uk-inline">
                            <div class="uk-position-bottom">
                                <font-awesome-icon icon="female" size="8x" />
                                <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large">
                                    <span class="uk-text-secondary uk-text-bold">{{ women | numberFormat }}</span> Women
                                </p>
                            </div>
                        </div>
                        <div class="uk-width-1-3 uk-inline">
                            <div class="uk-position-bottom">
                                <font-awesome-icon icon="child" size="5x" />
                                <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large">
                                    <span class="uk-text-secondary uk-text-bold">
                                        {{ children | numberFormat }}
                                    </span>
                                    Children
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="uk-text-left">
                        <router-link class="uk-button uk-button-default" to="/detainee-origin">
                            Learn More About Detainees &gt;
                        </router-link>
                        <citation tag="detention-stats" class="uk-align-right" />
                    </div>
                </div>
            </div>
            <div class="uk-width-1-3">
                <p class="uk-h2">
                    Immigration Detention:
                    <br>
                    <span class="uk-text-muted">
                        Home Office practice of detaining asylum seekers and others to pursue immigration-related
                        purposes.<br>
                        <span class="uk-light">It is an administrative process rather than a criminal procedure.</span>
                    </span><br>
                    <citation tag="migration-observatory-1" />
                </p>
            </div>
            <div class="uk-width-1-1">
                <div :class="{
                    'more-links uk-section uk-section-secondary uk-section-small uk-padding-small': true,
                    'uk-text-large uk-preserve-color': true,
                }">
                    <div uk-grid>
                        <div class="uk-width-1-3">
                            <h3 class="uk-heading-bullet uk-text-emphasis">
                                Under UK Immigration Law you can be detained without charge and
                                <span class="uk-light">without limit</span>.
                            </h3>
                            <p>
                                At the end of 2018, the longest detention stay was
                                <span class="uk-light">1,280</span> days.
                            </p>
                            <router-link to="/detention-lengths" class="uk-button uk-button-default">
                                Show more &gt;
                            </router-link>
                        </div>
                        <div class="uk-width-1-3">
                            <map-chart :series-data="{0: euMapData}"
                                       :active-series="0"
                                       :custom-template="euMapTemplate"
                                       :eu="true"
                                       :show-export-controls="false"
                                       :show-zoom-controls="false"
                                       :show-background="false"
                                       class="uk-height-medium" />
                        </div>

                        <div class="uk-width-1-3">
                            <p class="uk-light">
                                The UK is one of only 3 countries in the EU that has not agreed to limit the length of
                                detention for immigration purposes.
                            </p>
                            <citation tag="eu-directive" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Citation from './Citation';
import Map from './Map';
import { mapGetters } from 'vuex';
import * as am4core from '@amcharts/amcharts4/core';
export default {
    name: 'IndexController',
    components: { Citation, 'map-chart': Map },
    filters: {
        numberFormat: function(value) {
            if (isNaN(parseInt(value))) return value;
            return (new Intl.NumberFormat('en-GB', {})).format(value);
        },
    },
    data() {
        return {
            men: 21107,
            women: 3641,
            children: 63,
            euMapData: [
                { id: 'GB', name: 'United Kingdom', color: am4core.color('#F8312C') },
                { id: 'IE', name: 'Ireland', color: am4core.color('#F8312C') },
                { id: 'DK', name: 'Denmark', color: am4core.color('#F8312C') },
            ],
            euMapTemplate: {
                propertyFields: { fill: 'color' },
                tooltipText: `[bold]{name}[/]`,
                pointerOrientation: 'vertical',
            },
        };
    },
    computed: {
        ...mapGetters([
            'referenceId',
        ]),
    },
};
</script>

<style lang="scss" scoped>
    .more-links {
        .uk-button {
            text-transform: none;
            font-size: .8em;
        }
    }
    .uk-light {
        color: #fff;
    }
</style>

