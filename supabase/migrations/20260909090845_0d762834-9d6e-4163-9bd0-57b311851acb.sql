CREATE TYPE public.species_category AS ENUM ('birds','mammals_small','mammals_medium','fawns','reptiles');
CREATE TYPE public.capacity_status AS ENUM ('open','full','by_appointment');

CREATE TABLE public.centers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.center_species_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  center_id UUID NOT NULL REFERENCES public.centers(id) ON DELETE CASCADE,
  species public.species_category NOT NULL,
  status public.capacity_status NOT NULL DEFAULT 'open',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (center_id, species)
);

GRANT SELECT ON public.centers TO anon, authenticated;
GRANT ALL ON public.centers TO service_role;
GRANT SELECT, UPDATE ON public.center_species_status TO anon, authenticated;
GRANT ALL ON public.center_species_status TO service_role;

ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.center_species_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view centers" ON public.centers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can view statuses" ON public.center_species_status FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can update statuses" ON public.center_species_status FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_status_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER trg_touch_status BEFORE UPDATE ON public.center_species_status FOR EACH ROW EXECUTE FUNCTION public.touch_status_updated_at();

ALTER TABLE public.center_species_status REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.center_species_status;