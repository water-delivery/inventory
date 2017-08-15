CREATE TYPE "enum_orders_status" AS ENUM ('processing', 'dispatched', 'delivered', 'cancelled');
CREATE TYPE "enum_orders_paymentMethod" AS ENUM ('COD', 'PREPAID');
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL,
  status "enum_orders_status" DEFAULT 'processing'::"enum_orders_status" NOT NULL,
  slot INTEGER DEFAULT 16 NOT NULL,
  address VARCHAR(255) NOT NULL,
  "totalPrice" INTEGER NOT NULL,
  "paymentMethod" "enum_orders_paymentMethod" DEFAULT 'COD'::"enum_orders_paymentMethod" NOT NULL,
  "expectedDeliveryDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "actualDeliveryDate" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
