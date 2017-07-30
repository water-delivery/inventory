/* Put stuff that can't be done with migrations */

/* Add unique contraints */
-- ALTER TABLE "prices"
-- ADD CONSTRAINT uniq_prices_seller_product_location_key
-- UNIQUE ("sellerId", "productId", "locationId");
