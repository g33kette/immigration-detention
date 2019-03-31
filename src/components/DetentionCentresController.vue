<!--
 * DetentionCentresController
-->
<template>
    <div class="component-detainee-origin-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                UK Immigration Detention Centres
                <span class="uk-text-muted">{{ year==='total'?'All Available Years':year }}</span>
            </h3>
            <div class="uk-position-relative">
                <loading v-if="rendering&&!loading" :opacity="0.5" />
                <map-chart v-if="series"
                           class="map uk-height-large"
                           :uk="true"
                           @updated="mapUpdated" />
            </div>
            <div class="uk-margin">
                <citation tag="detention-stats" class="uk-align-right" />
            </div>
        </div>
    </div>
</template>

<script>
import PointMap from './PointMap';
import Citation from './Citation';
import * as am4core from '@amcharts/amcharts4/core';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'DetentionCentresController',
    components: { 'loading': LoadingCover, 'map-chart': PointMap, 'citation': Citation },
    data() {
        return {
            loading: true,
            rendering: true,
            headings: null,
            series: null,
            locations: null,
            year: 2018,
        };
    },
    computed: {
    },
    watch: {
    },
    mounted() {
        this.loadSeriesData();
    },
    methods: {
        callLoadData() {
            return axios.get('/data/detention-centres.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.headings = responseData.headings;
            this.series = responseData.data;
            this.locations = responseData.locations;
            this.loading = false;
        },
        mapUpdated({ action }) {
            // console.log('updated', action);
            setTimeout(() => this.rendering = false, 200);
        },
    },
};
</script>

<style lang="scss" scoped>
    //@import '../assets/scss/variables';
</style>
