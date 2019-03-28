import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faMale,
    faFemale,
    faChild, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Load Icons
 */
export function loadIcons() {
    library.add(faMale);
    library.add(faFemale);
    library.add(faChild);
    library.add(faExclamationTriangle);
}
