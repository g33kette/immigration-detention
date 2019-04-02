<!--
 * PeopleInDetentionController
-->
<template>
    <div class="component-people-in-detention-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                UK Immigration Detentions
                <span class="uk-text-muted">{{ show === 'resolution'?'by Resolution':showNames[show] }}</span>
            </h3>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <chart v-if="seriesData"
                       class="chart uk-height-large"
                       :x-axis-settings="xAxisSettings"
                       :series="series"
                       :series-data="Object.values(seriesData)"
                       xcolors="colors"
                       @updated="chartUpdated" />
            </div>
            <div class="uk-margin-top">
                <p class="uk-text-muted uk-margin-small">
                    (Note: You can click on the legend above to show or hide data)
                </p>
                <!--<div>-->
                    <!--<label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">-->
                        <!--Chart Type:-->
                    <!--</label>-->
                    <!--<button v-for="(n,k) in displayTypeOptions" :key="k"-->
                            <!--@click="displayType=k"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': displayType !== k,-->
                                <!--'uk-button-secondary': displayType === k,-->
                            <!--}">-->
                        <!--{{ n }}-->
                    <!--</button>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">-->
                        <!--Choose View:-->
                    <!--</label>-->
                    <!--<button v-for="(n,k) in showNames" :key="k"-->
                            <!--@click="show=k"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': show !== k,-->
                                <!--'uk-button-secondary': show === k,-->
                            <!--}"-->
                            <!--:disabled="k === 'resolution' && showOnly === 'entering'"-->
                            <!--:uk-tooltip="k === 'resolution' && showOnly === 'entering'?'This option is not available for your current selection.':false">-->
                        <!--{{ n }}-->
                    <!--</button>-->
                <!--</div>-->
                <!--<div>-->
                    <!--<label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">-->
                        <!--Show:-->
                    <!--</label>-->
                    <!--<button @click="showOnly=null"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': showOnly !== null,-->
                                <!--'uk-button-secondary': showOnly === null,-->
                            <!--}">-->
                        <!--All-->
                    <!--</button>-->
                    <!--<button @click="showOnly='entering'"-->
                            <!--:disabled="show === 'resolution'"-->
                            <!--:uk-tooltip="show === 'resolution'?'This option is not available for your current selection.':false"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': showOnly !== 'entering',-->
                                <!--'uk-button-secondary': showOnly === 'entering',-->
                            <!--}">-->
                        <!--Entering Only-->
                    <!--</button>-->
                    <!--<button @click="showOnly='leaving'"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': showOnly !== 'leaving',-->
                                <!--'uk-button-secondary': showOnly === 'leaving',-->
                            <!--}">-->
                        <!--Leaving Only-->
                    <!--</button>-->
                    <!--<label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">-->
                        <!--Display leaving as negative?:-->
                    <!--</label>-->
                    <!--<button @click="negateLeaveValues=false"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': negateLeaveValues !== false,-->
                                <!--'uk-button-secondary': negateLeaveValues === false,-->
                            <!--}">-->
                        <!--No-->
                    <!--</button>-->
                    <!--<button @click="negateLeaveValues=true"-->
                            <!--:class="{-->
                                <!--'uk-button uk-button-small uk-margin uk-margin-left': true,-->
                                <!--'uk-button-default': negateLeaveValues !== true,-->
                                <!--'uk-button-secondary': negateLeaveValues === true,-->
                            <!--}">-->
                        <!--Yes-->
                    <!--</button>-->
                <!--</div>-->
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
    name: 'PeopleInDetentionController',
    components: { 'loading': LoadingCover, 'chart': Chart, 'citation': Citation },
    data() {
        return {
            loading: true,
            rendering: true,
            seriesData: null,
            year: 2018,
            availableSeries: {
                // totals
                entering_total: { name: 'Total Entering', field: 'entering_total' },
                leaving_total: { name: 'Total Leaving', field: 'leaving_total' },
                // // gender
                // entering_male: { name: 'Male Entering', field: 'entering_male' },
                // entering_female: { name: 'Female Entering', field: 'entering_female' },
                // leaving_male: { name: 'Male Leaving', field: 'leaving_male' },
                // leaving_female: { name: 'Female Leaving', field: 'leaving_female' },
                // // resolution
                // leaving_returned: { name: 'Returned from UK', field: 'leaving_returned' },
                // leaving_remained: { name: 'Granted Leave to Remain', field: 'leaving_remained' },
                // leaving_bailed: { name: 'Bailed', field: 'leaving_bailed' },
                // leaving_reason_other: { name: 'Other', field: 'leaving_reason_other' },
                // // asylum
                // entering_asylum: { name: 'Entering Requested Asylum', field: 'entering_asylum' },
                // entering_non_asylum: { name: 'Entering Non-Asylum', field: 'entering_non_asylum' },
                // entering_adult_asylum: { name: 'Adult Entering Requested Asylum', field: 'entering_adult_asylum' },
                // entering_adult_non_asylum: { name: 'Adult Entering Non-Asylum', field: 'entering_adult_non_asylum' },
                // entering_child_asylum: { name: 'Child Entering Requested Asylum', field: 'entering_child_asylum' },
                // entering_child_non_asylum: { name: 'Child Entering Non-Asylum', field: 'entering_child_non_asylum' },
                // leaving_asylum: { name: 'Leaving Requested Asylum', field: 'leaving_asylum' },
                // leaving_non_asylum: { name: 'Leaving Non-Asylum', field: 'leaving_non_asylum' },
                // leaving_adult_asylum: { name: 'Adult Leaving Requested Asylum', field: 'leaving_adult_asylum' },
                // leaving_adult_non_asylum: { name: 'Adult Leaving Non-Asylum', field: 'leaving_adult_non_asylum' },
                // leaving_child_asylum: { name: 'Child Leaving Requested Asylum', field: 'leaving_child_asylum' },
                // leaving_child_non_asylum: { name: 'Child Leaving Non-Asylum', field: 'leaving_child_non_asylum' },
                // // age
                // entering_child: { name: 'Children Entering', field: 'entering_child' },
                // entering_adult: { name: 'Adults Entering', field: 'entering_adult' },
                // leaving_child: { name: 'Children Leaving', field: 'leaving_child' },
                // leaving_adult: { name: 'Adults Leaving', field: 'leaving_adult' },
            },
            showOptions: {
                totals: ['entering_total', 'leaving_total'],
                // gender: ['entering_male', 'leaving_male', 'entering_female', 'leaving_female'],
                // age: ['entering_adult', 'leaving_adult', 'entering_child', 'leaving_child'],
                // asylum: ['entering_asylum', 'leaving_asylum', 'entering_non_asylum', 'leaving_non_asylum'],
                // resolution: ['leaving_returned', 'leaving_remained', 'leaving_bailed', 'leaving_reason_other'],
            },
            show: 'totals',
            showNames: {
                // totals: 'Overall Totals',
                // gender: 'By Gender',
                // age: 'By Age',
                // asylum: 'by Asylum Request',
                // resolution: 'Leaving Resolution',
            },
            displayType: 'bar',
            displayTypeOptions: {
                // 'bar': 'Bar Chart',
                // 'bar-stacked': 'Stacked Bar Chart',
                // 'line': 'Line Chart',
                // 'line-stacked': 'Stacked Line Chart',
            },
            // negateLeaveValues: false,
            // showOnly: null,
        };
    },
    computed: {
        series() {
            const series = [];
            const showSeries = this.showOptions[this.show]
                .filter((v) => !this.showOnly || v.indexOf(this.showOnly) >= 0);
            for (const addSeries of showSeries) {
                switch (this.displayType) {
                case 'bar':
                case 'bar-stacked':
                    series.push(this.newBarSeries(this.availableSeries[addSeries]));
                    break;
                case 'line':
                case 'line-stacked':
                    series.push(this.newLineSeries(this.availableSeries[addSeries]));
                    break;
                }
            }
            return series;
        },
        xAxisSettings() {
            switch (this.displayType) {
            case 'bar':
            case 'bar-stacked':
                return { type: 'category', category: 'year' };
            case 'line':
            case 'line-stacked':
                return { type: 'date', dateFormat: 'YYYY-MM' };
            }
            return null;
        },
        // colors() {
        //     if (this.show === 'resolution' || this.showOnly === 'leaving') {
        //         return [
        //             am4core.color('#1c1c1c'),
        //             am4core.color('#606060'),
        //             am4core.color('#383838'),
        //             am4core.color('#7b7b7b'),
        //         ];
        //     } else if (this.showOnly === 'entering') {
        //         return [
        //             am4core.color('#f18713'),
        //             am4core.color('#ffc35c'),
        //             am4core.color('#f89c2f'),
        //             am4core.color('#e7b978'),
        //         ];
        //     }
        //     return undefined;
        // },
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
            return axios.get('/data/people-in-detention.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.seriesData = responseData.data;
            this.loading = false;
        },
        newBarSeries({ name, field }) {
            const series = new am4charts.ColumnSeries();
            series.dataFields.valueY = field;
            series.dataFields.categoryX = 'year';
            series.name = name;
            series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
            series.columns.template.fillOpacity = .8;
            series.cursorTooltipEnabled = false;
            series.sequencedInterpolation = true;
            if (this.displayType === 'bar-stacked') {
                series.stacked = true;
            }
            const columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;
            return series;
        },
        newLineSeries({ name, field }) {
            const lineSeries = new am4charts.LineSeries();
            lineSeries.name = name;
            lineSeries.dataFields.dateX = 'year';
            lineSeries.dataFields.valueY = field;
            lineSeries.tooltipText = '{name}: [bold]{valueY}[/]';
            lineSeries.sequencedInterpolation = true;
            if (this.displayType === 'line-stacked') {
                lineSeries.fillOpacity = 0.6;
                lineSeries.stacked = true;
            }
            lineSeries.strokeWidth = 2;
            lineSeries.strokeOpacity = 1;
            return lineSeries;
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


