/* Put stuff that can't be done with migrations */

/* Add unique contraints */
ALTER TABLE "sellerProduct"
ADD CONSTRAINT uniq_seller_product_location_key
UNIQUE ("sellerId", "productId", "locationId");
