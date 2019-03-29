<!--
 * IndexController
 *
 * Index/home page
-->
<template>
    <div class="component-index-controller">
        <div uk-grid>
            <div class="uk-width-2-3">
                <div class="detainees uk-card uk-card-default uk-padding uk-text-center uk-text-bottom">
                    <h3 class="uk-heading-divider uk-h3">
                        People Detained Under UK Immigration Law <span class="uk-text-muted">Throughout 2018</span>
                    </h3>
                    <div uk-grid>
                        <div class="uk-width-1-3 uk-inline">
                            <div class="">
                                <font-awesome-icon icon="male" size="10x" />
                                <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large">
                                    <span class="uk-text-secondary uk-text-bold">{{ men | numberFormat }}</span> Men
                                </p>
                            </div>
                        </div>
                        <div class="uk-width-1-3 uk-inline">
                            <div class="uk-position-bottom">
                                <font-awesome-icon icon="female" size="8x" />
                                <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large">
                                    <span class="uk-text-secondary uk-text-bold">{{ women | numberFormat }}</span> Women
                                </p>
                            </div>
                        </div>
                        <div class="uk-width-1-3 uk-inline">
                            <div class="uk-position-bottom">
                                <font-awesome-icon icon="child" size="5x" />
                                <p class="uk-text-emphasis uk-alert uk-alert-primary uk-text-large">
                                    <span class="uk-text-secondary uk-text-bold">{{ children | numberFormat }}</span> Children
                                </p>
                            </div>
                        </div>
                    </div>
                    <citation tag="detention-stats" class="uk-align-right" />
                </div>
            </div>
            <div class="uk-width-1-3">
                <p class="uk-h2">
                    Immigration Detention:
                    <!--<span class="uk-text-small uk-light">(noun)</span>-->
                    <br>
                    <span class="uk-text-muted">
                        Home Office practice of detaining asylum seekers and others to pursue immigration-related purposes.<br>
                        It is an administrative process rather than a criminal procedure.
                    </span><br>
                    <citation tag="migration-observatory-1" />
                <!--The reasons to hold someone in immigration detention include one or more of the following: to effect a
                person’s removal; to establish their identity or basis of immigration/asylum claim; where there is reason to
                believe that the person will fail to comply with any conditions attached to the grant of temporary admission
                or release, i.e. a risk of absconding; or where there is a risk of harm through trafficking or to the
                public. There are also occasions when the reasons for a person’s detention change while he or she is already
                being held.-->
                </p>
            </div>
            <div class="uk-width-1-1">
                <div class="more-links uk-section uk-section-secondary uk-section-small uk-padding-small uk-text-large uk-preserve-color">
                    <div uk-grid>
                        <div class="uk-width-1-1">
                            <h3 class="uk-heading-bullet uk-text-emphasis">Find out more:</h3>
                        </div>
                        <!--<div class="uk-width-auto">-->
                            <!--<a class="uk-button uk-button-primary  uk-width-medium uk-height-1-1">-->
                                <!--Origin of Detainees-->
                            <!--</a>-->
                        <!--</div>-->
                        <!--<div class="uk-width-auto">-->
                            <!--<a class="uk-button uk-button-primary  uk-width-medium uk-height-1-1">-->
                                <!--Detentions Over Time-->
                            <!--</a>-->
                        <!--</div>-->
                        <!--<div class="uk-width-auto">-->
                            <!--<a class="uk-button uk-button-primary  uk-width-medium uk-height-1-1">-->
                                <!--People Entering/Leaving Detention-->
                            <!--</a>-->
                        <!--</div>-->
                        <!--<div class="uk-width-auto">-->
                            <!--<a class="uk-button uk-button-primary  uk-width-medium uk-height-1-1">-->
                                <!--Detention Centres-->
                            <!--</a>-->
                        <!--</div>-->
                        <!--<div class="uk-width-auto">-->
                            <!--<a class="uk-button uk-button-primary  uk-width-medium uk-height-1-1">-->
                                <!--Prosecutions for Immigration Offences-->
                            <!--</a>-->
                        <!--</div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Citation from './Citation';
import { mapGetters } from 'vuex';
export default {
    name: 'IndexController',
    components: { Citation },
    data() {
        return {
            men: 28397,
            women: 5605,
            children: 43,
        };
    },
    computed: {
        ...mapGetters([
            'referenceId',
        ]),
    },
    filters: {
        numberFormat: function(value) {
            if (isNaN(parseInt(value))) return value;
            return (new Intl.NumberFormat('en-GB', {})).format(value);
        },
    },
};
</script>

<style lang="scss" scoped>
    //@import './assets/scss/variables.scss';
    .more-links {
        .uk-button {
            text-transform: none;
            font-size: .8em;
        }
    }
</style>

