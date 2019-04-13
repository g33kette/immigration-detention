<!--
 * LeavingDetentionController
-->
<template>
    <div class="component-leaving-detention-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                People
                Leaving
                UK Immigration Detention
                <span class="uk-text-muted">{{ show === 'resolution'?'by Resolution':showNames[show] }}</span>
            </h3>
            <div>
                <p>This chart shows the number of people leaving detention each year.</p>
                <p>
                    The <span class="uk-text-emphasis">"Hostile Environment"</span> marked on the charts began when the
                    UK Government passed Immigration Act in 2014.
                    The intention of this act was to deny illegal migrants access to public services and
                    benefits to persuade them to depart voluntarily and deter migrants from trying to settle illegally.
                    <br><citation tag="hostile-environment" />
                </p>
            </div>
            <div>
                <label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">
                    View:
                </label>
                <button v-for="(n,k) in showNames" :key="k"
                        :class="{
                            'uk-button uk-button-small uk-margin uk-margin-left': true,
                            'uk-button-default': show !== k,
                            'uk-button-secondary': show === k,
                        }"
                        @click="show=k">
                    {{ n }}
                </button>
                <p class="uk-margin-small uk-text-muted uk-text-italic">
                    Asylum detainees relate to people detained solely under Immigration Act powers who are recorded as
                    having claimed asylum at some stage, regardless of the outcome of the claim.
                </p>
            </div>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <chart v-if="seriesData"
                       class="chart uk-height-large"
                       :x-axis-settings="xAxisSettings"
                       :series="series"
                       :series-data="Object.values(seriesData)"
                       @updated="chartUpdated" />
            </div>
            <div class="uk-margin-top">
                <div>
                    <label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">
                        Display:
                    </label>
                    <button v-for="(n,k) in displayTypeOptions" :key="k"
                            :class="{
                                'uk-button uk-button-small uk-margin uk-margin-left': true,
                                'uk-button-default': displayType !== k,
                                'uk-button-secondary': displayType === k,
                                'uk-hidden': show === 'totals' && k.indexOf('-stacked') >= 0,
                            }"
                            @click="displayType=k">
                        {{ n }}
                    </button>
                </div>
                <div class="uk-margin-small">
                    <span class="uk-text-bold"><font-awesome-icon icon="question-circle" /> Using The Chart</span>
                    <ul class="uk-list-bullet uk-list">
                        <li>You can click on the legend above to show or hide data.</li>
                        <li>
                            You can zoom and pan by using the slider at the top of the chart or by highlighting a
                            section with the mouse.
                        </li>
                    </ul>
                </div>
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
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
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
                leaving_total: { name: 'Total Leaving', field: 'leaving_total' },
                // gender
                leaving_male: { name: 'Male Leaving', field: 'leaving_male' },
                leaving_female: { name: 'Female Leaving', field: 'leaving_female' },
                // resolution
                leaving_returned: { name: 'Returned from UK (Deported)', field: 'leaving_returned' },
                leaving_remained: { name: 'Granted Leave to Remain', field: 'leaving_remained' },
                leaving_bailed: { name: 'Released on Bail', field: 'leaving_bailed' },
                leaving_reason_other: { name: 'Other', field: 'leaving_reason_other' },
                // asylum
                leaving_asylum: { name: 'Leaving Requested Asylum', field: 'leaving_asylum' },
                leaving_non_asylum: { name: 'Leaving Non-Asylum', field: 'leaving_non_asylum' },
                leaving_adult_asylum: { name: 'Adult Leaving Requested Asylum', field: 'leaving_adult_asylum' },
                leaving_adult_non_asylum: { name: 'Adult Leaving Non-Asylum', field: 'leaving_adult_non_asylum' },
                leaving_child_asylum: { name: 'Child Leaving Requested Asylum', field: 'leaving_child_asylum' },
                leaving_child_non_asylum: { name: 'Child Leaving Non-Asylum', field: 'leaving_child_non_asylum' },
                // age
                leaving_child: { name: 'Children Leaving', field: 'leaving_child' },
                leaving_adult: { name: 'Adults Leaving', field: 'leaving_adult' },
            },
            showOptions: {
                totals: ['leaving_total'],
                gender: ['leaving_male', 'leaving_female'],
                age: ['leaving_adult', 'leaving_child'],
                asylum: ['leaving_asylum', 'leaving_non_asylum'],
                resolution: ['leaving_returned', 'leaving_remained', 'leaving_bailed', 'leaving_reason_other'],
            },
            show: 'totals',
            showNames: {
                totals: 'Overall Totals',
                gender: 'By Gender',
                age: 'By Age',
                asylum: 'Asylum Detainees',
                resolution: 'Leaving Resolution',
            },
            displayType: 'bar',
            displayTypeOptions: {
                'bar': 'Bar Chart',
                'bar-stacked': 'Stacked Bar Chart',
                'line': 'Line Chart',
                'line-stacked': 'Stacked Line Chart',
            },
        };
    },
    computed: {
        series() {
            const series = [];
            const showSeries = this.showOptions[this.show];
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
            const settings = {
                ranges: [
                    {
                        grid: {
                            stroke: am4core.color('#000000'),
                            strokeOpacity: 0.6,
                            strokeDasharray: '5,2',
                        },
                        axisFill: {
                            fill: am4core.color('#f18713'),
                            fillOpacity: 0.2,
                        },
                        label: {
                            text: 'Hostile Environment Enforced',
                            inside: true,
                            valign: 'top',
                        },
                    },
                ],
            };
            switch (this.displayType) {
            case 'bar':
            case 'bar-stacked':
                settings.type = 'category';
                settings.category = 'year';
                settings.ranges[0].category = 2014;
                settings.ranges[0].endCategory = 2018;
                break;
            case 'line':
            case 'line-stacked':
                settings.type = 'date';
                settings.ranges[0].label.horizontalCenter = 'left';
                settings.ranges[0].date = new Date(2014, 6, 1);
                settings.ranges[0].endDate = new Date(2018, 6, 1);
                break;
            }
            return settings;
        },
    },
    watch: {
        show() {
            this.rendering = true;
            if (this.show === 'totals') {
                this.displayType = this.displayType.replace('-stacked', '');
            }
        },
    },
    mounted() {
        this.loadSeriesData();
    },
    methods: {
        callLoadData() {
            return axios.get('./data/leaving-entering-detention.json');
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
            series.tooltipText = '{name}: [bold]{valueY}[/]';
            // series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
            series.columns.template.fillOpacity = .8;
            series.cursorTooltipEnabled = true;
            series.sequencedInterpolation = false;
            series.legendSettings.valueText = '{valueY}';
            if (this.displayType === 'bar-stacked') {
                series.stacked = true;
            }
            const columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;
            return series;
        },
        newLineSeries({ name, field }) {
            const series = new am4charts.LineSeries();
            series.name = name;
            series.dataFields.dateX = 'year';
            series.dataFields.valueY = field;
            series.tooltipText = '{name}: [bold]{valueY}[/]';
            series.sequencedInterpolation = false;
            series.legendSettings.valueText = '{valueY}';
            if (this.displayType === 'line-stacked') {
                series.fillOpacity = 0.6;
                series.stacked = true;
            }
            series.strokeWidth = 2;
            series.strokeOpacity = 1;
            return series;
        },
        chartUpdated() {
            this.rendering = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    //@import '../assets/scss/variables';
</style>


