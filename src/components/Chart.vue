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
    },
    data() {
        return {
            chart: null,
            colorsList: [
                am4core.color('#f89c2f'),
                am4core.color('#f18713'),
                am4core.color('#ffc35c'),
                am4core.color('#e7b978'),
                am4core.color('#1c1c1c'),
                am4core.color('#383838'),
                am4core.color('#606060'),
                am4core.color('#7b7b7b'),
            ],
        };
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

            const chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);

            chart.colors.list = this.colorsList;

            // Set Series Data
            chart.data = this.seriesData;
            // console.log(this.seriesData);

            chart.dateFormatter.inputDateFormat = 'yyyy';
            const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.minGridDistance = 60;
            dateAxis.startLocation = 0.5;
            dateAxis.endLocation = 0.5;
            dateAxis.baseInterval = {
                timeUnit: 'year',
                count: 1,
            };

            // Add value axis
            chart.yAxes.push(new am4charts.ValueAxis());

            // Add Series
            for (const addSeries of this.series) {
                chart.series.push(addSeries);
            }

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.xAxis = dateAxis;
            // chart.scrollbarX = new am4core.Scrollbar();

            // Add a legend
            chart.legend = new am4charts.Legend();
            chart.legend.position = 'bottom';

            this.chart = chart;
            this.$emit('updated', { action: 'render' });
        },
    },
};
</script>

