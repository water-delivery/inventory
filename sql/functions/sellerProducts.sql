CREATE OR REPLACE FUNCTION sellerProducts(
  sellerId INTEGER,
  limitTo INTEGER DEFAULT 30,
  skip INTEGER DEFAULT 0
)
  RETURNS JSONB
AS $$

DECLARE
  response JSONB;

BEGIN
  SELECT ARRAY_TO_JSON(
             ARRAY_AGG(
                 ROW_TO_JSON(products)
             )
         ) AS records INTO response
  FROM (
         SELECT
           p.*,
           JSON_AGG(
               JSON_BUILD_OBJECT(
                   'locationId', "locationId",
                   'price', amount
               )
           ) AS "priceMap"
         FROM "sellerProduct" sp
           INNER JOIN products p
             ON p.id = sp."productId"
           INNER JOIN prices pr
             ON pr."sellerProductId" = sp.id
         WHERE "sellerId" = sellerId
         GROUP BY p.id
         LIMIT limitTo OFFSET skip
       ) AS products;

  RETURN response;
END;
$$ LANGUAGE 'plpgsql';
