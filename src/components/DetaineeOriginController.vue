<!--
 * DetaineeOriginController
-->
<template>
    <div class="component-detainee-origin-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                Origin of Detainees Entering UK Immigration Detention
                <span class="uk-text-muted">{{ year==='total'?(minYear + ' - ' + maxYear):year }}</span>
            </h3>
            <div>
                <p>This map shows the nationality of people entering UK immigration detention.</p>
            </div>
            <form class="uk-form-horizontal uk-margin-bottom" @submit.prevent>
                <div class=" uk-width-1-1">
                    <div class="uk-margin">
                        <label class="uk-form-label uk-text-secondary uk-text-bold">
                            Shading:
                        </label>
                        <div class="uk-radio-controls uk-grid-small uk-child-width-auto uk-grid">
                            <label>
                                <input v-model="shading"
                                       class="uk-radio"
                                       type="radio"
                                       name="shading"
                                       value="total">
                                All Detainees
                            </label>
                            <label>
                                <input v-model="shading"
                                       class="uk-radio"
                                       type="radio"
                                       name="shading"
                                       value="adults">
                                Adults
                            </label>
                            <label>
                                <input v-model="shading"
                                       class="uk-radio"
                                       type="radio"
                                       name="shading"
                                       value="children">
                                Children
                            </label>
                            <label>
                                <input v-model="shading"
                                       class="uk-radio"
                                       type="radio"
                                       name="shading"
                                       value="male">
                                Men
                            </label>
                            <label>
                                <input v-model="shading"
                                       class="uk-radio"
                                       type="radio"
                                       name="shading"
                                       value="female">
                                Women
                            </label>
                        </div>
                    </div>
                </div>
                <div class="uk-width-1-1 uk-margin uk-margin-bottom">
                    <button :class="{
                                'uk-button uk-button-small uk-margin-right': true,
                                'uk-button-default': year !== 'total',
                                'uk-button-secondary': year === 'total',
                            }"
                            @click="year='total'">
                        Show {{ minYear }} - {{ maxYear }} Combined
                    </button>
                    <button :class="{
                                'uk-button uk-button-small uk-margin-right': true,
                                'uk-button-default': year === 'total',
                                'uk-button-secondary': year !== 'total',
                            }"
                            @click="year=2018">
                        Show Years Independently
                    </button>
                </div>
                <div v-show="year!=='total'" class="uk-width-1-1">

                    <div class="uk-margin">
                        <select v-model="year" class="uk-select uk-width-small uk-margin uk-margin-remove-vertical">
                            <option v-for="y in availableYears.filter(x => x !== 'total')" :key="y" :value="y">
                                {{ y }}
                            </option>
                        </select>
                        <button :class="{
                                    'uk-button uk-button-default uk-margin-left': true,
                                    'uk-disabled uk-text-muted': year<=minYear,
                                }"
                                title="Previous Year"
                                @click="year=year>minYear?year-1:year">
                            <font-awesome-icon icon="backward" />
                        </button>
                        <button :class="{
                                    'uk-button uk-button-default uk-margin-left': true,
                                    'uk-disabled uk-text-muted': year>=maxYear,
                                }"
                                title="Next Year"
                                @click="year=year<maxYear?year+1:year">
                            <font-awesome-icon icon="forward" />
                        </button>
                        <button :class="{
                                    'uk-button uk-button-default uk-margin-left': true,
                                }"
                                :title="autoPlay?'Stop':'Play Through Years'"
                                @click="toggleAutoPlay">
                            <font-awesome-icon :icon="autoPlay?'stop':'play'" />
                        </button>
                    </div>
                    <div class="uk-margin">
                        <input id="year"
                               v-model="year"
                               class="uk-range"
                               type="range"
                               :max="maxYear"
                               :min="minYear"
                               step="1">
                    </div>
                </div>
            </form>
            <div class="uk-position-relative uk-padding-small uk-padding-remove-horizontal">
                <loading v-if="rendering&&!loading&&!autoPlay" :opacity="0.5" />
                <map-chart v-if="series"
                           class="map uk-height-large"
                           :series-data="series"
                           :active-series="year"
                           :custom-template="customTemplate"
                           @updated="mapUpdated" />
            </div>
            <div class="legend uk-align-right uk-text-small uk-margin-remove">
                <div class="legend-gradient" />
                <span class="uk-align-left uk-margin-small uk-margin-remove-top">
                    Low {{ lowValue | numberFormat }}
                </span>
                <span class="uk-align-right uk-margin-small uk-margin-remove-top">
                    High  {{ highValue | numberFormat }}
                </span>
            </div>
            <div class="uk-margin-small">
                <span class="uk-text-bold"><font-awesome-icon icon="question-circle" /> Using The Chart</span>
                <ul class="uk-list-bullet uk-list">
                    <li>
                        You can zoom by using the mouse scroll button or using the zoom controls on the right hand
                        side of the map.
                    </li>
                    <li>You can move around the map by clicking and dragging the area.</li>
                    <li>You can hover a country to show the details.</li>
                    <li>A darker shading indicates a higher proportion of detainees.</li>
                </ul>
            </div>
            <div class="uk-margin">
                <citation tag="detention-stats" class="uk-align-right" />
            </div>
        </div>
    </div>
</template>

<script>
import Map from './Map';
import Citation from './Citation';
import * as am4core from '@amcharts/amcharts4/core';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'DetaineeOriginController',
    components: { 'loading': LoadingCover, 'map-chart': Map, 'citation': Citation },
    filters: {
        numberFormat: function(value) {
            if (isNaN(parseInt(value))) return value;
            return (new Intl.NumberFormat('en-GB', {})).format(value);
        },
    },
    data() {
        return {
            loading: true,
            rendering: true,
            year: 'total',
            shading: 'total',
            availableYears: [],
            series: null,
            extremes: {},
            totalExtremes: {},
            autoPlay: false,
            autoPlaySpeed: 1000,
        };
    },
    computed: {
        customTemplate() {
            return {
                propertyFields: { fill: this.shading+'Shading' },
                tooltipText: `[bold]{name}[/]
                    {total} Detainees
                    -------
                    {adults} Adults
                    {children} Children
                    {male} Men
                    {female} Women`,
                pointerOrientation: 'vertical',
                stroke: am4core.color('#666666'),
            };
        },
        minYear() {
            return parseInt(this.availableYears && this.availableYears.length ?
                this.availableYears[this.availableYears.length-1]
                : 0);
        },
        maxYear() {
            return parseInt(this.availableYears && this.availableYears.length ? this.availableYears[1] : 0);
        },
        lowValue() {
            return 0;
        },
        highValue() {
            const extremes = this.year === 'total'?this.totalExtremes:this.extremes;
            let key;
            switch (this.shading) {
            case 'total':
                key = 'maxTotal';
                break;
            case 'adults':
                key = 'maxAdults';
                break;
            case 'children':
                key = 'maxChildren';
                break;
            case 'male':
                key = 'maxMale';
                break;
            case 'female':
                key = 'maxFemale';
                break;
            }
            return extremes[key];
        },
    },
    watch: {
        shading() {
            this.rendering = true;
        },
        year(newYear) {
            this.rendering = true;
            if (newYear !== 'total' && typeof newYear === 'string') {
                this.year = parseInt(newYear);
            }
        },
    },
    mounted() {
        this.loadSeriesData();
    },
    methods: {
        callLoadData() {
            return axios.get('/data/detainee-origins.json');
        },
        toggleAutoPlay() {
            if (!this.autoPlay) {
                if (this.year === this.maxYear) {
                    this.autoPlay = setTimeout(() => this.play(this.minYear), this.autoPlaySpeed);
                } else {
                    this.autoPlay = setTimeout(() => this.play(this.year+1), this.autoPlaySpeed);
                }
            } else {
                clearInterval(this.autoPlay);
                this.autoPlay = false;
            }
        },
        play(year) {
            console.log(year, this.maxYear);
            this.year = year;
            if (year < this.maxYear) {
                this.autoPlay = setTimeout(() => this.play(year + 1), this.autoPlaySpeed);
            } else {
                this.autoPlay = false;
            }
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.extremes = responseData.extremes;
            this.totalExtremes = responseData.totalExtremes;
            const series = {};
            this.availableYears = [];
            for (const year in responseData.data) {
                if (responseData.data.hasOwnProperty(year)) {
                    this.availableYears.push(year);
                    const responseYearData = responseData.data[year];
                    const data = [];
                    for (const k in responseYearData) {
                        if (responseYearData.hasOwnProperty(k)) {
                            const item = responseYearData[k];
                            const extremes = year === 'total'?responseData.totalExtremes:responseData.extremes;
                            item.totalShading = this.shadingColor(extremes['maxTotal'], item.total);
                            item.adultsShading = this.shadingColor(extremes['maxAdults'], item.adults);
                            item.childrenShading = this.shadingColor(extremes['maxChildren'], item.children);
                            item.maleShading = this.shadingColor(extremes['maxMale'], item.male);
                            item.femaleShading = this.shadingColor(extremes['maxFemale'], item.female);
                            data.push(item);
                        }
                    }
                    series[year] = data;
                }
            }
            this.series = series;
            this.availableYears.sort().reverse();
            this.loading = false;
        },
        shadingColor(extreme, value) {
            const col = value === 0 ? 255 : (Math.floor(205 - ((205/extreme) * value)));
            return am4core.color('rgb(' + col + ', ' + col + ', ' + col + ')');
        },
        mapUpdated({ action }) {
            // console.log('updated', action);
            setTimeout(() => this.rendering = false, 200);
        },
    },
};
</script>

<style lang="scss" scoped>
    @import '../assets/scss/variables';
    form {
        .uk-form-label {
            width: 80px;
        }
        .uk-form-controls {
            margin-left: 100px;
        }
        .uk-radio-controls {
            padding-top: 7px;
            label {
                cursor: pointer;
            }
        }
    }
    .legend-gradient {
        width: 200px;
        height: 15px;
        background: linear-gradient(to right, white , black);
        border-radius: 3px;
    }
    .uk-range {
        border: solid 10px #ccc;
    }
</style>


