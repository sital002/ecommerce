import { db } from "~/server/db";
import { faker } from "@faker-js/faker";
import type { Product, User } from "@prisma/client";

async function seed() {
  const users = createUser(50);
  const products = await createProduct(100);
  await db.product.createMany({
    data: products,
  });
  await db.user.createMany({
    data: users,
  });
}

seed()
  .then(() => {
    console.log("🌱 Seeded database");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

function createUser(length: number) {
  const users: User[] = [];
  for (let i = 0; i < length; i++) {
    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      emailVerified: Math.random() > 0.5 ? new Date() : null,
      name: faker.person.fullName(),
      image: faker.image.avatar(),
    });
  }
  return users;
}

async function createProduct(length: number) {
  const products: Product[] = [];
  const users = await db.user.findMany();
  const user = users[0]?.id ?? "";
  for (let i = 0; i < length; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      createdById: user,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: faker.string.uuid().toString(),
    });
  }
  return products;
}
