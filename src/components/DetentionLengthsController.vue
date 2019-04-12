<!--
 * DetentionLengthsController
 An individual may be held and remain in immigration detention for a variety of reasons, including
reasons within and outside the control of the Home Office. Those outside the control of the Home
Office may include but are not exclusively: individual compliance with immigration procedures,
including providing appropriate paperwork; and barriers to removal relating to the individual’s personal
circumstances or circumstances related to the intended country of return. Reasons within the control
of the Home Office include: where the Home Office has assessed it is not in the public interest to
release the individual pending return. The Home Office has a statutory duty to review detention at
least every 28 days to ensure that the detained person continues to meet the published detention
criteria and that detention is still the most appropriate course.
87
Published detention figures relate only to those detained solely under Immigration Act powers, in
immigration removal centres, short term holding facilities, pre departure accommodation and H M
Prisons, and exclude those detained for criminal purposes and those who are detained under both
criminal and immigration powers. Published detention statistics exclude detainees in short-term
holding rooms at ports and airports (for less than 24 hours) and police cells; reliable data have not
been available for these individuals since March 2006.
-->
<template>
    <div class="component-detention-lengths-controller uk-container">
        <div class="uk-card uk-card-default uk-padding uk-width-1-1">
            <loading v-if="loading" message="Loading Data..." />
            <h3 class="uk-heading-divider uk-h3 uk-text-center">
                UK Immigration Detention
                <span class="uk-text-muted">Longest Detention Periods</span>
            </h3>
            <div>
                <div class="uk-margin-bottom">
                    <p class="uk-text-bold uk-text-secondary">
                        An individual may be detained indefinitely under the UK Immigration Act, although the
                        Home Office has a statutory duty to review detention at least every 28 days.
                    </p>
                    <p class="uk-text-emphasis uk-margin-remove">Reasons for detention include:</p>
                    <ul class="uk-list uk-list-bullet uk-margin-remove-vertical">
                        <li class="uk-margin-remove">Inability to provide adequate paperwork</li>
                        <li class="uk-margin-remove">Non-compliance with immigration procedures</li>
                        <li class="uk-margin-remove">Circumstantial barriers preventing deportation</li>
                        <li class="uk-margin-remove">It is not in the public interest to allow release on bail</li>
                    </ul>
                    <citation tag="detention-stats-guide" />
                </div>
            </div>
            <div v-if="seriesData">
                <div class="uk-margin">
                    <h3>At the end of {{ year }}, the longest detention period was up to...</h3>
                    <detention-lengths-display :days="seriesData[year].max" @displayComplete="displayComplete=true" />
                    <div v-if="displayComplete" class="uk-animation-slide-top uk-margin-top">
                        <p class="uk-text-large">
                            ... and {{ seriesData[year].maxRank }} people had been detained under immigration powers for
                            <span class="uk-text-emphasis">{{ seriesData[year].min | numberFormat }}</span>
                            days or more.
                        </p>
                    </div>
                </div>
            </div>
            <div class="uk-margin">
                <p>
                    <span class="uk-text-secondary uk-text-bold uk-margin-right">Show</span>
                    <button v-for="y in Object.keys(seriesData).sort((a,b) => b-a)" :key="y"
                            :class="{
                                'uk-button uk-button-default': true,
                                'uk-active': y===year
                            }"
                            @click="year=y">
                        {{ y }}
                    </button>
                </p>
            </div>
            <div class="uk-margin uk-width-1-1">
                <citation tag="detention-stats" class="uk-align-right" />
            </div>
        </div>
    </div>
</template>

<script>
import Citation from './Citation';
import LoadingCover from './LoadingCover';
import axios from 'axios';
import DetentionLengthsDisplay from './DetentionLengthsDisplay';
export default {
    name: 'DetentionLengthsController',
    components: { DetentionLengthsDisplay, 'loading': LoadingCover, 'citation': Citation },
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
            headings: null,
            series: null,
            seriesData: null,
            year: '2018',
            displayComplete: false,
        };
    },
    computed: {
    },
    watch: {
        year() {
            this.displayComplete = false;
        },
    },
    mounted() {
        this.loadSeriesData();
    },
    methods: {
        callLoadData() {
            return axios.get('/data/detention-lengths.json');
        },
        async loadSeriesData() {
            this.loading = true;
            const responseData = (await this.callLoadData()).data;
            this.seriesData = responseData.longest;
            this.loading = false;
        },
    },
};
</script>

<style lang="scss" scoped>
    .uk-text-medium {
        font-size: 1.2em;
    }
</style>
