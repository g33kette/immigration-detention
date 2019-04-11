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
                link: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/' +
                    'file/781065/user-guide-immigration-statistics.pdf',
                datePublished: '28 Feb 2013',
                dateAccessed: '28 Mar 2019',
            },
            {
                key: 'detention-stats',
                citation: 'UK Home Office Immigration Detention Data Tables 2018',
                title: 'Detention data tables immigration statistics year ending December 2018',
                author: 'UK Home Office',
                link: 'https://www.gov.uk/government/statistics/' +
                    'immigration-statistics-year-ending-december-2018-data-tables',
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
            {
                key: 'eu-directive',
                citation: 'EU Directive 2008/115/EC',
                title: 'Directive 2008/115/EC of the European Parliament and of the Council of 16 December 2008 on ' +
                    'common standards and procedures in Member States for returning illegally staying third-country ' +
                    'nationals',
                author: 'The European Parliament',
                link: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32008L0115',
                datePublished: '16 Dec 2008',
                dateAccessed: '31 Jan 2019',
            },
            {
                key: 'shaw-report',
                citation: 'Shaw Report 2016',
                title: 'Review into the Welfare in Detention of Vulnerable Persons: Independent review of Home Office' +
                    ' policies and operating procedures that affect the welfare of immigration detainees.',
                author: 'Stephen Shaw',
                link: 'https://www.gov.uk/government/publications/review-into-the-welfare-in-detention' +
                    '-of-vulnerable-persons',
                datePublished: 'Jan 2016',
                dateAccessed: '09 Apr 2019',
            },
            {
                key: 'panorama-report',
                citation: 'BBC Panorama',
                title: 'What I saw when I went undercover: The 21-year-old whistleblower at the immigration ' +
                    'removal centre',
                author: 'Alison Holt',
                link: 'https://www.bbc.co.uk/news/resources/idt-sh/g4s_brook_house_immigration_removal_' +
                    'centre_undercover',
                datePublished: '04 Sep 2017',
                dateAccessed: '09 Apr 2019',
            },
            {
                key: 'yarls-wood-protest',
                citation: 'Yarl\'s Wood Activists',
                title: 'Guardian News Article: Activists surround Yarl\'s Wood detention centre with wall of noise',
                author: 'Damien Gayle and Ruth McKee',
                link: 'https://www.theguardian.com/uk-news/2016/sep/10/activists-demand-closure-yarls-wood-surround-' +
                    'centre-wall-noise',
                datePublished: '10 Sep 2016',
                dateAccessed: '09 Apr 2019',
            },
            {
                key: 'independent-hunger-strike',
                citation: 'Yarl\'s Wood Hunger Strike',
                title: 'Independent News Article: More than 100 women in Yarl\'s Wood detention centre go on hunger ' +
                    'strike over \'inhumane\' conditions',
                author: 'May Bulman',
                link: 'https://www.independent.co.uk/news/uk/home-news/yarls-wood-women-immigration-detention-centre-' +
                    'hunger-strike-home-office-a8223886.html',
                datePublished: '22 Feb 2018',
                dateAccessed: '09 Apr 2019',
            },
            {
                key: 'hostile-environment',
                citation: 'Inspection of Hostile Environment Measures',
                title: 'Inspection report of hostile environment measures, October 2016',
                author: 'Independent Chief Inspector of Borders and Immigration ',
                link: 'https://www.gov.uk/government/publications/inspection-report-of-hostile-environment-' +
                    'measures-october-2016',
                datePublished: '13 Oct 2016',
                dateAccessed: '11 Apr 2019',
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
