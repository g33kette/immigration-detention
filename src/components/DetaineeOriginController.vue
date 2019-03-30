<!--
 * DetaineeOriginController
-->
<template>
    <div class="component-detainee-origin-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                Origin of UK Immigration Detainees
                <span class="uk-text-muted">{{ year==='total'?'All Available Years':year }}</span>
            </h3>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <map-chart v-if="series"
                           class="map uk-height-large"
                           :series-data="series"
                           :active-series="year"
                           :custom-template="customTemplate"
                           @updated="mapUpdated" />
            </div>
            <div class="legend uk-align-right uk-text-small">
                <div class="legend-gradient" />
                <span class="uk-align-left">Low {{ lowValue }}</span>
                <span class="uk-align-right">High  {{ highValue }}</span>
            </div>
            <form class="uk-form-horizontal uk-margin-large-top" @submit.prevent>
                <div uk-grid>
                    <div class=" uk-width-1-3">
                        <div class="uk-margin">
                            <label class="uk-form-label" for="year">Change Year:</label>
                            <div class="uk-form-controls">
                                <select id="year" v-model="year" class="uk-select">
                                    <option v-for="y in availableYears" :key="y" :value="y">
                                        {{ y==='total'?'All Available':y }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class=" uk-width-2-3">
                        <div class="uk-margin">
                            <label class="uk-form-label" for="year">Shading:</label>
                            <div class="uk-radio-controls uk-grid-small uk-child-width-auto uk-grid">
                                <label>
                                    <input v-model="shading"
                                           class="uk-radio"
                                           type="radio"
                                           name="shading"
                                           value="total">
                                    Total
                                </label>
                                <label>
                                    <input v-model="shading"
                                           class="uk-radio"
                                           type="radio"
                                           name="shading"
                                           value="adults">
                                    Adults
                                </label>
                                <label>
                                    <input v-model="shading"
                                           class="uk-radio"
                                           type="radio"
                                           name="shading"
                                           value="children">
                                    Children
                                </label>
                                <label>
                                    <input v-model="shading"
                                           class="uk-radio"
                                           type="radio"
                                           name="shading"
                                           value="male">
                                    Male
                                </label>
                                <label>
                                    <input v-model="shading"
                                           class="uk-radio"
                                           type="radio"
                                           name="shading"
                                           value="female">
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="uk-margin">
                <citation tag="detention-stats" class="uk-align-right" />
            </div>
        </div>
    </div>
</template>

<script>
import Map from './Map';
import Citation from './Citation';
import * as am4core from '@amcharts/amcharts4/core';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'DetaineeOriginController',
    components: { 'loading': LoadingCover, 'map-chart': Map, 'citation': Citation },
    data() {
        return {
            loading: true,
            rendering: true,
            year: 2018,
            shading: 'total',
            availableYears: [],
            series: null,
            extremes: {},
            totalExtremes: {},
        };
    },
    computed: {
        customTemplate() {
            return {
                propertyFields: { fill: this.shading+'Shading' },
                tooltipText: `[bold]{name}[/]
                    {total} Detainees
                    -------
                    {adults} Adults
                    {children} Children
                    {male} Men
                    {female} Women`,
                pointerOrientation: 'vertical',
            };
        },
        lowValue() {
            return 0;
        },
        highValue() {
            const extremes = this.year === 'total'?this.totalExtremes:this.extremes;
            let key;
            switch (this.shading) {
            case 'total':
                key = 'maxTotal';
                break;
            case 'adults':
                key = 'maxAdults';
                break;
            case 'children':
                key = 'maxChildren';
                break;
            case 'male':
                key = 'maxMale';
                break;
            case 'female':
                key = 'maxFemale';
                break;
            }
            return extremes[key];
        },
    },
    watch: {
        shading() {
            this.rendering = true;
        },
        year() {
            this.rendering = true;
        },
    },
    mounted() {
        this.loadSeriesData();
    },
    methods: {
        callLoadData() {
            return axios.get('/data/detainee-origins.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.extremes = responseData.extremes;
            this.totalExtremes = responseData.totalExtremes;
            const series = {};
            this.availableYears = [];
            for (const year in responseData.data) {
                if (responseData.data.hasOwnProperty(year)) {
                    this.availableYears.push(year);
                    const responseYearData = responseData.data[year];
                    const data = [];
                    for (const k in responseYearData) {
                        if (responseYearData.hasOwnProperty(k)) {
                            const item = responseYearData[k];
                            const extremes = year === 'total'?responseData.totalExtremes:responseData.extremes;
                            item.totalShading = this.shadingColor(extremes['maxTotal'], item.total);
                            item.adultsShading = this.shadingColor(extremes['maxAdults'], item.adults);
                            item.childrenShading = this.shadingColor(extremes['maxChildren'], item.children);
                            item.maleShading = this.shadingColor(extremes['maxMale'], item.male);
                            item.femaleShading = this.shadingColor(extremes['maxFemale'], item.female);
                            data.push(item);
                        }
                    }
                    series[year] = data;
                }
            }
            this.series = series;
            this.availableYears.sort().reverse();
            this.loading = false;
        },
        shadingColor(extreme, value) {
            const col = value === 0 ? 205 : (Math.floor(180 - ((180/extreme) * value)));
            return am4core.color('rgb(' + col + ', ' + col + ', ' + col + ')');
        },
        mapUpdated({ action }) {
            // console.log('updated', action);
            setTimeout(() => this.rendering = false, 200);
        },
    },
};
</script>

<style lang="scss" scoped>
    //@import '../assets/scss/variables';
    form {
        .uk-form-label {
            width: 80px;
        }
        .uk-form-controls {
            margin-left: 100px;
        }
        .uk-radio-controls {
            padding-top: 7px;
            label {
                cursor: pointer;
            }
        }
    }
    .legend-gradient {
        width: 200px;
        height: 15px;
        background: linear-gradient(to right, rgb(205,205,205) , black);
        border-radius: 3px;
    }
</style>


