-- Permet au staff (admin / opérateur) de journaliser les changements de statut.
-- Miroir versionné — à appliquer en base (via MCP ou SQL Editor).

create policy "Admin/opérateur journalisent" on public.order_events
  for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'operator'));
