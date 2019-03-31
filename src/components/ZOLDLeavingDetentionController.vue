<!--
 * LeavingDetentionController
-->
<template>
    <div class="component-leaving-detention-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                People Leaving UK Immigration Detention
                <span class="uk-text-muted">{{ showNames[show] }}</span>
            </h3>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <chart v-if="seriesData"
                       class="chart uk-height-large"
                       :x-axis-settings="{ type: 'category', category: 'year' }"
                       :series="series"
                       :series-data="Object.values(seriesData)"
                       @updated="chartUpdated" />
            </div>
            <div class="uk-margin-top">
                <p class="uk-text-muted uk-margin-small">
                    (Note: You can click on the legend above to show or hide data)
                </p>
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
    name: 'LeavingDetentionController',
    components: { 'loading': LoadingCover, 'chart': Chart, 'citation': Citation },
    data() {
        return {
            loading: true,
            rendering: true,
            seriesData: null,
            year: 2018,
            availableSeries: {
                // totals
                total_leave: { name: 'Total Leaving', field: 'total_leave' },
                // gender
                male: { name: 'Male', field: 'male' },
                female: { name: 'Female', field: 'female' },
                // resolution
                returned: { name: 'Returned from UK', field: 'returned' },
                remained: { name: 'Granted Leave to Remain', field: 'remained' },
                bailed: { name: 'Bailed', field: 'bailed' },
                leave_other: { name: 'Other', field: 'leave_other' },
                // asylum
                asylum: { name: 'Requested Asylum', field: 'asylum' },
                non_asylum: { name: 'Non-Asylum', field: 'non_asylum' },
                adult_asylum: { name: 'Adult Requested Asylum', field: 'adult_asylum' },
                adult_non_asylum: { name: 'Adult Non-Asylum', field: 'adult_non_asylum' },
                child_asylum: { name: 'Child Requested Asylum', field: 'child_asylum' },
                child_non_asylum: { name: 'Child Non-Asylum', field: 'child_non_asylum' },
                // age
                child: { name: 'Children', field: 'child' },
                adult: { name: 'Adults', field: 'adult' },
            },
            showOptions: {
                totals: ['total_leave'],
                gender: ['male', 'female'],
                age: ['adult', 'child'],
                asylum: ['asylum', 'non_asylum'],
                resolution: ['returned', 'remained', 'bailed', 'leave_other'],
            },
            show: 'totals',
            showNames: {
                totals: 'Overall Totals',
                gender: 'By Gender',
                age: 'By Age',
                asylum: 'by Asylum Request',
                resolution: 'by Resolution',
            },
        };
    },
    computed: {
        series() {
            const series = [];
            for (const addSeries of this.showOptions[this.show]) {
                series.push(this.newBarSeries(this.availableSeries[addSeries]));
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
            return axios.get('/data/leaving-detention.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.seriesData = responseData.by_year;
            this.loading = false;
        },
        newBarSeries({ name, field }) {
            // const series = new am4charts.ColumnSeries();
            // return name;
            const series = new am4charts.ColumnSeries();
            series.dataFields.valueY = field;
            series.dataFields.categoryX = 'year';
            series.name = name;
            series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
            series.columns.template.fillOpacity = .8;
            series.cursorTooltipEnabled = false;
            const columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;
            return series;
        },
        chartUpdated({ action }) {
            // console.log('updated', action);
            this.rendering = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    //@import '../assets/scss/variables';
</style>


