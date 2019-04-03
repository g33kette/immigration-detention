<!--
 * DetentionCentresController
 https://migrationobservatory.ox.ac.uk/resources/briefings/immigration-detention-in-the-uk/
-->
<template>
    <div class="component-detention-centres-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                UK Immigration Detention Centres
                <span class="uk-text-muted">{{ year==='total'?'All Available Years':year }}</span>
            </h3>
            <div v-if="centresSeries" uk-grid>
                <div class="uk-width-medium uk-height-large uk-overflow-auto">
                    <table class="uk-table uk-table-small uk-table-divider uk-table-hover uk-position-relative">
                        <thead>
                            <tr>
                                <th>
                                    <p class="uk-align-left uk-margin-small">Detention Centres</p>
                                    <button v-show="selectedCentre!==null"
                                            uk-tooltip="Click to Reset"
                                            :class="{
                                                'uk-button-default uk-button-small uk-align-right': true,
                                                'uk-margin-remove uk-pointer': true,
                                            }"
                                            @click="selectedCentre=null">
                                        <font-awesome-icon icon="undo" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="c in centresSeries.all" :key="c.heading"
                                :class="{
                                    'uk-pointer': true,
                                    'uk-active': c.active&&selectedCentre===null,
                                    'uk-selected': c.heading===selectedCentre
                                }"
                                xmouseenter="selectedCentre=c.heading"
                                @click="selectedCentre=c.heading">
                                <td>{{ c.title }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="uk-width-large">
                    <div class="uk-position-relative">
                        <loading v-if="rendering&&!loading" :opacity="0.5" />
                        <div :class="{
                            'uk-position-z-index uk-card uk-card-small uk-card-default uk-position-absolute': true,
                            'uk-padding-small uk-box-shadow-large uk-margin-top': true,
                            'uk-active': selectedCentre===null,
                        }">
                            <h5 v-if="selectedCentre" class="uk-h5 uk-margin-remove">
                                {{ selectedCentreDetails.title }}
                                <span v-if="!selectedCentreDetails.active" class="uk-text-muted uk-text-small">
                                    (Closed)
                                </span>
                            </h5>
                            <p v-else class="uk-margin-remove uk-text-bold">
                                Active at the end of 2018
                            </p>
                        </div>
                        <point-map-chart class="map uk-height-large"
                                         :uk="true"
                                         :series-data="centresSeries"
                                         :active-series="activeCentresSeries"
                                         :show-zoom-controls="false"
                                         :show-export-controls="false"
                                         @updated="mapUpdated" />
                    </div>
                </div>
                <div class="uk-width-expand@l uk-width-1-1 uk-height-large uk-overflow-auto">
                    <div v-if="selectedCentre===null">
                        <h3 class="uk-h3 uk-margin-small">IRC</h3>
                        <h4 class="uk-h4 uk-text-secondary uk-margin-small">Immigration Removal Centre</h4>
                        <p />
                        <h3 class="uk-h3 uk-margin-small">STHF</h3>
                        <h4 class="uk-h4 uk-text-secondary uk-margin-small">Short-Term Holding Facility</h4>
                        <p />
                        <h3 class="uk-h3 uk-margin-small">PDA</h3>
                        <h4 class="uk-h4 uk-text-secondary uk-margin-small">Pre-Departure Accommodation</h4>
                        <p />
                    </div>
                    <div v-else>
                        <div v-for="y in selectedCentreDetainees" :key="y.year">
                            <h4 :class="{'uk-h4 uk-margin-small': true, 'uk-text-muted': y.detainees===0}">
                                {{ y.year }}
                                <span v-if="y.detainees>0" class="uk-text-bold uk-text-small uk-text-secondary">
                                    {{ y.detainees }} People
                                </span>
                            </h4>
                            <font-awesome-icon v-for="d in y.detainees" :key="d" icon="male"
                                               class="uk-margin-xsmall-right"
                                               size="sm" />
                            <!--{{ detainees }}-->
                        </div>
                    </div>
                </div>
                <div class="uk-margin uk-width-1-1">
                    <span class="uk-text-muted uk-align-right uk-margin-remove">
                        (Numbers shown are max detainees at end of busiest quarter)
                    </span>
                    <br>
                    <citation tag="detention-stats" class="uk-align-right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PointMap from './PointMap';
import Citation from './Citation';
import LoadingCover from './LoadingCover';
import axios from 'axios';
export default {
    name: 'DetentionCentresController',
    components: { 'loading': LoadingCover, 'point-map-chart': PointMap, 'citation': Citation },
    data() {
        return {
            loading: true,
            rendering: true,
            headings: null,
            series: null,
            centresData: null,
            selectedCentre: null,
            year: 2018,
        };
    },
    computed: {
        centresSeries() {
            return !this.centresData?null:{
                all: this.centresData,
                active: this.centresData.filter((c) => c.active),
                selected: this.centresData.filter((c) => c.heading === this.selectedCentre),
            };
        },
        activeCentresSeries() {
            return this.selectedCentre === null?'active':'selected';
        },
        selectedCentreDetails() {
            return this.selectedCentre?this.centresSeries.selected[0]:{};
        },
        selectedCentreDetainees() {
            if (!this.selectedCentre) {
                return [];
            }
            // Else continue
            const data = {};
            for (const q in this.series) {
                if (this.series.hasOwnProperty(q)) {
                    // Get largest quarter value
                    if (typeof data[q.substr(0, 4)] === 'undefined'
                        || data[q.substr(0, 4)] < this.series[q][this.selectedCentre]) {
                        data[q.substr(0, 4)] = {
                            year: parseInt(q.substr(0, 4)),
                            detainees: this.series[q][this.selectedCentre],
                        };
                    }
                }
            }
            return Object.values(data).sort((a, b) => b.year-a.year);
        },
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
            this.series = responseData.data;
            this.centresData = responseData.centres;
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
    @import '../assets/scss/variables';
    .uk-table-hover tbody tr:hover, .uk-selected {
        background: $global-primary-background !important;
        color: $text-on-primary-color;
    }
    .uk-card.uk-active {
        background: $table-row-active-background;
    }
    .uk-margin-xsmall-right {
        margin-right: 3px;
    }
</style>
