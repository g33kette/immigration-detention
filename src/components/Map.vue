<!--
 * Navigation
 *
 * Navigation Menu
-->
<template>
    <div ref="mapdiv" class="component-map" />
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodataWorldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themesAnimated);
export default {
    name: 'Map',
    props: {
        series: { required: false, type: Object },
        // lowColor: { required: false, type: String, default: '#7b1313' },
        // highColor: { required: false, type: String, default: '#173c7b' },
        hoverColor: { required: false, type: String, default: '#f89c2f' },
        hoverTooltip: { required: false, type: String, default: '{name}' },
    },
    data() {
        return {
            map: null,
        };
    },
    watch: {
        series() {
            this.renderMap();
        },
    },
    mounted() {
        this.renderMap();
    },
    beforeDestroy() {
        if (this.map) {
            this.map.dispose();
        }
    },
    methods: {
        destroyMap() {
            if (this.map) {
                this.map.dispose();
            }
        },
        renderMap() {
            console.log('renderMap', this.series);
            this.destroyMap();

            if (!this.series) {
                return; // nothing to render
            }

            const map = am4core.create(this.$refs.mapdiv, am4maps.MapChart);

            // Set map definition
            map.geodata = am4geodataWorldLow;

            // Set projection
            map.projection = new am4maps.projections.Miller();

            // Series for World map
            const worldSeries = map.series.push(this.series);
            worldSeries.useGeodata = true;
            worldSeries.exclude = ['AQ'];

            const polygonTemplate = worldSeries.mapPolygons.template;
            // polygonTemplate.tooltipText = this.hoverTooltip;

            // Hover state
            const hs = polygonTemplate.states.create('hover');
            hs.properties.fill = am4core.color(this.hoverColor);

            this.map = map;
        },
    },
};
</script>

