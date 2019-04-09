
import VueRouter from 'vue-router';

import IndexController from './components/IndexController';
import DetaineeOriginController from './components/DetaineeOriginController';
import EnteringDetentionController from './components/EnteringDetentionController';
import LeavingDetentionController from './components/LeavingDetentionController';
import ReferencesController from './components/ReferencesController';
import DetentionCentresController from './components/DetentionCentresController';
import PeopleInDetentionController from './components/PeopleInDetentionController';
import DetentionLengthsController from './components/DetentionLengthsController';
import NewsController from './components/NewsController';

/**
 * Defined routes within the application
 *
 * @type {*[]}
 */
const routes = [
    { path: '/', name: 'index', component: IndexController },
    { path: '/detainee-origin', name: 'detainee-origin', component: DetaineeOriginController },
    { path: '/entering-detention', name: 'entering-detention', component: EnteringDetentionController },
    { path: '/leaving-detention', name: 'leaving-detention', component: LeavingDetentionController },
    { path: '/detention-centres', name: 'detention-centres', component: DetentionCentresController },
    { path: '/people-in-detention', name: 'people-in-detention', component: PeopleInDetentionController },
    { path: '/detention-lengths', name: 'detention-lengths', component: DetentionLengthsController },
    { path: '/references/:id?', name: 'references', component: ReferencesController },
    { path: '/news', name: 'news', component: NewsController },
];

const scrollBehavior = () => ({ x: 0, y: 0 });

export default new VueRouter({ routes, scrollBehavior });
