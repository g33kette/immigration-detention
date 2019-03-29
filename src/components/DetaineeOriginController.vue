<!--
 * DetaineeOriginController
-->
<template>
    <div class="component-analysis-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading message="Loading Data..." v-if="loading" />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                Origin of UK Immigration Detainees <span class="uk-text-muted">{{ year }}</span>
            </h3>
            <!--<map-chart class="map uk-height-large" :series="series[year]" />-->
            <div>
                <label class="uk-form-label" for="year">Change Year:</label>
                <select id="year" class="uk-form-controls" v-model="year">
                    <option>2018</option>
                    <option>2017</option>
                    <option>2016</option>
                    <option>2015</option>
                    <option>2014</option>
                    <option>2013</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
import Map from './Map';
import { MapPolygonSeries } from '@amcharts/amcharts4/maps';
import * as am4core from '@amcharts/amcharts4/core';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'DetaineeOriginController',
    components: { 'loading': LoadingCover, 'map-chart': Map },
    data() {
        return {
            loading: true,
            year: 2018,
            series: {},
        };
    },
    watch: {
        year() {
            // this.loadMap();
        },
    },
    async mounted() {
        this.series = (await this.loadSeriesData());
        // this.loadMap();
    },
    methods: {
        callLoadData() {
            return axios.get('/data/detainee-origins.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            const series = {};
            for (const year in responseData) {
                if (responseData.hasOwnProperty(year)) {
                    const responseYearData = responseData[year];
                    const data = [];
                    for (const k in responseYearData) {
                        if (responseYearData.hasOwnProperty(k)) {
                            const item = responseYearData[k];
                            const col = (255 - item.total) - 50;
                            item.fill = am4core.color('rgb(' + col + ', ' + col + ', ' + col + ')');
                            data.push(item);
                        }
                    }
                    const yearSeries = {};//new MapPolygonSeries();
                    yearSeries.data = data;
                    // yearSeries.mapPolygons.template.propertyFields.fill = 'fill';
                    // yearSeries.mapPolygons.template.tooltipText = '{name}: {total}';
                    series[year] = yearSeries;
                }
            }
            // this.$set(this.series, this.year, series);
            this.series = series;
            console.log(this.series);
            this.loading = false;
        },
        // async loadMap() {
        //     this.loading = true;
        //     const responseData = (await this.callLoadData()).data[this.year];
        //     const data = [];
        //     for (const k in responseData) {
        //         if (responseData.hasOwnProperty(k)) {
        //             const item = responseData[k];
        //             const col = (255 - item.total) - 50;
        //             item.fill = am4core.color('rgb(' + col + ', ' + col + ', ' + col + ')');
        //             data.push(item);
        //         }
        //     }
        //     const series = new MapPolygonSeries();
        //     series.data = data;
        //     series.mapPolygons.template.propertyFields.fill = 'fill';
        //     series.mapPolygons.template.tooltipText = '{name}: {total}';
        //     this.$set(this.series, this.year, series);
        //     this.loading = false;
        //     console.log(this.series);
        // },
    },
};
</script>

<style lang="scss" scoped>
    //@import '../assets/scss/variables';
</style>


