
module.exports = {
  apps: [
    {
      name: "checkout",
      script: "npx ts-node ../backend/checkout/src/main.ts"
    },
    {
      name: "auth",
      script: "npx ts-node ../backend/auth/src/main.ts"
    },
    {
      name: "catalog",
      script: "npx ts-node ../backend/catalog/src/main.ts"
    },
    {
      name: "freight",
      script: "npx ts-node ../backend/freight/src/main.ts"
    },
  ],


};
