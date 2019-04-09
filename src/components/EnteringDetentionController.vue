<!--
 * EnteringDetentionController
-->
<template>
    <div class="component-entering-detention-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                People Entering UK Immigration Detention
                <span class="uk-text-muted">{{ showNames[show] }}</span>
            </h3>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <chart v-if="seriesData"
                       class="chart uk-height-large"
                       :x-axis-settings="xAxisSettings"
                       :series="series"
                       :series-data="Object.values(seriesData)"
                       :colors="colors"
                       @updated="chartUpdated" />
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
                            :class="{
                                'uk-button uk-button-small uk-margin uk-margin-left': true,
                                'uk-button-default': displayType !== k,
                                'uk-button-secondary': displayType === k,
                            }"
                            @click="displayType=k">
                        {{ n }}
                    </button>
                </div>
                <div>
                    <label class="uk-form-label uk-text-secondary uk-text-bold uk-margin uk-margin-remove-top">
                        Choose View:
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
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'EnteringDetentionController',
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
                // gender
                entering_male: { name: 'Male Entering', field: 'entering_male' },
                entering_female: { name: 'Female Entering', field: 'entering_female' },
                // asylum
                entering_asylum: { name: 'Entering Requested Asylum', field: 'entering_asylum' },
                entering_non_asylum: { name: 'Entering Non-Asylum', field: 'entering_non_asylum' },
                entering_adult_asylum: { name: 'Adult Entering Requested Asylum', field: 'entering_adult_asylum' },
                entering_adult_non_asylum: { name: 'Adult Entering Non-Asylum', field: 'entering_adult_non_asylum' },
                entering_child_asylum: { name: 'Child Entering Requested Asylum', field: 'entering_child_asylum' },
                entering_child_non_asylum: { name: 'Child Entering Non-Asylum', field: 'entering_child_non_asylum' },
                // age
                entering_child: { name: 'Children Entering', field: 'entering_child' },
                entering_adult: { name: 'Adults Entering', field: 'entering_adult' },
            },
            showOptions: {
                totals: ['entering_total'],
                gender: ['entering_male', 'entering_female'],
                age: ['entering_adult', 'entering_child'],
                asylum: ['entering_asylum', 'entering_non_asylum'],
            },
            show: 'totals',
            showNames: {
                totals: 'Overall Totals',
                gender: 'By Gender',
                age: 'By Age',
                asylum: 'by Asylum Request',
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
            switch (this.displayType) {
            case 'bar':
            case 'bar-stacked':
                return { type: 'category', category: 'year' };
            case 'line':
            case 'line-stacked':
                return { type: 'date' };
            }
            return null;
        },
        // colors() {
        //     return [
        //         am4core.color('#f18713'),
        //         am4core.color('#ffc35c'),
        //         am4core.color('#f89c2f'),
        //         am4core.color('#e7b978'),
        //     ];
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
            return axios.get('/data/leaving-entering-detention.json');
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


