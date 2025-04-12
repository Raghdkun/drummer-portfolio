"use client"

import DashboardLayout from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "sonner"

export default function PoliciesPage() {
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClientSupabaseClient()

  const updatePolicies = async () => {
    setIsUpdating(true)
    try {
      // SQL to update RLS policies
      const sql = `
      -- Update RLS policies to allow authenticated users to perform all operations

      -- For site_config table
      DROP POLICY IF EXISTS "Public can view site_config" ON site_config;
      DROP POLICY IF EXISTS "Authenticated users can manage site_config" ON site_config;

      CREATE POLICY "Public can view site_config" 
      ON site_config FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage site_config" 
      ON site_config FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);

      -- For profile table
      DROP POLICY IF EXISTS "Public can view profile" ON profile;
      DROP POLICY IF EXISTS "Authenticated users can manage profile" ON profile;

      CREATE POLICY "Public can view profile" 
      ON profile FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage profile" 
      ON profile FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);

      -- For specialties table
      DROP POLICY IF EXISTS "Public can view specialties" ON specialties;
      DROP POLICY IF EXISTS "Authenticated users can manage specialties" ON specialties;

      CREATE POLICY "Public can view specialties" 
      ON specialties FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage specialties" 
      ON specialties FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);

      -- For instruments table
      DROP POLICY IF EXISTS "Public can view instruments" ON instruments;
      DROP POLICY IF EXISTS "Authenticated users can manage instruments" ON instruments;

      CREATE POLICY "Public can view instruments" 
      ON instruments FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage instruments" 
      ON instruments FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);

      -- For stats table
      DROP POLICY IF EXISTS "Public can view stats" ON stats;
      DROP POLICY IF EXISTS "Authenticated users can manage stats" ON stats;

      CREATE POLICY "Public can view stats" 
      ON stats FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage stats" 
      ON stats FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);

      -- For media table
      DROP POLICY IF EXISTS "Public can view media" ON media;
      DROP POLICY IF EXISTS "Authenticated users can manage media" ON media;

      CREATE POLICY "Public can view media" 
      ON media FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage media" 
      ON media FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);

      -- For events table
      DROP POLICY IF EXISTS "Public can view events" ON events;
      DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;

      CREATE POLICY "Public can view events" 
      ON events FOR SELECT 
      USING (true);

      CREATE POLICY "Authenticated users can manage events" 
      ON events FOR ALL 
      TO authenticated 
      USING (true)
      WITH CHECK (true);
      `

      const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

      if (error) throw error
      toast.success("RLS policies updated successfully")
    } catch (error) {
      console.error("Error updating policies:", error)
      toast.error("Failed to update RLS policies")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Database Policies</h1>
        <p className="text-zinc-400">
          Update Row Level Security (RLS) policies to ensure proper access control for your database.
        </p>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Row Level Security Policies</CardTitle>
            <CardDescription>
              These policies control who can view, create, update, and delete data in your database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-zinc-800 rounded-lg">
              <h3 className="font-medium mb-2">Current Policy Configuration</h3>
              <p className="text-sm text-zinc-400 mb-4">
                The default policies allow public read access to all tables and full access for authenticated users.
              </p>
              <p className="text-sm text-zinc-400 mb-4">
                If you're experiencing permission issues when seeding or managing data, you may need to update these
                policies.
              </p>
            </div>

            <Button onClick={updatePolicies} className="w-full bg-rose-500 hover:bg-rose-600" disabled={isUpdating}>
              {isUpdating ? "Updating Policies..." : "Update RLS Policies"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
