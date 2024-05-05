<template>
    <div id="loaderr" v-show="showError">
      <p>
        プログラムのロードでエラーが発生しました。<br>
        お使いのブラウザでは実行できない可能性があります。<br>
        リロードして問題が解決しない場合は、<br>
        Google Chromeなど最新のブラウザでアクセスしてみてください。
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const showError = ref(false);
  
  onMounted(() => {
    if (typeof Majiang === 'undefined') {
      showError.value = true;
    }
  });
  </script>
  
  <style scoped>
  #loaderr {
    display: none; /* 初期状態では非表示 */
  }
  </style>
  