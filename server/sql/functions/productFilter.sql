CREATE OR REPLACE FUNCTION productFilter(
  locationId INTEGER DEFAULT NULL,
  limitTo integer DEFAULT 30,
  skip integer DEFAULT 0
)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$

DECLARE
  response JSONB;

BEGIN
  SELECT array_to_json(
    array_agg(
      row_to_json(results)
    )
  ) AS records INTO response
  FROM (
    SELECT res."productId" AS id,
      res.name,
      res.avatar,
      res.description,
      res.meta,
      res.capacity,
      res.address,
      JSON_BUILD_OBJECT(
        'id', s.id,
        'firstName', "firstName",
        'lastName', "lastName",
        'avatar', s.avatar,
        'description', s.description,
        'contact', s.contact
      ) AS seller,
      JSON_BUILD_OBJECT(
        'id', l.id,
        'name', l.name,
        'pinCode', "pinCode",
        'description', l.description,
        'city', city
      ) AS location,
      res.amount AS price
    FROM (
      SELECT p.*, sp.*, pr.amount, rank() over(PARTITION BY p.id ORDER BY pr.amount) rank
      FROM "products" p
      INNER JOIN "sellerProduct" sp
        ON sp."productId" = p.id
      INNER JOIN prices pr
        ON pr."sellerProductId" = sp.id
      WHERE p."verifiedAt" IS NOT NULL AND (locationId IS NULL OR sp."locationId" = locationId)
    ) AS res
    INNER JOIN sellers s ON res."sellerId" = s.id
    INNER JOIN locations l ON res."locationId" = l.id
    WHERE rank = 1
    LIMIT limitTo OFFSET skip
  ) results;
  RETURN response;
END;
$function$;

