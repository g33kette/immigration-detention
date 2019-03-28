import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

/**
 * Store
 *
 * Used to call requests and cache responses.
 */
export default new Vuex.Store({
    state: {
        references: [
            {
                key: 'detention-stats-guide',
                citation: 'UK Home Office',
                title: 'User Guide to Home Office Immigration Statistics',
                author: 'UK Home Office',
                link: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/781065/user-guide-immigration-statistics.pdf',
                datePublished: '28 Feb 2013',
                dateAccessed: '28 Mar 2019',
            },
            {
                key: 'detention-stats',
                citation: 'UK Home Office Immigration Detention Data Tables 2018',
                title: 'Detention data tables immigration statistics year ending December 2018',
                author: 'UK Home Office',
                link: 'https://www.gov.uk/government/statistics/immigration-statistics-year-ending-december-2018-data-tables',
                datePublished: '28 Feb 2019',
                dateAccessed: '28 Mar 2019',
            },
            {
                key: 'migration-observatory-1',
                citation: 'Migration Observatory, University of Oxford',
                title: 'Immigration Detention in the UK',
                author: 'Migration Observatory at the University of Oxford',
                link: 'https://migrationobservatory.ox.ac.uk/resources/briefings/immigration-detention-in-the-uk/',
                datePublished: '03 Jul 2018',
                dateAccessed: '01 Feb 2019',
            },
        ],
    },
    getters: {
        /**
         * Get Ordered References List
         *
         * @return {array}
         */
        references: (state) => {
            return state.references.sort((a, b) => {
                return a.author === b.author?
                    (a.title > b.title?1:-1)
                    :(a.author > b.author?1:-1);
            });
        },
        /**
         * Get Reference Index by Key
         *
         * @param {string} key
         * @return {int|*}
         */
        referenceId: (state, getters) => (key) => {
            const references = getters['references'];
            return references.findIndex((a) => a.key === key) + 1;
        },
        /**
         * Get Reference Index by referenceId or key
         *
         * @param {string|int} key
         * @return {int|*}
         */
        reference: (state, getters) => (key) => {
            const references = getters['references'];
            if (!isNaN(parseInt(key)) && Number.isInteger(key)) {
                return references[key-1];
            }
            // Else
            const referenceId = getters['referenceId'](key);
            return references[referenceId-1];
        },
    },
    mutations: {
    },
    actions: {
        /**
         * Call
         *
         * Runs ajax request
         *
         * @param {object} options
         * @param {string} url
         * @param {object} params
         * @return {Promise<*>}
         */
        async call(options, { url, params }) {
            return axios.get(url, { url: params });
        },
    },
});
