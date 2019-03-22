<!--
 * IndexController
 *
 * Index/home page
-->
<template>
    <div class="component-index-controller uk-container uk-container-large">
        <div uk-grid>
            <h1 class="uk-h2 uk-width-1-3">
                Immigration Detention:<br>
                <span class="uk-text-muted">
                    Detaining asylum seekers and others to
                    pursue immigration-related purposes.
                </span>
                <citation tag="migration-observatory-1" />
            <!--The reasons to hold someone in immigration detention include one or more of the following: to effect a
            person’s removal; to establish their identity or basis of immigration/asylum claim; where there is reason to
            believe that the person will fail to comply with any conditions attached to the grant of temporary admission
            or release, i.e. a risk of absconding; or where there is a risk of harm through trafficking or to the
            public. There are also occasions when the reasons for a person’s detention change while he or she is already
            being held.-->
            </h1>
            <div class="uk-section-small uk-section-muted uk-padding uk-width-2-3">
                <chart />
            </div>
        </div>
    </div>
</template>

<script>
import Chart from './Chart';
import Citation from './Citation';
import { mapGetters } from 'vuex';
export default {
    name: 'IndexController',
    components: { Chart, Citation },
    computed: {
        ...mapGetters([
            'referenceId',
        ]),
    },
};
</script>

