<!--
 * DetaineeOriginController
-->
<template>
    <div class="component-analysis-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading message="Loading Data..." v-if="loading" />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                Origin of UK Immigration Detainees <span class="uk-text-muted">{{year==='total'?'All Available Years':year}}</span>
            </h3>
            <map-chart class="map uk-height-large"
                       v-if="series"
                       :series-data="series"
                       :active-series="year"
                       :custom-template="customTemplate" />
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
                                    <input v-model="shading" class="uk-radio" type="radio" name="shading" value="total">
                                    Total
                                </label>
                                <label>
                                    <input v-model="shading" class="uk-radio" type="radio" name="shading" value="adults">
                                    Adults
                                </label>
                                <label>
                                    <input v-model="shading" class="uk-radio" type="radio" name="shading" value="children">
                                    Children
                                </label>
                                <label>
                                    <input v-model="shading" class="uk-radio" type="radio" name="shading" value="male">
                                    Male
                                </label>
                                <label>
                                    <input v-model="shading" class="uk-radio" type="radio" name="shading" value="female">
                                    Female
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Map from './Map';
import * as am4core from '@amcharts/amcharts4/core';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'DetaineeOriginController',
    components: { 'loading': LoadingCover, 'map-chart': Map },
    data() {
        return {
            loading: true,
            year: 2018,
            shading: 'total',
            availableYears: [],
            series: null,
            customTemplate: {
                propertyFields: { fill: 'totalShading' },
                tooltipText: `[bold]{name}[/]
                    {total} Detainees
                    -------
                    {adults} Adults
                    {children} Children
                    {male} Men
                    {female} Women`,
                pointerOrientation: 'vertical',
            },
        };
    },
    watch: {
        shading(val) {
            this.$set(
                this,
                'customTemplate',
                Object.assign({}, this.customTemplate, { propertyFields: { fill: val+'Shading' } })
            );
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
        }
    }
</style>


