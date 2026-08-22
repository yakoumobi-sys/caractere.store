-- ============================================================================
-- YALIDINE COMPLETE INTEGRATION
-- ============================================================================

-- 1. Table inventory (stock management)
CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL UNIQUE,
  quantity integer NOT NULL DEFAULT 0,
  min_quantity integer DEFAULT 10,
  unit_price numeric(10,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Table clients (customer management separate from contacts)
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  address text,
  city text,
  postal_code text,
  client_type text DEFAULT 'retail', -- 'retail' or 'wholesale'
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Update pipeline_orders to support Yalidine orders
ALTER TABLE public.pipeline_orders
ADD COLUMN IF NOT EXISTS is_yalidine_order boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS yalidine_shipment_id text,
ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id);

-- 4. Yalidine shipments tracking
CREATE TABLE IF NOT EXISTS public.yalidine_shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.pipeline_orders(id),
  shipment_id text UNIQUE NOT NULL,
  tracking_number text,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_address text NOT NULL,
  client_city text NOT NULL,
  postal_code text NOT NULL,
  package_weight numeric(5,2),
  status text DEFAULT 'pending', -- pending, confirmed, picked_up, delivered, failed
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_product_name ON inventory(product_name);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);
CREATE INDEX IF NOT EXISTS idx_pipeline_orders_is_yalidine ON pipeline_orders(is_yalidine_order);
CREATE INDEX IF NOT EXISTS idx_yalidine_shipments_status ON yalidine_shipments(status);
