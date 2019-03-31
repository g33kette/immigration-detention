
import VueRouter from 'vue-router';

import IndexController from './components/IndexController';
import AnalysisController from './components/AnalysisController';
import DetaineeOriginController from './components/DetaineeOriginController';
import AnnualTrendsController from './components/AnnualTrendsController';
import ReferencesController from './components/ReferencesController';
import DetentionCentresController from './components/DetentionCentresController';

/**
 * Defined routes within the application
 *
 * @type {*[]}
 */
const routes = [
    { path: '/', name: 'index', component: IndexController },
    { path: '/analysis', name: 'analysis', component: AnalysisController },
    { path: '/detainee-origin', name: 'detainee-origin', component: DetaineeOriginController },
    { path: '/annual-trends', name: 'annual-trends', component: AnnualTrendsController },
    { path: '/detention-centres', name: 'detention-centres', component: DetentionCentresController },
    { path: '/references/:id?', name: 'references', component: ReferencesController },
];

export default new VueRouter({ routes });
