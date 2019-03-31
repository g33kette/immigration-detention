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
import am4geodataUkLow from '@amcharts/amcharts4-geodata/ukLow';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';
am4core.useTheme(am4themesAnimated);
export default {
    name: 'Map',
    props: {
        // seriesData: { required: true, type: Object },
        // activeSeries: { required: true, type: [Number, String] },
        // customTemplate: { required: false, type: Object, default: () => ({}) },
        // hoverColor: { required: false, type: String, default: '#f89c2f' },
        uk: { required: false, type: Boolean, default: false },
    },
    data() {
        return {
            map: null,
        };
    },
    watch: {
        // activeSeries() {
        //     this.redrawMap();
        // },
        // customTemplate() {
        //     this.redrawMap();
        // },
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
            // if (typeof this.seriesData[this.activeSeries] === 'undefined') {
            //     return; // nothing to render
            // }

            const map = am4core.create(this.$refs.mapdiv, am4maps.MapChart);

            // Change background color
            // map.background.fill = am4core.color('#f8e7d9');
            map.background.fill = am4core.color('#ffffff');
            map.background.fillOpacity = 1;

            // Add zoom controls
            map.zoomControl = new am4maps.ZoomControl();
            map.zoomControl.slider.height = 100;

            // Set map definition
            if (this.uk) {
                map.geodata = am4geodataUkLow;
            } else {
                map.geodata = am4geodataWorldLow;
            }

            // Set projection
            map.projection = new am4maps.projections.Miller();
            const polygonSeries = new am4maps.MapPolygonSeries();
            map.series.push(polygonSeries);
            polygonSeries.useGeodata = true;
            if (!this.uk) {
                polygonSeries.exclude = ['AQ'];
            }
            this.addMapPoints(map);
            // this.addMapSeries(map, this.seriesData[this.activeSeries]);

            // Enable export
            map.exporting.menu = new am4core.ExportMenu();

            this.map = map;
            this.$emit('updated', { action: 'render' });
        },
        addMapPoints(map, data) {
            const imageSeries = map.series.push(new am4maps.MapImageSeries());
            const imageSeriesTemplate = imageSeries.mapImages.template;
            const circle = imageSeriesTemplate.createChild(am4core.Circle);
            circle.radius = 4;
            circle.fill = am4core.color('#B27799');
            circle.stroke = am4core.color('#FFFFFF');
            circle.strokeWidth = 2;
            circle.nonScaling = true;
            circle.tooltipText = '{title}';
            imageSeriesTemplate.propertyFields.latitude = 'latitude';
            imageSeriesTemplate.propertyFields.longitude = 'longitude';

            imageSeries.data = [{
                'latitude': 52.195672,
                'longitude': -0.485438,
                'title': 'Yarls Wood',
            }, {
                'latitude': 53.167853,
                'longitude': -0.689226,
                'title': 'Morton Hall',
            }, {
                'latitude': 51.117944,
                'longitude': 1.296038,
                'title': 'Dover IRC',
            }];

            return imageSeries;
        },
        // addMapSeries(map, data) {
        //     const polygonSeries = new am4maps.MapPolygonSeries();
        //     polygonSeries.data = data;
        //     map.series.push(polygonSeries);
        //     polygonSeries.useGeodata = true;
        //     if (!this.uk) {
        //         polygonSeries.exclude = ['AQ'];
        //     }
        //
        //     const polygonTemplate = polygonSeries.mapPolygons.template;
        //     this.assignRecursively(polygonTemplate, this.customTemplate);
        //
        //     // Hover state
        //     const hs = polygonTemplate.states.create('hover');
        //     hs.properties.fill = am4core.color(this.hoverColor);
        //     return polygonSeries;
        // },
        // assignRecursively(target, map) {
        //     for (const k in map) {
        //         if (map.hasOwnProperty(k)) {
        //             if (typeof map[k] === 'object') {
        //                 target[k] = this.assignRecursively(target[k], map[k]);
        //             } else {
        //                 target[k] = map[k];
        //             }
        //         }
        //     }
        //     return target;
        // },
        // redrawMap() {
        //     if (!this.map) {
        //         this.renderMap();
        //         return;
        //     }
        //     const polygonSeries = this.addMapSeries(this.map, this.seriesData[this.activeSeries]);
        //     polygonSeries.events.on('ready', () => {
        //         setTimeout(() => {
        //             this.map.series.shift();
        //         }, 500);
        //         this.$emit('updated', { action: 'update' });
        //     });
        //     this.map.validateData();
        // },
    },
};
</script>

