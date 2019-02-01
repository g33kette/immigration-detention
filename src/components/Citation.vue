<!--
 * Citation Component
-->
<template>
    <router-link :to="'/references/'+ref" class="citation">{{ ref }}</router-link>
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
        ]),
        ref() {
            const ref = this.referenceId(this.tag);
            if (!ref) {
                console.warn('No reference found for tag "'+this.tag+'"');
            }
            return ref;
        },
    },
};
</script>

<style lang="scss">
    a.citation {
        &::before {
            content: '[ ';
        }
        &::after {
            content: ' ]';
        }
        font-size: .9rem;
    }
</style>

