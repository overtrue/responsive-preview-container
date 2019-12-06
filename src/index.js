import ResponsivePreviewContainer from "./ResponsivePreviewContainer";

export default ResponsivePreviewContainer;

function install(Vue) {
  Vue.component("responsive-preview-container", ResponsivePreviewContainer);
}

export { install };
