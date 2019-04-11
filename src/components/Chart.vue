<!--
 * Navigation
 *
 * Navigation Menu
-->
<template>
    <div ref="chartdiv" class="component-chart" />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themesAnimated);
export default {
    name: 'Chart',
    props: {
        seriesData: { required: true, type: Array },
        series: { required: true, type: Array },
        xAxisSettings: { required: true, type: Object },
        colors: { required: false, type: Array, default: () => [] },
        showExportControls: { required: false, type: Boolean, default: false },
    },
    data() {
        return {
            chart: null,
            defaultColorsList: [
                am4core.color('#f18713'),
                am4core.color('#1c1c1c'),
                am4core.color('#ffc35c'),
                am4core.color('#606060'),
                am4core.color('#f89c2f'),
                am4core.color('#383838'),
                am4core.color('#e7b978'),
                am4core.color('#7b7b7b'),
            ],
        };
    },
    computed: {
        colorsList() {
            return this.colors.length?this.colors:this.defaultColorsList;
        },
    },
    watch: {
        series() {
            this.renderChart();
        },
    },
    mounted() {
        this.renderChart();
    },
    beforeDestroy() {
        this.destroyChart();
    },
    methods: {
        destroyChart() {
            if (this.chart) {
                this.chart.dispose();
            }
        },
        renderChart() {
            this.destroyChart();
            if (this.series.length === 0) {
                // Nothing to show
                console.error('Cannot display chart, no series defined.');
                return;
            }

            const chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

            chart.colors.list = this.colorsList;

            // Set Series Data
            chart.data = this.seriesData;
            // console.log('renderChart', this.seriesData);

            let xAxis;
            switch (this.xAxisSettings.type) {
            case 'date':
                chart.dateFormatter.inputDateFormat = this.xAxisSettings.dateFormat?this.xAxisSettings.dateFormat
                    :'yyyy';
                xAxis = chart.xAxes.push(new am4charts.DateAxis());
                xAxis.renderer.minGridDistance = 60;
                xAxis.startLocation = 0.5;
                xAxis.endLocation = 0.5;
                xAxis.baseInterval = this.xAxisSettings.baseInterval?this.xAxisSettings.baseInterval
                    :{ timeUnit: 'year', count: 1 };
                break;
            case 'category':
                xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                xAxis.renderer.grid.template.location = 0;
                xAxis.renderer.minGridDistance = 30;
                xAxis.dataFields.category = this.xAxisSettings.category;
                break;
            default:
                console.error('xAxisType not recognised.');
                return;
            }

            if (this.xAxisSettings.ranges) {
                for (const range of this.xAxisSettings.ranges) {
                    const axisRange = xAxis.axisRanges.create();
                    Object.assign(axisRange.grid, range.grid);
                    Object.assign(axisRange.label, range.label);
                    if (range.axisFill) {
                        Object.assign(axisRange.axisFill, range.axisFill);
                    }
                    switch (this.xAxisSettings.type) {
                    case 'date':
                        axisRange.date = range.date;
                        if (range.endDate) {
                            axisRange.endDate = range.endDate;
                        }
                        break;
                    case 'category':
                        axisRange.category = range.category;
                        if (range.endCategory) {
                            axisRange.endCategory = range.endCategory;
                        }
                        break;
                    }
                }
            }

            // Add value axis
            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.extraMax = 0.2;

            // Add Series
            for (const addSeries of this.series) {
                chart.series.push(addSeries);
            }

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = xAxis;
            valueAxis.cursorTooltipEnabled = false;
            if (xAxis instanceof am4charts.CategoryAxis) {
                chart.cursor.fullWidthLineX = true;
                chart.cursor.lineX.strokeWidth = 0;
                chart.cursor.lineX.fill = am4core.color('#0063cb');
                chart.cursor.lineX.fillOpacity = 0.1;
            }
            chart.scrollbarX = new am4core.Scrollbar();

            // Add a legend
            chart.legend = new am4charts.Legend();
            chart.legend.position = 'bottom';

            // Enable export
            if (this.showExportControls) {
                chart.exporting.menu = new am4core.ExportMenu();
            }

            this.chart = chart;
            this.$emit('updated', { action: 'render' });
            this.chart.events.on('ready', () => {
                this.$emit('rendered', { action: 'render' });
            });
        },
    },
};
</script>

