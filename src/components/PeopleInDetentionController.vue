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
                <p class="uk-text-muted uk-margin-small">
                    (Note: You can click on the legend above to show or hide data)
                </p>
                <div>
                    <label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">
                        Chart Type:
                    </label>
                    <button v-for="(n,k) in displayTypeOptions" :key="k"
                            @click="displayType=k"
                            :class="{
                                'uk-button uk-button-small uk-margin uk-margin-left': true,
                                'uk-button-default': displayType !== k,
                                'uk-button-secondary': displayType === k,
                            }">
                        {{ n }}
                    </button>
                </div>
                <div>
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
            centresData: null,
            year: 2018,
            staticAvailableSeries: {
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
            show: 'total',
            showNames: {
                total: 'Overall Total',
                gender: 'By Gender',
                age: 'By Age',
                asylum: 'By Asylum Request',
                centre: 'By Detention Centre',
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
        showOptions() {
            return {
                total: ['total_detainees'],
                gender: ['male', 'female'],
                age: ['total_adult_detainees', 'total_child_detainees'],
                asylum: ['total_asylum_detainees', 'total_non_asylum_detainees'],
                centre: this.allDetentionCentreSeries,
            };
        },
        availableSeries() {
            return {
                ...this.staticAvailableSeries,
                ...this.availableDetentionCentreSeries,
            };
        },
        availableDetentionCentreSeries() {
            if (!this.centresData) {
                return {};
            }
            const colors = {
                irc: { c: '#ff9603', l: 0 },
                sthf: { c: '#1c1c1c', l: 0 },
                pda: { c: '#8a8a8a', l: 0 },
            };
            const availableSeries = [];
            for (const centre of this.centresData) {
                availableSeries[centre.heading] = {
                    name: centre.title,
                    field: centre.heading,
                    color: am4core.color(colors[centre.type].c).lighten(colors[centre.type].l),
                };
                colors[centre.type].l = colors[centre.type].l + .05;
            }
            return availableSeries;
        },
        allDetentionCentreSeries() {
            return Object.keys(this.availableDetentionCentreSeries);
        },
        xAxisSettings() {
            return { type: 'date', dateFormat: 'YYYY-MM', baseInterval: { timeUnit: 'month', count: 3 } };
        },
    },
    watch: {
        show() {
            this.rendering = true;
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
            this.centresData = responseData.centres;
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
            if (show==='centre') {
                series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
                series.cursorTooltipEnabled = false;
            } else {
                series.tooltipText = '{name}: [bold]{valueY}[/]';
                series.cursorTooltipEnabled = true;
            }
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


