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
                key: 'migration-observatory-1',
                title: 'Immigration Detention in the UK',
                author: 'Migration Observatory at the University of Oxford',
                link: 'https://migrationobservatory.ox.ac.uk/resources/briefings/immigration-detention-in-the-uk/',
                datePublished: '03 Jul 2018',
                dateAccessed: '01 Feb 2019 16:29',
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
