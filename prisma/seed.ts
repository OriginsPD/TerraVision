import { PrismaClient, UserRole, PropertyType } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning up database...")
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.floorPlan.deleteMany()
  await prisma.propertyImage.deleteMany()
  await prisma.property.deleteMany()
  await prisma.professional.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log("Seeding users...")

  const usersData = [
    { id: "user-1", email: "alex@terravision.com", first: "Alex", last: "Vance", role: UserRole.OWNER },
    { id: "user-2", email: "sarah@terravision.com", first: "Sarah", last: "Chen", role: UserRole.ARCHITECT },
    { id: "user-3", email: "mike@terravision.com", first: "Michael", last: "Torres", role: UserRole.CONTRACTOR },
    { id: "user-4", email: "emily@terravision.com", first: "Emily", last: "Watson", role: UserRole.BUYER },
    { id: "user-5", email: "david@terravision.com", first: "David", last: "Miller", role: UserRole.OWNER },
    { id: "user-6", email: "lucia@terravision.com", first: "Lucia", last: "Rossi", role: UserRole.MASON },
    { id: "user-7", email: "james@terravision.com", first: "James", last: "Wilson", role: UserRole.CARPENTER },
    { id: "user-8", email: "admin@terravision.com", first: "Admin", last: "User", role: UserRole.ADMIN },
  ]

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        firstName: u.first,
        lastName: u.last,
        role: u.role,
        isActive: true,
        email_verified: true,
      }
    })
  }

  console.log("Seeding professionals...")

  const professionalsData = [
    { userId: "user-2", profession: "Architect", bio: "Award-winning minimalist architect.", rate: 185 },
    { userId: "user-3", profession: "General Contractor", bio: "20 years of luxury residential builds.", rate: 120 },
    { userId: "user-6", profession: "Master Mason", bio: "Stone work specialist for coastal estates.", rate: 95 },
    { userId: "user-7", profession: "Finish Carpenter", bio: "Custom cabinetry and hardwood details.", rate: 85 },
  ]

  for (const p of professionalsData) {
    await prisma.professional.create({
      data: {
        userId: p.userId,
        profession: p.profession,
        bio: p.bio,
        hourlyRate: p.rate,
      }
    })
  }

  console.log("Seeding properties (Houses with multiple angles)...")

  const propertiesData = [
    {
      ownerId: "user-1",
      title: "Azure Bay Modern Villa",
      desc: "A stunning 4-bedroom glass villa overlooking the Malibu coast. Features an open-concept living area and infinity pool.",
      loc: "Malibu, CA",
      lat: 34.0259,
      lng: -118.7798,
      price: 4500000,
      land: 1.2,
      type: PropertyType.VILLA,
      amenities: ["Pool", "Beach Access", "Smart Home", "Home Theater"],
      views: 1240,
      images: [
        { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811", type: "main" },
        { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227", type: "front" },
        { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", type: "back" },
        { url: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4", type: "left" },
        { url: "https://images.unsplash.com/photo-1613977257582-452136096e4c", type: "right" },
      ],
      has3D: true,
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
    },
    {
      ownerId: "user-5",
      title: "Aspen Alpine Chalet",
      desc: "Cozy timber-framed mountain retreat with heated floors and floor-to-ceiling mountain views.",
      loc: "Aspen, CO",
      lat: 39.1911,
      lng: -106.8175,
      price: 2800000,
      land: 3.5,
      type: PropertyType.CHALET,
      amenities: ["Ski-in/Ski-out", "Sauna", "Wine Cellar", "Fireplace"],
      views: 850,
      images: [
        { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233", type: "main" },
        { url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c", type: "front" },
        { url: "https://images.unsplash.com/photo-1464146072230-91cabc968266", type: "back" },
      ],
      has3D: false
    },
    {
      ownerId: "user-1",
      title: "Desert Mirror Residence",
      desc: "Minimalist concrete and glass structure designed to disappear into the Joshua Tree landscape.",
      loc: "Joshua Tree, CA",
      lat: 34.1333,
      lng: -116.3131,
      price: 1150000,
      land: 5.0,
      type: PropertyType.HOUSE,
      amenities: ["Sustainable Design", "Solar Panels", "Stargazing Deck"],
      views: 2100,
      images: [
        { url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09", type: "main" },
        { url: "https://images.unsplash.com/photo-1449156003053-930cce580dd0", type: "front" },
        { url: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35", type: "back" },
        { url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6", type: "left" },
      ],
      has3D: true,
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
    },
    {
      ownerId: "user-1",
      title: "Miami Beach Penthouse",
      desc: "Luxury 50th floor unit with private elevator and wraparound terrace.",
      loc: "Miami, FL",
      lat: 25.7617,
      lng: -80.1918,
      price: 5900000,
      land: 0.05,
      type: PropertyType.PENTHOUSE,
      amenities: ["Ocean View", "Private Elevator", "Gym", "Concierge"],
      views: 3400,
      images: [
        { url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd", type: "main" },
        { url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde", type: "front" },
        { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3", type: "back" },
      ],
      has3D: true,
      modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
    },
    {
      ownerId: "user-5",
      title: "Austin Hill Country Estate",
      desc: "Contemporary limestone ranch house with panoramic views and vineyard potential.",
      loc: "Austin, TX",
      lat: 30.2672,
      lng: -97.7431,
      price: 3200000,
      land: 12.0,
      type: PropertyType.HOUSE,
      amenities: ["Vineyard", "Guest House", "Outdoor Kitchen"],
      views: 420,
      images: [
        { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", type: "main" },
        { url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0", type: "front" },
        { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d", type: "back" },
      ],
      has3D: false
    }
  ]

  for (const p of propertiesData) {
    const property = await prisma.property.create({
      data: {
        ownerId: p.ownerId,
        title: p.title,
        description: p.desc,
        location: p.loc,
        latitude: p.lat,
        longitude: p.lng,
        price: p.price,
        landSize: p.land,
        type: p.type,
        amenities: p.amenities,
        views: p.views,
        imageUrl: p.images[0].url,
        imageUrlFront: p.images.find(img => img.type === "front")?.url,
        imageUrlBack: p.images.find(img => img.type === "back")?.url,
        imageUrlLeft: p.images.find(img => img.type === "left")?.url,
        imageUrlRight: p.images.find(img => img.type === "right")?.url,
        isModelGenerated: p.has3D,
        model_3d_url: p.modelUrl || null,
        images: {
          create: p.images.map(img => ({ url: img.url, type: img.type }))
        }
      }
    })

    if (Math.random() > 0.5) {
      await prisma.favorite.create({
        data: {
          userId: "user-4", // Emily (Buyer)
          propertyId: property.id
        }
      })
    }
  }

  console.log("Seeding floor plans...")

  const sarah = await prisma.professional.findFirst({ where: { user: { email: "sarah@terravision.com" } } })
  if (sarah) {
    const plansData = [
      { title: "The Glass Pavilion", desc: "Open-concept 3-bedroom masterpiece.", price: 450, sqft: 2800, beds: 3, baths: 3.5, style: "Modern", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750" },
      { title: "Desert Mirage", desc: "Luxury 2-bedroom thermal mass design.", price: 299, sqft: 1600, beds: 2, baths: 2, style: "Minimalist", img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09" },
    ]

    for (const plan of plansData) {
      await prisma.floorPlan.create({
        data: {
          professional_id: sarah.id,
          title: plan.title,
          description: plan.desc,
          price: plan.price,
          sqft: plan.sqft,
          bedrooms: plan.beds,
          bathrooms: plan.baths,
          style: plan.style,
          imageUrl: plan.img,
        }
      })
    }
  }

  console.log("Seeding conversations...")

  const conv = await prisma.conversation.create({
    data: {
      user1Id: "user-4", // Emily (Buyer)
      user2Id: "user-1", // Alex (Owner)
    }
  })

  await prisma.message.createMany({
    data: [
      { conversationId: conv.id, senderId: "user-4", content: "Hi Alex, I'm very interested in the Azure Bay Villa. Is it available for a viewing this weekend?" },
      { conversationId: conv.id, senderId: "user-1", content: "Hi Emily! Yes, it's available. Saturday at 2 PM works for me. Does that work for you?" },
      { conversationId: conv.id, senderId: "user-4", content: "Perfect, see you then!" },
    ]
  })

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
