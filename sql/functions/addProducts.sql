/**
 * Seller can add a product for multiple locations along with prices
 */
CREATE OR REPLACE FUNCTION addProducts(
  seller INTEGER,
  product INTEGER,
  priceMap TEXT
)
  RETURNS BOOLEAN
AS $$
DECLARE
  parsedMap JSONB;
BEGIN
  parsedMap := priceMap::JSONB;

  CREATE TEMP TABLE locationPriceMap (
    sellerId INTEGER,
    productId INTEGER,
    locationId INTEGER,
    amount FLOAT
  );

  INSERT INTO locationPriceMap (sellerId, productId, locationId, amount)
  SELECT seller, product, map."locationId", map.amount
  FROM jsonb_to_recordset(parsedMap) map("locationId" INTEGER, amount FLOAT);

  INSERT INTO "sellerProduct" ("productId", "sellerId", "locationId", "createdAt", "updatedAt")
  SELECT productId, sellerId, locationId, now(), now()
  FROM locationPriceMap
    ON CONFLICT DO NOTHING;

  INSERT INTO "prices" ("sellerProductId", amount, "createdAt", "updatedAt")
  SELECT sp.id, amount, now(), now()
  FROM locationPriceMap lpm
  INNER JOIN "sellerProduct" sp
    ON sp."sellerId" = lpm.sellerId
       AND sp."productId" = lpm.productId
       AND sp."locationId" = lpm.locationId
    ON CONFLICT ("sellerProductId")
      DO UPDATE
        SET amount = EXCLUDED.amount,
          "updatedAt" = now();
  -- drop temp tables
  DROP TABLE locationPriceMap;
  RETURN true;
END;
$$ LANGUAGE 'plpgsql';

