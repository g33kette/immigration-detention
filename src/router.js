
import VueRouter from 'vue-router';

import IndexController from './components/IndexController';
import AnalysisController from './components/AnalysisController';
import ReferencesController from './components/ReferencesController';

/**
 * Defined routes within the application
 *
 * @type {*[]}
 */
const routes = [
    { path: '/', name: 'index', component: IndexController },
    { path: '/analysis', name: 'analysis', component: AnalysisController },
    { path: '/references/:id?', name: 'references', component: ReferencesController },
];

export default new VueRouter({ routes });
