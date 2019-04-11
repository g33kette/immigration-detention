import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faMale,
    faFemale,
    faChild, faCircleNotch, faUndo, faChevronDown, faQuestionCircle, faPlay, faStop, faBackward, faForward,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Load Icons
 */
export function loadIcons() {
    library.add(faMale);
    library.add(faFemale);
    library.add(faChild);
    library.add(faCircleNotch);
    library.add(faUndo);
    library.add(faChevronDown);
    library.add(faQuestionCircle);
    library.add(faPlay);
    library.add(faStop);
    library.add(faForward);
    library.add(faBackward);
}
