CREATE TABLE public.reviews (
  id SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  feedback CHARACTER VARYING(255),
  "userId" INTEGER NOT NULL,
  "firstName" CHARACTER VARYING(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY ("productId") REFERENCES public.products (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE UNIQUE INDEX "reviews_productId_userId_uindex" ON public.reviews ("productId", "userId");
