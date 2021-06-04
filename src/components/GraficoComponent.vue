<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Todo, Meta } from "./models";
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

// Componente con gráfico lineal de Chart.js
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["options"],

  mounted() {
    this.renderChart(this.chartData, this.options);
  },

  watch: {
  chartData () {
    console.log("datos grafico", this.chartData);
    this.$data._chart.update()
  }
}
};
</script>
