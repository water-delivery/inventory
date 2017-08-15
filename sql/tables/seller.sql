CREATE TYPE enum_seller_roles AS ENUM ('seller', 'admin');

CREATE TABLE public.sellers (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('sellers_id_seq'::regclass),
  "firstName" CHARACTER VARYING(255),
  "lastName" CHARACTER VARYING(255),
  password CHARACTER VARYING(255),
  avatar CHARACTER VARYING(255),
  contact CHARACTER VARYING(255) NOT NULL,
  "contactSecondary" CHARACTER VARYING(255),
  description CHARACTER VARYING(255),
  email CHARACTER VARYING(255),
  "verifiedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  roles ENUM_SELLER_ROLES NOT NULL DEFAULT 'seller'::enum_seller_roles
);
CREATE UNIQUE INDEX sellers_contact_key ON sellers USING BTREE (contact);
