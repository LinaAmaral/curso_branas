
<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from 'vue';

const products: any = ref([])
const total = ref(0)
const success: any = ref({});
const order: any = ref({
  idOrder: crypto.randomUUID(),
  cpf: "407.302.170-27",
  items: []
})

function addItem(product: any) {
  const existingItem = order.value.items.find((item: any) => item.idProduct === product.idProduct);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    order.value.items.push({ idProduct: product.idProduct, quantity: 1 })
  }
  total.value += product.price
}

async function checkout() {
  const response = await axios.post("http://localhost:3000/checkout", order.value)
  success.value = response.data
}

onMounted(async () => {
  const response = await axios.get("http://localhost:3000/products");
  products.value = response.data;
})

</script>

<template>
  <h1 class="module-name">Checkout</h1>
  <div v-for="product in products">
    <div class="product-description">{{ product.description }}</div>
    <div class="product-price">{{ product.price }}</div>
    <button class="product-add-button" @click="addItem(product)">Add</button>
  </div>

  <div class="total">
    {{ total }}
  </div>

  <div v-for="item in order.items">
    <div class="order-item">
      {{ item.idProduct }} {{ item.quantity }}
    </div>
  </div>

  <button class="checkout-button" @click="checkout()">Checkout</button>
  <div class="success">{{ success.total }}</div>
</template>

<style scoped></style>
