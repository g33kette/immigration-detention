<!--
 * ReferencesController
-->
<template>
    <div class="component-index-controller uk-container">
        <h2 class="uk-h1 uk-margin-top">
            References
        </h2>
        <div class="uk-section-small uk-section-muted uk-padding">
            <div v-for="(ref, i) in references" :id="i+1" :key="i"
                 class="uk-card uk-card-default uk-card-body uk-margin uk-width-1-1 uk-card-small uk-text-small ref">
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

            <p class="uk-margin-large-top">
                <!-- eslint-disable-next-line -->
                <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@yejinghan?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Ye Jinghan"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Ye Jinghan</span></a>
                <span class="uk-margin-left">Background image from Ye Jinghan used with thanks.</span>
            </p>
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

