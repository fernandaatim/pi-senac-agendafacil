-- AgendaFácil: rode este arquivo inteiro no Supabase (SQL Editor > New query > Run)
create extension if not exists btree_gist;

create table profiles(
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('profissional','cliente')),
  nome text not null, telefone text, bio text,
  dias int[] default '{2,3,4,5,6}', ini text default '09:00', fim text default '18:00', alm text default '12:00');

create table servicos(
  id bigint generated always as identity primary key,
  prof_id uuid not null references profiles on delete cascade,
  nome text not null, dur int not null check (dur > 0), preco numeric default 0);

create table agendamentos(
  id bigint generated always as identity primary key,
  prof_id uuid not null references profiles,
  cliente_id uuid not null references profiles,
  servico_id bigint references servicos on delete set null,
  inicio timestamp not null, fim timestamp not null check (fim > inicio),
  status text not null default 'confirmado' check (status in ('confirmado','cancelado')),

  exclude using gist (prof_id with =, tsrange(inicio, fim) with &&) where (status <> 'cancelado'),
  exclude using gist (cliente_id with =, tsrange(inicio, fim) with &&) where (status <> 'cancelado'));

-- cria o perfil automaticamente no cadastro
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, nome, role) values (new.id,
    coalesce(new.raw_user_meta_data->>'nome','Sem nome'),
    case when new.raw_user_meta_data->>'role' = 'profissional' then 'profissional' else 'cliente' end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function ocupados(p uuid) returns table(inicio timestamp, fim timestamp)
language sql security definer set search_path = public as $$
  select inicio, fim from agendamentos where prof_id = p and status <> 'cancelado' and fim > now() $$;
grant execute on function ocupados(uuid) to authenticated;

alter table profiles enable row level security;
alter table servicos enable row level security;
alter table agendamentos enable row level security;

create policy "ver perfis" on profiles for select to authenticated using (
  role = 'profissional' or id = auth.uid()
  or exists (select 1 from agendamentos a where a.prof_id = auth.uid() and a.cliente_id = profiles.id));
create policy "editar meu perfil" on profiles for update to authenticated using (id = auth.uid());
revoke update on profiles from authenticated;
grant update (nome, telefone, bio, dias, ini, fim, alm) on profiles to authenticated;

create policy "ver servicos" on servicos for select to authenticated using (true);
create policy "gerir meus servicos" on servicos for all to authenticated
  using (prof_id = auth.uid()) with check (prof_id = auth.uid());

create policy "ver meus agendamentos" on agendamentos for select to authenticated
  using (cliente_id = auth.uid() or prof_id = auth.uid());
create policy "cliente agenda" on agendamentos for insert to authenticated with check (cliente_id = auth.uid());
create policy "cancelar" on agendamentos for update to authenticated
  using (cliente_id = auth.uid() or prof_id = auth.uid());
create policy "excluir" on agendamentos for delete to authenticated
  using (cliente_id = auth.uid() or prof_id = auth.uid());
revoke update on agendamentos from authenticated;
grant update (status) on agendamentos to authenticated;
