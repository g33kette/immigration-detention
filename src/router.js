
import VueRouter from 'vue-router';

import IndexController from './components/IndexController';
import DetaineeOriginController from './components/DetaineeOriginController';
import LeavingEnteringDetentionController from './components/LeavingEnteringDetentionController';
import ReferencesController from './components/ReferencesController';
import DetentionCentresController from './components/DetentionCentresController';
import PeopleInDetentionController from './components/PeopleInDetentionController';
import DetentionLengthsController from './components/DetentionLengthsController';

/**
 * Defined routes within the application
 *
 * @type {*[]}
 */
const routes = [
    { path: '/', name: 'index', component: IndexController },
    { path: '/detainee-origin', name: 'detainee-origin', component: DetaineeOriginController },
    {
        path: '/leaving-entering-detention',
        name: 'leaving-entering-detention',
        component: LeavingEnteringDetentionController,
    },
    { path: '/detention-centres', name: 'detention-centres', component: DetentionCentresController },
    { path: '/people-in-detention', name: 'people-in-detention', component: PeopleInDetentionController },
    { path: '/detention-lengths', name: 'detention-lengths', component: DetentionLengthsController },
    { path: '/references/:id?', name: 'references', component: ReferencesController },
];

export default new VueRouter({ routes });
