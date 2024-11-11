<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Escolha a forma de pagamento para {{ item.nome }}</h2>
      <button @click="confirmarPagamento('Pago')" class="btn btn-success">Dinheiro/Pix</button>
      <button @click="confirmarPagamento('Descontado no Caderno')" class="btn btn-warning">Descontar no Caderno</button>
      <button @click="$emit('fechar')" class="btn btn-secondary">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    item: Object
});

const emit = defineEmits(['fechar', 'confirmarPagamento']);

function confirmarPagamento(metodo) {
    emit('confirmarPagamento', props.item, metodo);
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
}
.btn {
    margin: 10px;
    padding: 10px;
    cursor: pointer;
}
</style>
