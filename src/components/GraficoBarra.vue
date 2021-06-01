<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Todo, Meta } from "./models";
import { HorizontalBar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: HorizontalBar,
  mixins: [reactiveProp],
  props: ["options"],

  mounted() {
    this.renderChart(this.chartData, this.options);
  },

  watch: {
  chartData () {
    this.$data._chart.update()
  }
}
};
</script>