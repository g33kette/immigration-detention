<!--
 * PeopleInDetentionController
-->
<template>
    <div class="component-people-in-detention-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                People In UK Immigration Detention
                <span class="uk-text-muted">{{ showNames[show] }}</span>
            </h3>
            <div>
                <p>This chart shows the number of people in detention at the end of each quarter.</p>
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
                <loading v-show="rendering&&!loading" :opacity="0.5" />
                <chart v-if="seriesData&&series.length"
                       class="chart uk-height-large"
                       :x-axis-settings="xAxisSettings"
                       :series="series"
                       :series-data="Object.values(seriesData)"
                       @rendered="chartUpdated" />
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
            series: [],
            year: 'total',
            availableSeries: {
                // totals
                total_detainees: { name: 'Total Detainees', field: 'total_detainees' },
                // gender
                male: { name: 'Male', field: 'male' },
                female: { name: 'Female', field: 'female' },
                // // asylum
                total_asylum_detainees: { name: 'Total Asylum Detainees', field: 'total_asylum_detainees' },
                total_non_asylum_detainees: { name: 'Total Non-Asylum Detainees', field: 'total_non_asylum_detainees' },
                adult_asylum_detainees: { name: 'Adult Asylum Detainees', field: 'adult_asylum_detainees' },
                adult_non_asylum_detainees: { name: 'Adult Non-Asylum Detainees', field: 'adult_non_asylum_detainees' },
                child_asylum_detainees: { name: 'Child Asylum Detainees', field: 'child_asylum_detainees' },
                child_non_asylum_detainees: { name: 'Child Non-Asylum Detainees', field: 'child_non_asylum_detainees' },
                // age
                total_adult_detainees: { name: 'Adults', field: 'total_adult_detainees' },
                total_child_detainees: { name: 'Children', field: 'total_child_detainees' },
            },
            show: 'totals',
            showNames: {
                totals: 'Overall Total',
                gender: 'By Gender',
                age: 'By Age',
                asylum: 'Asylum Detainees',
            },
            displayType: 'line',
            displayTypeOptions: {
                'bar': 'Bar Chart',
                'bar-stacked': 'Stacked Bar Chart',
                'line': 'Line Chart',
                'line-stacked': 'Stacked Line Chart',
            },
        };
    },
    computed: {
        showOptions() {
            return {
                totals: ['total_detainees'],
                gender: ['male', 'female'],
                age: ['total_adult_detainees', 'total_child_detainees'],
                asylum: ['total_asylum_detainees', 'total_non_asylum_detainees'],
            };
        },
        xAxisSettings() {
            return {
                type: 'date',
                dateFormat: 'YYYY-MM',
                baseInterval: { timeUnit: 'month', count: 3 },
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
                            horizontalCenter: 'left',
                        },
                        date: new Date(2014, 1, 1),
                        endDate: new Date(2019, 1, 1),
                    },
                ],
            };
        },
    },
    watch: {
        show() {
            this.rendering = true;
            if (this.show === 'totals') {
                this.displayType = this.displayType.replace('-stacked', '');
            }
            setTimeout(() => this.updateSeries(), 50);
        },
        displayType() {
            this.rendering = true;
            setTimeout(() => this.updateSeries(), 50);
        },
    },
    mounted() {
        this.loadSeriesData().then(() => this.updateSeries());
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
        updateSeries() {
            const series = [];
            const showSeries = this.showOptions[this.show];
            for (const addSeries of showSeries) {
                switch (this.displayType) {
                case 'bar':
                case 'bar-stacked':
                    series.push(this.newBarSeries(this.availableSeries[addSeries], this.displayType, this.show));
                    break;
                case 'line':
                case 'line-stacked':
                    series.push(this.newLineSeries(this.availableSeries[addSeries], this.displayType, this.show));
                    break;
                }
            }
            this.$set(this, 'series', series);
        },
        newBarSeries({ name, field, color }, displayType, show) {
            const series = new am4charts.ColumnSeries();
            series.dataFields.valueY = field;
            series.dataFields.dateX = 'date';
            series.name = name;
            series.tooltipText = '{name}: [bold]{valueY}[/]';
            series.cursorTooltipEnabled = true;
            series.columns.template.fillOpacity = .8;
            series.legendSettings.valueText = '{valueY}';
            series.sequencedInterpolation = false;
            if (displayType === 'bar-stacked') {
                series.stacked = true;
            }
            const columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;
            if (color) {
                series.columns.template.stroke = am4core.color(color);
                series.columns.template.fill = am4core.color(color);
            }
            return series;
        },
        newLineSeries({ name, field, color }, displayType, show) {
            const series = new am4charts.LineSeries();
            series.name = name;
            series.dataFields.dateX = 'date';
            series.dataFields.valueY = field;
            series.tooltipText = '{name}: [bold]{valueY}[/]';
            series.legendSettings.valueText = '{valueY}';
            series.sequencedInterpolation = false;
            series.cursorTooltipEnabled = true;
            if (displayType === 'line-stacked') {
                series.fillOpacity = 0.6;
                series.stacked = true;
                if (color) {
                    series.fill = am4core.color(color);
                }
            }
            series.strokeWidth = 2;
            series.strokeOpacity = 1;
            if (color) {
                series.stroke = am4core.color(color);
            }
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


