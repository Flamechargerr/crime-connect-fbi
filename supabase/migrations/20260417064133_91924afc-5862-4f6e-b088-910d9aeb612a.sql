-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'analyst', 'officer');
CREATE TYPE public.case_status AS ENUM ('open', 'investigating', 'closed', 'cold');
CREATE TYPE public.case_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.threat_level AS ENUM ('low', 'medium', 'high', 'extreme');
CREATE TYPE public.criminal_status AS ENUM ('at_large', 'in_custody', 'incarcerated', 'deceased');
CREATE TYPE public.evidence_type AS ENUM ('physical', 'digital', 'biological', 'document', 'weapon', 'other');
CREATE TYPE public.officer_status AS ENUM ('active', 'on_leave', 'inactive');

-- =========================================================================
-- updated_at helper
-- =========================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =========================================================================
-- PROFILES
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  badge_number TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- ROLES
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================================================================
-- OFFICERS
-- =========================================================================
CREATE TABLE public.officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  badge_number TEXT NOT NULL UNIQUE,
  rank TEXT,
  division TEXT,
  email TEXT,
  phone TEXT,
  status officer_status NOT NULL DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_officers_updated BEFORE UPDATE ON public.officers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- CRIMINALS
-- =========================================================================
CREATE TABLE public.criminals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  alias TEXT,
  date_of_birth DATE,
  gender TEXT,
  nationality TEXT,
  threat_level threat_level NOT NULL DEFAULT 'medium',
  status criminal_status NOT NULL DEFAULT 'at_large',
  mugshot_url TEXT,
  description TEXT,
  known_offenses TEXT[],
  last_known_location TEXT,
  most_wanted BOOLEAN NOT NULL DEFAULT false,
  reward_amount NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.criminals ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_criminals_updated BEFORE UPDATE ON public.criminals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- CASES
-- =========================================================================
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status case_status NOT NULL DEFAULT 'open',
  priority case_priority NOT NULL DEFAULT 'medium',
  category TEXT,
  location TEXT,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  assigned_officer_id UUID REFERENCES public.officers(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_cases_updated BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- EVIDENCE
-- =========================================================================
CREATE TABLE public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  evidence_type evidence_type NOT NULL DEFAULT 'physical',
  description TEXT,
  storage_location TEXT,
  collected_at TIMESTAMPTZ DEFAULT now(),
  collected_by UUID REFERENCES public.officers(id) ON DELETE SET NULL,
  chain_of_custody JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_evidence_updated BEFORE UPDATE ON public.evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================================
-- CASE <-> CRIMINALS join
-- =========================================================================
CREATE TABLE public.case_criminals (
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  criminal_id UUID NOT NULL REFERENCES public.criminals(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'suspect',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (case_id, criminal_id)
);
ALTER TABLE public.case_criminals ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- RLS POLICIES
-- =========================================================================

-- profiles
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- user_roles
CREATE POLICY "Roles viewable by authenticated" ON public.user_roles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- helper for read-by-authenticated, write-by-staff, delete-by-admin
-- officers
CREATE POLICY "Officers readable by authenticated" ON public.officers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff insert officers" ON public.officers
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Staff update officers" ON public.officers
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Admins delete officers" ON public.officers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- criminals
CREATE POLICY "Criminals readable by authenticated" ON public.criminals
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff insert criminals" ON public.criminals
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Staff update criminals" ON public.criminals
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Admins delete criminals" ON public.criminals
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- cases
CREATE POLICY "Cases readable by authenticated" ON public.cases
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff insert cases" ON public.cases
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Staff update cases" ON public.cases
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Admins delete cases" ON public.cases
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- evidence
CREATE POLICY "Evidence readable by authenticated" ON public.evidence
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff insert evidence" ON public.evidence
  FOR INSERT TO authenticated WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Staff update evidence" ON public.evidence
  FOR UPDATE TO authenticated USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
  );
CREATE POLICY "Admins delete evidence" ON public.evidence
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- case_criminals
CREATE POLICY "Links readable by authenticated" ON public.case_criminals
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage links" ON public.case_criminals
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst'));

-- =========================================================================
-- AUTH TRIGGER: auto-create profile + default role
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'analyst');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- INDEXES
-- =========================================================================
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_cases_priority ON public.cases(priority);
CREATE INDEX idx_cases_assigned_officer ON public.cases(assigned_officer_id);
CREATE INDEX idx_evidence_case ON public.evidence(case_id);
CREATE INDEX idx_criminals_status ON public.criminals(status);
CREATE INDEX idx_criminals_threat ON public.criminals(threat_level);
CREATE INDEX idx_criminals_most_wanted ON public.criminals(most_wanted) WHERE most_wanted = true;
