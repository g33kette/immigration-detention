<!--
 * AnalysisController
-->
<template>
    <div class="component-analysis-controller uk-container">
        <div class="uk-section-small uk-section-muted uk-padding uk-width-1-1">
            <chart />
        </div>
    </div>
</template>

<script>
import Chart from './Chart';
export default {
    name: 'AnalysisController',
    components: { Chart },
};
</script>


