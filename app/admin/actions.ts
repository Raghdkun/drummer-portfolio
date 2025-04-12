"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from 'uuid';

// Update the seedProfile function to properly handle promises
export async function seedProfile() {
  try {
    const supabase = createServerSupabaseClient()

    const profile = {
      full_name: "Ameer Albarouky",
      stage_name: "Drummer 8amar",
      headline: "Professional Drummer & Percussionist",
      bio_short:
        "Ameer Albarouky is a renowned Syrian drummer with over 10 years of experience, specializing in Middle Eastern rhythms and contemporary percussion techniques.",
      bio_full:
        "Ameer Albarouky, known professionally as Drummer 8amar (قمر), is a renowned Syrian drummer with over a decade of experience in the music industry. His unique style blends traditional Middle Eastern rhythms with modern techniques, creating a distinctive sound that has captivated audiences worldwide.\n\nBeginning his journey at a young age, Ameer has performed with numerous acclaimed artists and bands across Syria and the Middle East. His passion for drumming extends beyond performance to education, where he has taught hundreds of aspiring drummers through workshops and private lessons.\n\nAmeer's performances are characterized by his energetic stage presence and technical prowess, making each show a memorable experience for his audience. His dedication to his craft has earned him recognition as one of Syria's most talented percussionists.",
      profile_image_url: "/placeholder.svg?height=600&width=500",
      cover_image_url: "/placeholder.svg?height=1200&width=800",
      years_experience: 10,
    }

    // First check if a profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profile")
      .select("id")
      .limit(1)
      .single()
      .then((response) => response)
      .catch(() => ({ data: null, error: null }))

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError
    }

    let result
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from("profile")
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProfile.id)
    } else {
      // Insert new profile
      result = await supabase.from("profile").insert({
        id: "1",
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    if (result.error) throw result.error

    // Ensure revalidation happens after the database operation
    await revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding profile:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Update the seedSiteConfig function to properly handle promises
export async function seedSiteConfig() {
  try {
    const supabase = createServerSupabaseClient()

    const siteConfig = {
      site_title: "Ameer Albarouky - Professional Drummer",
      site_description:
        "Official website of Ameer Albarouky, professional drummer and percussionist known as Drummer 8amar.",
      contact_email: "contact@ameeralbarouky.com",
      contact_phone: "+963 123 456 789",
      whatsapp_number: "+971 55 529 3876",
      location: "As Suwayda Syria",
      social_instagram: "https://instagram.com/drummer8amar",
      social_facebook: "https://facebook.com/drummer8amar",
      social_youtube: "https://youtube.com/drummer8amar",
    }

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
          ...siteConfig,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSiteConfig.id)
    } else {
      // Insert new site config
      result = await supabase.from("site_config").insert({
        id: "1",
        ...siteConfig,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    }

    if (result.error) throw result.error

    // Ensure revalidation happens after the database operation
    await revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding site config:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function seedSpecialties() {
  try {
    const supabase = createServerSupabaseClient()

    const specialties = [
      {
        name: "Middle Eastern Rhythms",
        description: "Traditional and contemporary rhythms from across the Middle East",
        icon_name: "Music",
        display_order: 1,
      },
      {
        name: "Jazz Percussion",
        description: "Modern jazz drumming techniques and improvisation",
        icon_name: "Drum",
        display_order: 2,
      },
      {
        name: "Live Performance",
        description: "Energetic and engaging live performances for various events",
        icon_name: "Mic2",
        display_order: 3,
      },
      {
        name: "Studio Recording",
        description: "Professional studio recording services for albums and singles",
        icon_name: "Headphones",
        display_order: 4,
      },
      {
        name: "Percussion Education",
        description: "Workshops and private lessons for aspiring drummers",
        icon_name: "GraduationCap",
        display_order: 5,
      },
    ]

    const { error } = await supabase.from("specialties").insert(
      specialties.map((specialty) => ({
        ...specialty,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    )

    if (error) throw error
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding specialties:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function seedInstruments() {
  try {
    const supabase = createServerSupabaseClient()

    const instruments = [
      {
        name: "Drum Kit",
        description: "Standard drum kit with cymbals and percussion accessories",
        display_order: 1,
      },
      {
        name: "Darbuka",
        description: "Traditional Middle Eastern goblet drum",
        display_order: 2,
      },
      {
        name: "Riq",
        description: "Middle Eastern tambourine with jingles",
        display_order: 3,
      },
      {
        name: "Cajon",
        description: "Box-shaped percussion instrument originally from Peru",
        display_order: 4,
      },
      {
        name: "Djembe",
        description: "West African hand drum with a distinctive sound",
        display_order: 5,
      },
    ]

    const { error } = await supabase.from("instruments").insert(
      instruments.map((instrument) => ({
        ...instrument,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    )

    if (error) throw error
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding instruments:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function seedStats() {
  try {
    const supabase = createServerSupabaseClient()

    const stats = [
      {
        stat_name: "Performances",
        stat_value: "150+",
        icon_name: "Drum",
        description: "Live performances across the Middle East",
        display_order: 1,
      },
      {
        stat_name: "Awards",
        stat_value: "12",
        icon_name: "Award",
        description: "Recognition for musical excellence",
        display_order: 2,
      },
      {
        stat_name: "Collaborations",
        stat_value: "20+",
        icon_name: "Music",
        description: "Projects with renowned artists",
        display_order: 3,
      },
      {
        stat_name: "Students",
        stat_value: "1000+",
        icon_name: "Users",
        description: "Aspiring drummers taught and mentored",
        display_order: 4,
      },
    ]

    const { error } = await supabase.from("stats").insert(
      stats.map((stat) => ({
        ...stat,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    )

    if (error) throw error
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding stats:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function seedEvents() {
  try {
    const supabase = createServerSupabaseClient()

    const events = [
      {
        title: "Rhythm & Soul Festival",
        description:
          "Join Drummer 8amar for an unforgettable night of rhythm and percussion at the annual Rhythm & Soul Festival.",
        event_date: new Date().toISOString().split("T")[0],
        event_time: "8:00 PM",
        location: "Damascus Opera House, Syria",
        venue_name: "Damascus Opera House",
        image_url: "/placeholder.svg?height=400&width=600",
        is_featured: true,
        is_upcoming: true,
        event_type: "performance",
        duration: "2 hours",
        capacity: "500 people",
        age_restriction: "All ages",
        event_details:
          "The Rhythm & Soul Festival is an annual celebration of percussion and rhythm, featuring some of the most talented drummers from across the Middle East. This year's festival will showcase a variety of drumming styles, from traditional Arabic rhythms to contemporary fusion performances.\n\nDrummer 8amar will headline the event with a special performance that combines traditional Syrian rhythms with modern techniques, creating a unique and captivating experience for all attendees.",
        event_highlights: [
          "Special headline performance by Drummer 8amar",
          "Collaborative performances with guest musicians",
          "Showcase of traditional Middle Eastern percussion instruments",
          "Interactive rhythm section with audience participation",
        ],
        performer_notes:
          "Ameer Albarouky, known professionally as Drummer 8amar, is a renowned Syrian drummer with over a decade of experience in the music industry. His performances are characterized by high energy, technical precision, and a deep connection with the audience.",
        additional_images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        faq: [
          {
            question: "Is there parking available at the venue?",
            answer:
              "Yes, the Damascus Opera House has a parking lot available for attendees. We recommend arriving early as spaces fill up quickly.",
          },
          {
            question: "Are food and drinks available at the event?",
            answer: "Yes, there will be a variety of food and beverage options available for purchase at the venue.",
          },
          {
            question: "Can I take photos during the performance?",
            answer:
              "Photography without flash is permitted. Professional photography equipment requires prior approval.",
          },
        ],
      },
      {
        title: "Middle Eastern Beats Workshop",
        description:
          "Learn the fundamentals of Middle Eastern percussion in this hands-on workshop led by Ameer Albarouky.",
        event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        event_time: "4:00 PM",
        location: "Music Academy, Aleppo",
        venue_name: "Music Academy",
        image_url: "/placeholder.svg?height=400&width=600",
        is_featured: false,
        is_upcoming: true,
        event_type: "workshop",
        duration: "3 hours",
        capacity: "30 participants",
        age_restriction: "12+",
        event_details:
          "This workshop is designed for drummers of all skill levels who are interested in learning Middle Eastern percussion techniques. Participants will explore traditional rhythms, hand positioning, and various percussion instruments commonly used in Middle Eastern music.\n\nLed by Ameer Albarouky, this interactive workshop will provide hands-on experience and personalized guidance. By the end of the session, participants will have learned several fundamental Middle Eastern rhythms and will be able to apply these techniques to their own playing.",
        event_highlights: [
          "Learn authentic Middle Eastern rhythms",
          "Hands-on experience with traditional percussion instruments",
          "Small group setting for personalized instruction",
          "Take-home practice materials",
        ],
        performer_notes:
          "Ameer Albarouky is not only a skilled performer but also an experienced educator who has taught percussion to students of all ages and skill levels. His teaching approach emphasizes proper technique, cultural context, and creative expression.",
        additional_images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
        faq: [
          {
            question: "Do I need to bring my own instrument?",
            answer:
              "Basic percussion instruments will be provided, but you're welcome to bring your own if you prefer.",
          },
          {
            question: "Is prior drumming experience required?",
            answer: "No, this workshop is suitable for beginners as well as more experienced drummers.",
          },
          {
            question: "Will there be a recording of the workshop available?",
            answer: "Yes, participants will receive access to a video recording of the key techniques demonstrated.",
          },
        ],
      },
      {
        title: "Summer Concert Series",
        description: "Experience the magic of live drumming against the backdrop of the historic Citadel of Damascus.",
        event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        event_time: "7:30 PM",
        location: "Citadel of Damascus, Syria",
        venue_name: "Citadel of Damascus",
        image_url: "/placeholder.svg?height=400&width=600",
        is_featured: false,
        is_upcoming: true,
        event_type: "performance",
        duration: "90 minutes",
        capacity: "300 people",
        age_restriction: "All ages",
        event_details:
          "The Summer Concert Series at the historic Citadel of Damascus brings together exceptional musical talent against the backdrop of one of Syria's most iconic landmarks. This outdoor concert will feature Drummer 8amar performing a mix of traditional and contemporary pieces that showcase the rich percussion heritage of the region.\n\nAs the sun sets over the ancient citadel, attendees will be treated to a mesmerizing performance that combines rhythmic intensity with the natural acoustics of this historic venue.",
        event_highlights: [
          "Unique outdoor setting at a historic landmark",
          "Special sunset performance",
          "Collaboration with local string musicians",
          "Mix of traditional and contemporary compositions",
        ],
        performer_notes:
          "For this special performance, Drummer 8amar will be joined by a small ensemble of local musicians, creating a unique fusion of percussion and string instruments that highlights the versatility and emotional range of Middle Eastern music.",
        additional_images: [
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
          "/placeholder.svg?height=600&width=800",
        ],
        faq: [
          {
            question: "What happens in case of rain?",
            answer:
              "In case of inclement weather, the performance will be moved to the indoor hall at the Damascus Cultural Center. Ticket holders will be notified via email.",
          },
          {
            question: "Are there seating arrangements?",
            answer:
              "Yes, seating is provided and is assigned on a first-come, first-served basis within ticket categories.",
          },
          {
            question: "Is the venue accessible for people with mobility challenges?",
            answer:
              "The venue has limited accessibility. Please contact us in advance if you require special accommodations.",
          },
        ],
      },
      {
        title: "Past Performance 1",
        description: "A memorable past performance at the Damascus Music Festival.",
        event_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        event_time: "7:00 PM",
        location: "Damascus, Syria",
        venue_name: "Damascus Music Hall",
        image_url: "/placeholder.svg?height=300&width=300",
        is_featured: false,
        is_upcoming: false,
        event_type: "performance",
        duration: "2 hours",
        event_details:
          "This was a highlight performance at the annual Damascus Music Festival, featuring a special collaboration with several renowned Syrian musicians. The performance explored the intersection of traditional Syrian rhythms with contemporary musical expressions.",
        event_highlights: [
          "Collaboration with the Syrian Philharmonic Orchestra",
          "Premiere of original composition 'Echoes of Damascus'",
          "Standing ovation and encore performance",
        ],
      },
      {
        title: "Past Performance 2",
        description: "A memorable past performance at the Aleppo Cultural Center.",
        event_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        event_time: "8:00 PM",
        location: "Aleppo, Syria",
        venue_name: "Aleppo Cultural Center",
        image_url: "/placeholder.svg?height=300&width=300",
        is_featured: false,
        is_upcoming: false,
        event_type: "performance",
        duration: "90 minutes",
        event_details:
          "This intimate performance at the Aleppo Cultural Center showcased the versatility of Middle Eastern percussion instruments in a chamber music setting. The program included both traditional pieces and innovative compositions that pushed the boundaries of percussion music.",
        event_highlights: [
          "Solo percussion showcase",
          "Interactive rhythm demonstration",
          "Q&A session with the audience",
        ],
      },
    ]

    const { error } = await supabase.from("events").insert(
      events.map((event) => ({
        ...event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    )

    if (error) throw error
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding events:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function seedMedia() {
  try {
    const supabase = createServerSupabaseClient()

    const media = [
      {
        title: "Live at Damascus Opera House",
        description: "Highlights from a recent performance at the Damascus Opera House",
        media_type: "image",
        url: "/placeholder.svg?height=600&width=800",
        is_featured: true,
        display_order: 1,
      },
      {
        title: "Workshop Session",
        description: "Teaching traditional Middle Eastern rhythms at a recent workshop",
        media_type: "image",
        url: "/placeholder.svg?height=600&width=800",
        is_featured: true,
        display_order: 2,
      },
      {
        title: "Studio Recording",
        description: "Behind the scenes at a recent recording session",
        media_type: "image",
        url: "/placeholder.svg?height=600&width=800",
        is_featured: true,
        display_order: 3,
      },
      {
        title: "Percussion Collection",
        description: "Ameer's collection of traditional and modern percussion instruments",
        media_type: "image",
        url: "/placeholder.svg?height=600&width=800",
        is_featured: false,
        display_order: 4,
      },
      {
        title: "Festival Performance",
        description: "Performing at the annual Middle Eastern Music Festival",
        media_type: "image",
        url: "/placeholder.svg?height=600&width=800",
        is_featured: false,
        display_order: 5,
      },
      {
        title: "Rhythm Demonstration",
        description: "Video tutorial on basic Middle Eastern rhythms",
        media_type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "/placeholder.svg?height=300&width=500",
        is_featured: false,
        display_order: 6,
      },
    ]

    const { error } = await supabase.from("media").insert(
      media.map((item) => ({
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    )

    if (error) throw error
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error seeding media:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function seedAllData() {
  try {
    const results = await Promise.all([
      seedProfile(),
      seedSiteConfig(),
      seedSpecialties(),
      seedInstruments(),
      seedStats(),
      seedEvents(),
      seedMedia(),
    ])

    const success = results.every((result) => result.success)
    revalidatePath("/admin/dashboard")
    return { success, results }
  } catch (error) {
    console.error("Error seeding all data:", error)
    return { success: false, error: (error as Error).message }
  }
}
