-- Valoración externa de un restaurante (p.ej. Google Business): puramente
-- informativa, nunca se mezcla con las reseñas propias de NovaCore (tabla
-- reviews, con su propio flujo de moderación). Se mantiene a mano desde el
-- panel del propietario o NovaCore — esta fase no la sincroniza sola.

alter table restaurants
  add column external_rating numeric(2, 1) check (external_rating between 0 and 5),
  add column external_rating_count integer check (external_rating_count >= 0),
  add column external_review_source text;

comment on column restaurants.external_rating is
  'Valoración de una fuente externa (p.ej. Google), informativa. No se calcula ni se modera aquí.';
comment on column restaurants.external_review_source is
  'Texto corto identificando la fuente, p.ej. "Google". NULL = no se muestra el bloque.';
