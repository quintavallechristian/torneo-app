
insert into public.roles (name)
values
  ('Admin'),
  ('PlaceManager'),
  ('User');


insert into public.user_actions (action)
values
  ('manage:platform'),
  ('manage:places');