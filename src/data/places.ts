import { PlaceDocument } from "../types/place";

export const places: PlaceDocument[] = [
  {
    _id: "ebc-heavy-id",
    country: "Nepal",
    name: "Everest Base Camp",
    description: "Everest Base Camp (EBC) is the ultimate trekking destination in the world, a place that transcends simple adventure and becomes a life-defining pilgrimage. Situated at an altitude of 5,364 meters (17,598 ft), it sits at the foot of Mount Everest, the highest peak on Earth. The journey to EBC takes you through the heart of the Khumbu region, passing through legendary Sherpa villages like Namche Bazaar and Khumjung, and offering views of some of the most iconic peaks in the Himalayas, including Lhotse, Nuptse, and the beautiful Ama Dablam.\n\nThe history of this trail is inextricably linked with the history of mountaineering itself. Since the first successful ascent of Everest by Tenzing Norgay and Sir Edmund Hillary in 1953, thousands of trekkers and climbers have walked these paths, each seeking their own connection to the 'Mother Goddess of the World' (Sagarmatha). The trail is not just about the destination; it's about the cultural immersion, the resilience of the local communities, and the sheer scale of the natural world that surrounds you. You will walk amidst giant glaciers, cross high suspension bridges draped in prayer flags, and witness the sunrise over the most majestic horizon imaginable.\n\nFrom a biological perspective, the trek passes through the Sagarmatha National Park, a UNESCO World Heritage site known for its diverse flora and fauna. In the lower regions, you'll find lush rhododendron and pine forests, while the higher altitudes reveal a stark, lunar-like landscape where only the hardiest of species survive. It is a region of profound spiritual significance as well, with ancient monasteries like Tengboche providing a sanctuary for contemplation amidst the physical challenges of the trek. Whether you are an experienced mountaineer or a dedicated hiker, EBC offers a profound sense of accomplishment and a unique window into the roof of the world.",
    popularName: "EBC",
    location: {
      type: "Point",
      coordinates: [86.8528, 28.0072]
    },
    displayImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    displayMap: null,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
      "https://images.unsplash.com/photo-1601931163309-9069d3516543?q=80&w=1200",
      "https://images.unsplash.com/photo-1598514538885-3b95767aa410?q=80&w=1200"
    ],
    placeType: "Trekking",
    state: "Koshi",
    zone: "Sagarmatha",
    district: "Solukhumbu",
    myUniqueCode: "EBC-HEAVY",
    parentCode: null,
    parent: null,
    tags: [{ _id: "t1", name: "High Altitude" }, { _id: "t2", name: "Adventure" }, { _id: "t3", name: "UNESCO" }, { _id: "t4", name: "Sherpa Culture" }],
    famousRating: 5.0,
    routes: [
      {
        name: "Classic Khumbu Way (from Lukla)",
        myRouteUniqueCode: "EBC-KHM-1",
        estimatedDuration: 17280, // 12 days
        estimatedDistance: 130,
        subRoutes: [
          { name: "Fly into Lukla & Trek to Phakding", description: "Arrival at Tenzing-Hillary Airport and initial descent.", starting: "Lukla", ending: "Phakding", position: 1, myCode: "EBC-S1", estimatedDuration: 180, estimatedDistance: 8, startLocation: { type: "Point", coordinates: [86.7231, 27.6833] }, endLocation: { type: "Point", coordinates: [86.7111, 27.7408] } },
          { name: "Phakding to Namche Bazaar", description: "The steep climb into the Sherpa capital.", starting: "Phakding", ending: "Namche Bazaar", position: 2, myCode: "EBC-S2", estimatedDuration: 360, estimatedDistance: 11, startLocation: { type: "Point", coordinates: [86.7111, 27.7408] }, endLocation: { type: "Point", coordinates: [86.7103, 27.8069] } },
          { name: "Namche Bazaar (Acclimatization)", description: "Rest day with optional hike to Everest View Hotel.", starting: "Namche Bazaar", ending: "Namche Bazaar", position: 3, myCode: "EBC-S3", estimatedDuration: 240, estimatedDistance: 3, startLocation: { type: "Point", coordinates: [86.7103, 27.8069] }, endLocation: { type: "Point", coordinates: [86.7125, 27.8150] } },
          { name: "Namche to Tengboche", description: "Visit the legendary Tengboche Monastery.", starting: "Namche Bazaar", ending: "Tengboche", position: 4, myCode: "EBC-S4", estimatedDuration: 300, estimatedDistance: 10, startLocation: { type: "Point", coordinates: [86.7103, 27.8069] }, endLocation: { type: "Point", coordinates: [86.7641, 27.8368] } },
          { name: "Tengboche to Dingboche", description: "Surpassing the tree line into summer pastures.", starting: "Tengboche", ending: "Dingboche", position: 5, myCode: "EBC-S5", estimatedDuration: 300, estimatedDistance: 11, startLocation: { type: "Point", coordinates: [86.7641, 27.8368] }, endLocation: { type: "Point", coordinates: [86.8333, 27.8933] } },
          { name: "Dingboche (Acclimatization)", description: "High altitude rest with views of Makalu and Island Peak.", starting: "Dingboche", ending: "Dingboche", position: 6, myCode: "EBC-S6", estimatedDuration: 180, estimatedDistance: 4, startLocation: { type: "Point", coordinates: [86.8333, 27.8933] }, endLocation: { type: "Point", coordinates: [86.8500, 27.9100] } },
          { name: "Dingboche to Lobuche", description: "Hiking alongside the Khumbu Glacier moraine.", starting: "Dingboche", ending: "Lobuche", position: 7, myCode: "EBC-S7", estimatedDuration: 300, estimatedDistance: 8, startLocation: { type: "Point", coordinates: [86.8333, 27.8933] }, endLocation: { type: "Point", coordinates: [86.8122, 27.9481] } },
          { name: "Lobuche to Gorak Shep", description: "Last settlement before the Base Camp.", starting: "Lobuche", ending: "Gorak Shep", position: 8, myCode: "EBC-S8", estimatedDuration: 180, estimatedDistance: 5, startLocation: { type: "Point", coordinates: [86.8122, 27.9481] }, endLocation: { type: "Point", coordinates: [86.8288, 27.9814] } },
          { name: "Gorak Shep to EBC (The Final Push)", description: "Touching the base of the world's highest peak.", starting: "Gorak Shep", ending: "Everest Base Camp", position: 9, myCode: "EBC-S9", estimatedDuration: 240, estimatedDistance: 4, startLocation: { type: "Point", coordinates: [86.8288, 27.9814] }, endLocation: { type: "Point", coordinates: [86.8528, 28.0072] } },
          { name: "Kala Patthar Hike", description: "Pre-dawn climb for the ultimate Everest sunrise photo.", starting: "Gorak Shep", ending: "Kala Patthar", position: 10, myCode: "EBC-S10", estimatedDuration: 120, estimatedDistance: 2, startLocation: { type: "Point", coordinates: [86.8288, 27.9814] }, endLocation: { type: "Point", coordinates: [86.8200, 27.9950] } },
          { name: "Gorak Shep back to Pheriche", description: "Rapid descent into warmer, thicker air.", starting: "Gorak Shep", ending: "Pheriche", position: 11, myCode: "EBC-S11", estimatedDuration: 360, estimatedDistance: 13, startLocation: { type: "Point", coordinates: [86.8288, 27.9814] }, endLocation: { type: "Point", coordinates: [86.7933, 27.8933] } },
          { name: "Return to Lukla", description: "The final celebration in Lukla before departure.", starting: "Pheriche", ending: "Lukla", position: 12, myCode: "EBC-S12", estimatedDuration: 420, estimatedDistance: 15, startLocation: { type: "Point", coordinates: [86.7933, 27.8933] }, endLocation: { type: "Point", coordinates: [86.7231, 27.6833] } }
        ]
      },
      {
        name: "Alternate Gokyo Lakes Trail",
        myRouteUniqueCode: "EBC-GOK-2",
        estimatedDuration: 21600, // 15 days
        estimatedDistance: 150,
        subRoutes: [
          { name: "Namche to Dole", description: "Branching off towards the Gokyo Valley.", starting: "Namche Bazaar", ending: "Dole", position: 1, myCode: "EBC-SUB-G1", estimatedDuration: 300, estimatedDistance: 9, startLocation: { type: "Point", coordinates: [86.7103, 27.8069] }, endLocation: { type: "Point", coordinates: [86.6834, 27.9204] } },
          { name: "Dole to Machhermo", description: "Climbing deeper into the Gokyo Valley.", starting: "Dole", ending: "Machhermo", position: 2, myCode: "EBC-SUB-G2", estimatedDuration: 240, estimatedDistance: 8, startLocation: { type: "Point", coordinates: [86.6834, 27.9204] }, endLocation: { type: "Point", coordinates: [86.6662, 27.9692] } },
          { name: "Machhermo to Gokyo", description: "Arrival at the iconic turquoise Gokyo lakes.", starting: "Machhermo", ending: "Gokyo", position: 3, myCode: "EBC-SUB-G3", estimatedDuration: 210, estimatedDistance: 7, startLocation: { type: "Point", coordinates: [86.6662, 27.9692] }, endLocation: { type: "Point", coordinates: [86.6868, 27.9612] } }
        ]
      }
    ],
    slug: "everest-base-camp-heavy-dataset",
    seo: {
      metaTitle: "Everest Base Camp Trek | The Ultimate Guide",
      metaDescription: "Comprehensive guide to Everest Base Camp (EBC) trek. Detailed itinerary, difficulty, costs, and Sherpa culture insights.",
      ogImage: "https://yatribhet.com/og-ebc.jpg",
      canonicalUrl: "https://yatribhet.com/everest-base-camp-heavy-dataset",
      noIndex: false,
      sitemapPriority: 1.0,
      sitemapChangefreq: "weekly"
    },
    structuredData: {
      schemaType: "TouristAttraction",
      openingHours: [{ days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "00:00", closes: "23:59" }],
      priceRange: "$$$",
      entryFee: { amount: 3000, currency: "NPR" },
      phone: "+977-1-5551234",
      email: "khumbu@nationalpark.gov.np",
      website: "https://everestguides.com",
      aggregateRating: { ratingValue: 5.0, reviewCount: 85600, bestRating: 5, worstRating: 1 },
      amenities: [
        "High Altitude Air Service", "Teahouse Lodging", "Guided Expeditions", "Satellite Phone Service", 
        "Heli-Evacuation Ready", "Sherpa Porters", "Solar Charging", "Hot Showers (Paid)", "Oxygen Refills",
        "Photography Assistance", "First Aid Stations", "Wireless Internet (Everest Link)", "Local Markets"
      ]
    },
    aiMeta: {
      summaryForAi: "EBC is the world's most famous trek, offering a face-to-face encounter with the highest peaks in the Khumbu region of Nepal.",
      entityAliases: ["EBC", "Mount Everest Base Camp", "Sagarmatha Base Camp"],
      faq: [
        { question: "How hard is the EBC trek?", answer: "It is considered moderate to difficult. No technical climbing is required, but you must be fit for 5-7 hours of daily walking at high altitude." },
        { question: "When is the best time to visit?", answer: "Post-monsoon (October to November) and Pre-monsoon (March to May) offer the clearest skies." },
        { question: "What about altitude sickness?", answer: "Acclimatization days in Namche and Dingboche are mandatory to avoid Acute Mountain Sickness (AMS)." },
        { question: "Do I need travel insurance?", answer: "Absolutely. Ensure it covers helicopter rescue above 5,000 meters." },
        { question: "Are there ATMs on the trail?", answer: "Namche Bazaar is the last reliable place for ATMs. Carry enough cash for the higher elevations." },
        { question: "What should I pack?", answer: "Layers are key. Down jackets, thermal underwear, and broken-in hiking boots are essential." },
        { question: "Can I do it solo?", answer: "Yes, but hiring a local guide or porter is highly recommended for safety and supporting the local economy." },
        { question: "Is there water on the trail?", answer: "Boiled or treated water is available at every teahouse. Avoid single-use plastic bottles." }
      ],
      keyFacts: [
        "Altitude: 5,364m / 17,598ft",
        "UNESCO World Heritage Site: Sagarmatha National Park",
        "Distance: Approximately 130km round trip from Lukla",
        "Culture: Predominantly Sherpa (Tibetan Buddhist influence)",
        "Peak Season arrival: Up to 500 trekkers per day",
        "Everest is known as Sagarmatha in Nepali and Chomolungma in Tibetan",
        "First climbed in 1953 by Hillary and Tenzing",
        "The Khumbu Icefall is visible from the base camp",
        "Mandatory Permits: Khumbu Pasang Lhamu Rural Municipality Permit & National Park Entry Permit",
        "Highest point of the trek: Kala Patthar at 5,550m",
        "Namche Bazaar is the highest trade hub in the world"
      ],
      topicAssociations: ["Everest", "Himalayas", "Trekking", "Adventure", "Sherpa", "Glaciers"]
    },
    lastVerifiedAt: "2024-04-01T10:00:00Z",
    altitude: 5364,
    difficulty: "Expert"
  },
  {
    _id: "nagarkot-moderate-id",
    country: "Nepal",
    name: "Nagarkot Viewpoint",
    description: "Nagarkot is a classic hill station located just 32km from Kathmandu. It is widely considered the best spot for mountain viewing in the immediate vicinity of the capital. Known for its spectacular sunrise views over the Himalayas, including Everest on clear days.",
    popularName: "Nagarkot",
    location: { type: "Point", coordinates: [85.5214, 27.7128] },
    displayImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    displayMap: null,
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"],
    placeType: "Viewpoint",
    state: "Bagmati",
    zone: "Bagmati",
    district: "Bhaktapur",
    myUniqueCode: "NAG-MOD",
    parentCode: null,
    parent: null,
    tags: [{ _id: "t5", name: "Sunrise" }, { _id: "t6", name: "Nature walk" }],
    famousRating: 4.5,
    routes: [
      {
        name: "Morning Hike to View Tower",
        myRouteUniqueCode: "NAG-1",
        estimatedDuration: 60,
        estimatedDistance: 3,
        subRoutes: [
          { name: "Hotel Zone to Tower", description: "Easy walk along the ridge.", starting: "Hotels", ending: "View Tower", position: 1, myCode: "NAG-S1", estimatedDuration: 60, estimatedDistance: 3, startLocation: { type: "Point", coordinates: [85.5, 27.7] }, endLocation: { type: "Point", coordinates: [85.52, 27.71] } }
        ]
      }
    ],
    slug: "nagarkot-viewpoint-moderate",
    seo: {
      metaTitle: "Nagarkot Sunrise | Best Views near Kathmandu",
      metaDescription: "Experience the magic of sunrise at Nagarkot. A perfect weekend getaway for mountain lovers.",
      ogImage: null,
      canonicalUrl: "https://yatribhet.com/nagarkot-viewpoint-moderate",
      noIndex: false,
      sitemapPriority: 0.7,
      sitemapChangefreq: "monthly"
    },
    structuredData: {
      schemaType: "TouristAttraction",
      openingHours: [{ days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "00:00", closes: "23:59" }],
      priceRange: "$",
      entryFee: { amount: 0, currency: "NPR" },
      phone: null,
      email: null,
      website: null,
      aggregateRating: { ratingValue: 4.5, reviewCount: 4500, bestRating: 5, worstRating: 1 },
      amenities: ["Hotels", "Restaurants", "Viewing Deck", "Hiking Trails"]
    },
    aiMeta: {
      summaryForAi: "Nagarkot offers one of the broadest views of the Himalayas in the Kathmandu valley.",
      entityAliases: ["Nagarkot Hill", "Sunrise Point"],
      faq: [
        { question: "Is there a direct bus?", answer: "Yes, buses run from Bhaktapur and Kathmandu regularly." }
      ],
      keyFacts: ["Altitude: 2,175m", "32km from Kathmandu", "Best for sunrise/sunset"],
      topicAssociations: ["Viewpoint", "Nature", "Tourism"]
    },
    lastVerifiedAt: "2024-03-15T00:00:00Z",
    altitude: 2175,
    difficulty: "Easy"
  },
  {
    _id: "local-shrine-light-id",
    country: "Nepal",
    name: "Siddha Gufa (Local Side)",
    description: "A small, quiet cave shrine used by locals for meditation.",
    popularName: "The Cave",
    location: { type: "Point", coordinates: [85.0, 27.0] },
    displayImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    displayMap: null,
    images: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200"],
    placeType: "Shrine",
    state: "Bagmati",
    zone: "Bagmati",
    district: "Unknown",
    myUniqueCode: "SIDDHA-LIGHT",
    parentCode: null,
    parent: null,
    tags: [],
    famousRating: 3.5,
    routes: [],
    slug: "local-shrine-light-data",
    seo: {
      metaTitle: "Local Shrine",
      metaDescription: "A quiet place.",
      ogImage: null,
      canonicalUrl: "https://yatribhet.com/local-shrine-light-data",
      noIndex: true,
      sitemapPriority: 0.1,
      sitemapChangefreq: "never"
    },
    structuredData: {
      schemaType: "Place",
      openingHours: [],
      priceRange: "Free",
      entryFee: { amount: 0, currency: "NPR" },
      phone: null,
      email: null,
      website: null,
      aggregateRating: { ratingValue: 3.5, reviewCount: 12, bestRating: 5, worstRating: 1 },
      amenities: []
    },
    aiMeta: {
      summaryForAi: "Small local shrine.",
      entityAliases: [],
      faq: [],
      keyFacts: [],
      topicAssociations: []
    },
    lastVerifiedAt: "2024-01-01T00:00:00Z",
    altitude: 1200,
    difficulty: "Easy"
  }
];
