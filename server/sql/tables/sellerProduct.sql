/* Put stuff that can't be done with migrations */


CREATE TABLE "sellerProduct" (
  id SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  "sellerId" INTEGER NOT NULL,
  "locationId" INTEGER NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "sellerProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES products (id),
  CONSTRAINT "sellerProduct_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES sellers (id),
  CONSTRAINT "sellerProduct_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES locations (id)
);
CREATE UNIQUE INDEX uniq_seller_product_location_key ON "sellerProduct" ("sellerId", "productId", "locationId");

/* Add unique contraints */
-- ALTER TABLE "sellerProduct"
-- ADD CONSTRAINT uniq_seller_product_location_key
-- UNIQUE ("sellerId", "productId", "locationId");
