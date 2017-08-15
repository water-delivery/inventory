
CREATE OR REPLACE FUNCTION public.productFilter(
  locationId INTEGER DEFAULT NULL,
  limitTo    INTEGER DEFAULT 30,
  skip       INTEGER DEFAULT 0
)
  RETURNS JSONB
LANGUAGE plpgsql
AS $function$

DECLARE
  response JSONB;

BEGIN
  SELECT array_to_json(
             array_agg(
                 row_to_json(results)
             )
         ) AS records
  INTO response
  FROM (
         SELECT
           res."productId" AS id,
           res.name,
           res.avatar,
           res.description,
           res.meta,
           res.capacity,
           res.address,
           (CASE WHEN avg(rating) IS NOT NULL
             THEN JSON_BUILD_OBJECT(
                 'rating', avg(rating),
                 'count', count(r.*)
             )
            ELSE NULL END) AS reviews,
           JSON_BUILD_OBJECT(
               'id', s.id,
               'firstName', s."firstName",
               'lastName', "lastName",
               'avatar', s.avatar,
               'description', s.description,
               'contact', s.contact
           )               AS seller,
           JSON_BUILD_OBJECT(
               'id', l.id,
               'name', l.name,
               'pinCode', "pinCode",
               'description', l.description,
               'city', city
           )               AS location,
           res.amount      AS price
         FROM (
                SELECT
                  p.*,
                  sp.*,
                  pr.amount,
                  rank()
                  OVER (PARTITION BY p.id
                    ORDER BY pr."updatedAt", pr.amount) rank
                FROM "products" p
                  INNER JOIN "sellerProduct" sp
                    ON sp."productId" = p.id
                  INNER JOIN prices pr
                    ON pr."sellerProductId" = sp.id
                WHERE p."verifiedAt" IS NOT NULL AND (locationId IS NULL OR sp."locationId" = locationId)
              ) AS res
           INNER JOIN sellers s ON res."sellerId" = s.id
           INNER JOIN locations l ON res."locationId" = l.id
           LEFT JOIN reviews r ON r."productId" = res."productId"
         WHERE rank = 1
         GROUP BY res."productId",
           res.name,
           res.avatar,
           res.description,
           res.meta,
           res.capacity,
           res.address,
           res.amount,
           s.id,
           l.id
         LIMIT limitTo
         OFFSET skip
       ) results;
  RETURN response;
END;
$function$;
