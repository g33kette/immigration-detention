<!--
 * AnnualTrendsController
-->
<template>
    <div class="component-annual-trends-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                UK Immigration Detention Annual Trends
                <span class="uk-text-muted">{{ showNames[show] }}</span>
            </h3>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <chart v-if="seriesData"
                       class="chart uk-height-large"
                       :series="series"
                       :series-data="Object.values(seriesData)"
                       @updated="chartUpdated"/>
            </div>
            <div class="uk-margin-top">
                <p class="uk-text-muted uk-margin-small">(Note: You can click on the legend above to show or hide data)</p>
                <label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">
                    Choose View:
                </label>
                <button v-for="(n,k) in showNames" :key="k"
                        @click="show=k"
                        :class="{
                            'uk-button uk-button-small uk-margin uk-margin-left': true,
                            'uk-button-default': show !== k,
                            'uk-button-secondary': show === k,
                        }">
                    {{ n }}
                </button>
            </div>
            <div class="uk-margin">
                <citation tag="detention-stats" class="uk-align-right" />
            </div>
        </div>
    </div>
</template>

<script>
import Chart from './Chart';
import Citation from './Citation';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'AnnualTrendsController',
    components: { 'loading': LoadingCover, 'chart': Chart, 'citation': Citation },
    data() {
        return {
            loading: true,
            rendering: true,
            seriesData: null,
            availableSeries: {
                // totals
                entering_total: { name: 'Total Entering', field: 'entering_total', negate: false },
                leaving_total: { name: 'Total Leaving', field: 'leaving_total', negate: true },
                // gender
                entering_total_m: { name: 'Entering - Male', field: 'entering_total_m', negate: false },
                leaving_total_m: { name: 'Leaving - Male', field: 'leaving_total_m', negate: true },
                entering_total_f: { name: 'Entering - Female', field: 'entering_total_f', negate: false },
                leaving_total_f: { name: 'Leaving - Female', field: 'leaving_total_f', negate: true },
                // age
                entering_adults: { name: 'Entering - Adults', field: 'entering_adults', negate: false },
                leaving_adults: { name: 'Leaving - Adults', field: 'leaving_adults', negate: true },
                entering_children: { name: 'Entering - Children', field: 'entering_children', negate: false },
                leaving_children: { name: 'Leaving - Children', field: 'leaving_children', negate: true },
                // child breakdown
                entering_5: { name: 'Entering - Under 5', field: 'entering_5', negate: false },
                leaving_5: { name: 'Leaving - Under 5', field: 'leaving_5', negate: true },
                entering_5_11: { name: 'Entering - Age 5 to 11', field: 'entering_5_11', negate: false },
                leaving_5_11: { name: 'Leaving - Age 5 to 11', field: 'leaving_5_11', negate: true },
                entering_12_16: { name: 'Entering - Age 12 to 16', field: 'entering_12_16', negate: false },
                leaving_12_16: { name: 'Leaving - Age 12 to 16', field: 'leaving_12_16', negate: true },
                entering_17: { name: 'Entering - Age 17', field: 'entering_17', negate: false },
                leaving_17: { name: 'Leaving - Age 17', field: 'leaving_17', negate: true },
            },
            showOptions: {
                totals: ['entering_total', 'leaving_total'],
                gender: ['entering_total_m', 'leaving_total_m', 'entering_total_f', 'leaving_total_f'],
                age: ['entering_adults', 'leaving_adults', 'entering_children', 'leaving_children'],
                children: [
                    'entering_5',
                    'leaving_5',
                    'entering_5_11',
                    'leaving_5_11',
                    'entering_12_16',
                    'leaving_12_16',
                    'entering_17',
                    'leaving_17',
                ],
            },
            showNames: {
                totals: 'Total Detentions',
                gender: 'By Gender',
                age: 'By Age',
                children: 'Detention of Minors',
            },
            show: 'totals',
        };
    },
    computed: {
        series() {
            const series = [];
            for (const addSeries of this.showOptions[this.show]) {
                series.push(this.newLineSeries(this.availableSeries[addSeries]));
            }
            return series;
        },
    },
    watch: {
        show() {
            this.rendering = true;
        },
    },
    mounted() {
        this.loadSeriesData();
    },
    methods: {
        callLoadData() {
            return axios.get('/data/annual-trends.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.seriesData = responseData.data;
            this.loading = false;
        },
        newLineSeries({ name, field, negate }) {
            const lineSeries = new am4charts.LineSeries();
            lineSeries.name = name;
            lineSeries.dataFields.dateX = 'year';
            lineSeries.dataFields.valueY = field;
            lineSeries.tooltipText = negate?'{valueY.value}':'{valueY.value}'; // todo negate
            lineSeries.sequencedInterpolation = true;
            lineSeries.fillOpacity = 0.6;
            lineSeries.stacked = true;
            lineSeries.strokeWidth = 2;
            return lineSeries;
        },
        chartUpdated({ action }) {
            // console.log('updated', action);
            this.rendering = false;
        },
    },
};


// // axis ranges
// const range = dateAxis.axisRanges.create();
// range.date = new Date(2010, 1, 1);
// range.endDate = new Date(2018, 1, 1);
// range.axisFill.fill = chart.colors.getIndex(7);
// range.axisFill.fillOpacity = 0.2;
//
// range.label.text = 'Fines for speeding increased';
// range.label.inside = true;
// range.label.rotation = 90;
// range.label.horizontalCenter = 'right';
// range.label.verticalCenter = 'bottom';
//
// let range2 = dateAxis.axisRanges.create();
// range2.date = new Date(2007, 1, 1);
// range2.grid.stroke = chart.colors.getIndex(7);
// range2.grid.strokeOpacity = 0.6;
// range2.grid.strokeDasharray = '5,2';
//
//
// range2.label.text = 'Motorcycle fee introduced';
// range2.label.inside = true;
// range2.label.rotation = 90;
// range2.label.horizontalCenter = 'right';
// range2.label.verticalCenter = 'bottom';
</script>

<style lang="scss" scoped>
    //@import '../assets/scss/variables';
</style>


