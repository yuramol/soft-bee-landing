CREATE OR REPLACE FUNCTION public.create_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
BEGIN
  INSERT INTO public.users(
    id,
    first_name,
    last_name)
  VALUES(
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name');
  RETURN new;
END;
$function$;

CREATE TRIGGER create_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user();

