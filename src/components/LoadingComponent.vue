<template>
  <div class="loading">
    {{ message }}
    <svg
 v-if="isShowLoader"
      style="
        margin: auto;
        background: rgb(241, 242, 243);
        display: block;
        shape-rendering: auto;
      "
      width="20px"
      height="20px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      fill="transparent"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#5f2a62"
        stroke-width="14"
        r="35"
        stroke-dasharray="164.93361431346415 56.97787143782138"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: "LoadingComponent",
  props: {
    message: {
      type: String,
      default: "Loading",
    },
    isShowLoader:{
      type:Boolean,
      default:true
}
  },
};
</script>

<style scoped></style>
