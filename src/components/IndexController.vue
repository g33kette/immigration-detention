<!--
 * IndexController
 *
 * Index/home page
-->
<template>
    <div class="component-index-controller">
        <div class=" uk-margin-large-bottom uk-height-1-1">
            <!-- Did you know? -->
            <div class="uk-width-1-1 welcome">
                <div class="uk-card uk-width-1-2 uk-height-1-1 uk-align-center">
                    <h1 class="uk-heading-hero uk-light uk-position-center">
                        Did you know, every year the UK detains thousands of people
                        <span class="uk-text-emphasis-primary">without charge</span>?
                    </h1>
                    <a class="uk-button uk-button-primary uk-position-bottom-center uk-margin-large-bottom"
                       href="#more"
                       uk-scroll>
                        <font-awesome-icon icon="chevron-down" />
                    </a>
                </div>
            </div>
            <!-- Immigration Detention Definition -->
            <div id="more" class="uk-section uk-section-secondary uk-preserve-color uk-margin-large-top">
                <div class="uk-container">
                    <div class="uk-padding uk-padding-remove-vertical">
                        <p class="uk-h2">
                            Immigration Detention:
                            <br>
                            <span class="uk-text-muted">
                                The practice of detaining asylum seekers and others to pursue
                                immigration-related purposes.<br>
                                <span class="uk-light">
                                    It is an administrative process rather than a criminal procedure.
                                </span>
                            </span><br>
                            <citation tag="migration-observatory-1" />
                        </p>
                    </div>
                </div>
            </div>
            <!-- Detainees -->
            <div class="uk-section uk-section-small uk-section-default uk-preserve-color uk-margin-large-top">
                <div class="uk-container">
                    <div class="uk-padding uk-padding-remove-vertical">
                        <h3 class="uk-heading-divider uk-h3 uk-heading-bullet">
                            Detainees in the UK include men, women and children.
                        </h3>
                        <div uk-grid>
                            <div class="uk-width-1-3 uk-inline">
                                <div class="">
                                    <font-awesome-icon icon="male" size="6x" class="uk-margin-right" />
                                    <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large uk-inline">
                                        <span class="uk-text-secondary uk-text-bold">{{ men | numberFormat }}</span>
                                        Men
                                    </p>
                                </div>
                            </div>
                            <div class="uk-width-1-3 uk-inline">
                                <div class="uk-position-bottom">
                                    <font-awesome-icon icon="female" size="5x" class="uk-margin-right" />
                                    <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large uk-inline">
                                        <span class="uk-text-secondary uk-text-bold">{{ women | numberFormat }}</span>
                                        Women
                                    </p>
                                </div>
                            </div>
                            <div class="uk-width-1-3 uk-inline">
                                <div class="uk-position-bottom">
                                    <font-awesome-icon icon="child" size="3x" class="uk-margin-right" />
                                    <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large uk-inline">
                                        <span class="uk-text-secondary uk-text-bold">
                                            {{ children | numberFormat }}
                                        </span>
                                        Children
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="uk-text-left">
                            <p class="uk-heading-divider uk-h3 uk-text-muted uk-align-left">
                                Overall, {{ men + women + children | numberFormat }} people entered immigration
                                detention in 2018.
                            </p>
                            <citation tag="detention-stats" class="uk-align-right" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- UK Is Indefinite -->
            <div class="uk-section uk-section-secondary uk-preserve-color uk-margin-large-top">
                <div class="uk-container">
                    <div :class="{
                        'more-links uk-section uk-section-secondary uk-section-small uk-padding-small': true,
                        'uk-text-large uk-preserve-color uk-padding uk-padding-remove-vertical': true,
                    }">
                        <div uk-grid>
                            <div class="uk-width-1-3">
                                <h3 class="uk-heading-bullet uk-text-emphasis">
                                    Under UK Immigration Law you can be detained
                                    <span class="uk-light">without charge</span> and
                                    <span class="uk-light">without limit</span>.
                                </h3>
                                <p>
                                    At the end of 2018, the longest immigration detention stay was up to
                                    <span class="uk-light">1,280</span> days.
                                </p>
                            </div>
                            <div class="uk-width-1-3">
                                <map-chart :series-data="{0: euMapData}"
                                           :active-series="0"
                                           :custom-template="euMapTemplate"
                                           :eu="true"
                                           :show-export-controls="false"
                                           :show-zoom-controls="false"
                                           :show-background="false"
                                           :disable-zoom="true"
                                           class="uk-height-medium" />
                            </div>
                            <div class="uk-width-1-3">
                                <p class="uk-light">
                                    The UK is one of only 3 countries in the EU that has not agreed to limit the length
                                    of detention for immigration purposes.
                                </p>
                                <citation tag="eu-directive" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- UK Is Indefinite -->
            <div class="uk-section uk-section-default uk-preserve-color uk-margin-large-top">
                <div class="uk-container">
                    <div class="uk-padding uk-padding-remove-vertical" uk-grid>
                        <div class="uk-width-1-5">
                            <img src="../assets/images/homeofficelogo.png" class="" alt="UK Home Office Logo">
                        </div>
                        <div class="uk-width-4-5">
                            <h3 class="uk-text-emphasis uk-text-large">
                                Please use this website to explore the official Home Office data.
                            </h3>
                            <p class="uk-text-medium">
                                The UK Home Office regularly release statistics relating to immigration detentions as
                                part of the immigration national statistics, you can download the raw data for 2018
                                here:<br>
                                <!-- eslint-disable-next-line -->
                                <a href="https://www.gov.uk/government/statistics/immigration-statistics-year-ending-december-2018-data-tables"
                                   title="Immigration statistics, year ending December 2018: data tables"
                                   target="_blank">
                                    <!-- eslint-disable-next-line -->
                                    https://www.gov.uk/government/statistics/immigration-statistics-year-ending-december-2018-data-tables
                                </a><br>
                            </p>
                            <p class="uk-text-medium">
                                Published immigration detention figures relate only to those
                                <span class="uk-text-bold uk-text-secondary">
                                    detained solely under Immigration Act powers,
                                </span> and exclude those detained for criminal purposes.
                            </p>
                            <p class="uk-text-right"><citation tag="detention-stats-guide" /></p>
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
    @import '../assets/scss/variables';
    .more-links {
        .uk-button {
            text-transform: none;
            font-size: .8em;
        }
    }
    .uk-light {
        .uk-text-emphasis-primary {
            color: $global-primary-background;
        }
        color: #fff;
    }
    .welcome {
        height: 80vh;
        .uk-heading-hero {
            font-size: 4rem;
            margin-top: -10vh;
        }
    }
</style>

