/* Put stuff that can't be done with migrations */

CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  "sellerProductId" INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  "isActive" BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "prices_sellerProductId_fkey" FOREIGN KEY ("sellerProductId") REFERENCES "sellerProduct" (id)
);
CREATE UNIQUE INDEX "prices_sellerProductId_key" ON prices ("sellerProductId");

/* Add unique contraints */
-- ALTER TABLE "prices"
-- ADD CONSTRAINT uniq_prices_seller_product_location_key
-- UNIQUE ("sellerId", "productId", "locationId");
