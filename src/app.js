import Vue from "vue";
import { install as ResponsivePreviewContainer } from "./index";

Vue.use(ResponsivePreviewContainer);

new Vue({ el: "#app" });
