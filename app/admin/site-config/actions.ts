"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Database } from "@/types/supabase"

type SiteConfigInput = Omit<
  Database["public"]["Tables"]["site_config"]["Insert"],
  "id" | "created_at" | "updated_at"
>

export async function updateSiteConfig(data: SiteConfigInput) {
  try {
    const supabase = createServerSupabaseClient()

    // First check if site config already exists
    const { data: existingSiteConfig, error: fetchError } = await supabase
      .from("site_config")
      .select("id")
      .limit(1)
      .single()
      .then((response) => response)
      .catch(() => ({ data: null, error: null }))

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    let result
    if (existingSiteConfig) {
      // Update existing site config
      result = await supabase
        .from("site_config")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSiteConfig.id)
    } else {
      // Insert new site config
      result = await supabase.from("site_config").insert({
        id: "1",
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    if (result.error) throw result.error

    // Revalidate all pages that might use the site config
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    revalidatePath("/admin/site-config")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating site config:", error)
    return { success: false, error: (error as Error).message }
  }
}