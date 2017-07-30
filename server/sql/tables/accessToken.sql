CREATE TABLE public."accessTokens" (
  id SERIAL PRIMARY KEY,
  token CHARACTER VARYING(255) NOT NULL,
  "sellerId" INTEGER NOT NULL,
  device CHARACTER VARYING(255),
  latitude INTEGER,
  longitude INTEGER,
  ip CHARACTER VARYING(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT
);
CREATE UNIQUE INDEX "accessTokens_token_key" ON "accessTokens" USING BTREE (token);
