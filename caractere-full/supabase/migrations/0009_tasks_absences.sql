-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  created_by UUID REFERENCES employees(id)
);

-- Create employee_absences table
CREATE TABLE IF NOT EXISTS employee_absences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  absence_date DATE NOT NULL,
  justification TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(employee_id, absence_date)
);

-- Create employee_performance view for stats
CREATE OR REPLACE VIEW employee_stats AS
SELECT
  e.id,
  CONCAT(e.first_name, ' ', e.last_name) as name,
  COALESCE(COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END), 0) as completed_tasks,
  COALESCE(COUNT(DISTINCT CASE WHEN t.status IN ('todo', 'in_progress') THEN t.id END), 0) as pending_tasks,
  COALESCE(COUNT(DISTINCT ea.id), 0) as absences_count
FROM employees e
LEFT JOIN tasks t ON e.id = t.assigned_to
LEFT JOIN employee_absences ea ON e.id = ea.employee_id AND ea.absence_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY e.id, e.first_name, e.last_name;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_absences_employee ON employee_absences(employee_id);
CREATE INDEX IF NOT EXISTS idx_absences_date ON employee_absences(absence_date);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_absences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Employees can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = assigned_to);

CREATE POLICY "Admins can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update tasks" ON tasks
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for absences
CREATE POLICY "Employees can view their own absences" ON employee_absences
  FOR SELECT USING (auth.uid() = employee_id);

CREATE POLICY "Employees can create their own absences" ON employee_absences
  FOR INSERT WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Employees can update their own absences" ON employee_absences
  FOR UPDATE USING (auth.uid() = employee_id);
