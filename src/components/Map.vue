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
        seriesData: { required: false, type: Object, default: () => {} },
        activeSeries: { required: true, type: [Number, String] },
        customTemplate: { required: false, type: Object, default: () => ({}) },
        hoverColor: { required: false, type: String, default: '#f89c2f' },
    },
    data() {
        return {
            map: null,
        };
    },
    watch: {
        activeSeries() {
            if (this.map) {
                this.map.series.clear();
                this.addMapSeries(this.map, this.seriesData[this.activeSeries]);
                this.map.validateData();
            } else {
                this.renderMap();
            }
        },
        customTemplate() {
            if (this.map) {
                this.map.series.clear();
                this.addMapSeries(this.map, this.seriesData[this.activeSeries]);
                this.map.validateData();
            } else {
                this.renderMap();
            }
        },
    },
    mounted() {
        this.renderMap();
    },
    beforeDestroy() {
        this.destroyMap();
    },
    methods: {
        destroyMap() {
            if (this.map) {
                this.map.dispose();
            }
        },
        renderMap() {
            this.destroyMap();
            if (typeof this.seriesData[this.activeSeries] === 'undefined') {
                return; // nothing to render
            }

            const map = am4core.create(this.$refs.mapdiv, am4maps.MapChart);

            // Change background color
            map.background.fill = am4core.color('#ffffff');
            map.background.fillOpacity = 1;

            // Add zoom controls
            map.zoomControl = new am4maps.ZoomControl();
            map.zoomControl.slider.height = 100;

            // Set map definition
            map.geodata = am4geodataWorldLow;

            // Set projection
            map.projection = new am4maps.projections.Miller();
            this.addMapSeries(map, this.seriesData[this.activeSeries]);

            this.map = map;
        },
        addMapSeries(map, data) {
            const polygonSeries = new am4maps.MapPolygonSeries();
            polygonSeries.data = data;
            map.series.push(polygonSeries);
            polygonSeries.useGeodata = true;
            polygonSeries.exclude = ['AQ'];

            const polygonTemplate = polygonSeries.mapPolygons.template;
            this.assignRecursively(polygonTemplate, this.customTemplate);

            // Hover state
            const hs = polygonTemplate.states.create('hover');
            hs.properties.fill = am4core.color(this.hoverColor);
        },
        assignRecursively(target, map) {
            for (const k in map) {
                if (map.hasOwnProperty(k)) {
                    if (typeof map[k] === 'object') {
                        target[k] = this.assignRecursively(target[k], map[k]);
                    } else {
                        target[k] = map[k];
                    }
                }
            }
            return target;
        },
    },
};
</script>

