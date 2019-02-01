<!--
 * ReferencesController
-->
<template>
    <div class="component-index-controller uk-container">
        <h1 class="uk-h1 uk-margin-top">
            References
        </h1>
        <div class="uk-section-small uk-section-muted uk-padding">
            <div v-for="(ref, i) in references" :id="i+1" :key="i"
                 class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-card-small uk-text-small ref">
                <p class="ref-id uk-align-right">[ {{ i+1 }} ]</p>
                <p class="ref-title">{{ ref.title }}</p>
                <p class="ref-date-published uk-align-right"> Publication Date: {{ ref.datePublished }}</p>
                <p class="ref-author">{{ ref.author }}</p>
                <p v-if="ref.link" class="ref-link">
                    <a :href="ref.link" target="_blank">{{ ref.link }}</a>
                </p>
                <p v-if="ref.dateAccessed" class="ref-date-accessed">
                    Date Accessed: {{ ref.dateAccessed }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'ReferencesController',
    data() {
        return {};
    },
    computed: {
        ...mapGetters([
            'references',
        ]),
    },
};
</script>

<style lang="scss" scoped>
    @import './../assets/scss/variables';
    .ref {
        > * {
            margin-top: 0;
            margin-bottom: 0;
        }
        .ref-title, .ref-id {
            /*font-size: 1.2rem;*/
            font-weight: 600;
        }

        .ref-author {
            /*font-weight: 600;*/
        }

        .ref-date-published {
        }

        .ref-link {
        }

        .ref-date-accessed {
            color: $global-muted-color;
        }
    }
</style>

