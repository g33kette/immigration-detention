<!--
 * Citation Component
-->
<template>
    <router-link :to="'/references/'+ref" class="citation">[{{ ref }}] {{ citation}}</router-link>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Citation',
    props: {
        tag: { required: true, type: String },
    },
    computed: {
        ...mapGetters([
            'referenceId',
            'reference',
        ]),
        ref() {
            const ref = this.referenceId(this.tag);
            if (!ref) {
                console.warn('No reference found for tag "'+this.tag+'"');
            }
            return ref;
        },
        citation() {
            return this.reference(this.ref).citation;
        },
    },
};
</script>

<style lang="scss">
    a.citation {
        font-size: .9rem;
    }
</style>

