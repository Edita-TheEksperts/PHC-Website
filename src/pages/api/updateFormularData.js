import { prisma } from "../../lib/prisma"

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id, ...formData } = req.body
    if (!id) {
      return res.status(400).json({ error: "User ID fehlt" })
    }

    // 🚫 Remove relational fields
    const {
      services,
      subServices,
      schedules,
      assignments,
      reminders,
      transactions,
      vacations,
      ...cleanFormData
    } = formData

    const fieldMap = {
      firstName: "firstName",
      lastName: "lastName",
      phone: "phone",
      email: "email",
      address: "address",
      postalCode: "postalCode",
      biographyWork: "biographyWork",
      hasAllergies: "hasAllergies",
      allergyDetails: "allergyDetails",
      trips: "trips",
      height: "height",
      weight: "weight",
      behaviorTraits: "behaviorTraits",
      healthFindings: "healthFindings",
      householdTasks: "householdTasks",
      languages: "languages",
      petDetails: "petDetails",
      city: "careCity",
      entranceLocation: "careEntrance",
      arrivalConditions: "careArrivalConditions",
      keyLocation: "mailboxKeyLocation",
      hasParking: "careHasParking",
      parkingLocation: "careStreet",
      entranceDescription: "careEntranceDetails",
      additionalNotes: "specialRequests",
      companionship: "companionshipSupport",
      cookingTogether: "jointCooking",
      reading: "reads",
      cardGames: "playsCards",
      physicalCondition: "physicalState",
      careTools: "mobilityAids",
      careToolsOther: "toolsOther",
      incontinence: "incontinenceTypes",
      Sehen: "communicationVision",
      Hören: "communicationHearing",
      Sprechen: "communicationSpeech",
      nutritionSupport: "foodSupport",
      basicCare: "basicCareNeeds",
      basicCareOther: "basicCareOtherField",
      healthPromotion: "healthPromotions",
      healthPromotionOther: "healthPromotionOther",
      diagnoses: "mentalDiagnoses",
      roomCount: "householdRooms",
      householdSize: "householdPeople",
      cookingForPeople: "cooking",
      hasPets: "pets",
    }

    const finalData = {}
    Object.entries(cleanFormData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const mappedKey = fieldMap[key] || key
        finalData[mappedKey] = value
      }
    })

    // 🚑 fix array → string mismatch
    const arrayToStringFields = [
      "careArrivalConditions",
      "trips",
      "physicalState",
      "mobilityAids",
      "incontinenceTypes",
      "foodSupport",
      "basicCareNeeds",
      "healthPromotions",
      "mentalDiagnoses",
      "behaviorTraits",
      "languages",
    ]
    arrayToStringFields.forEach((f) => {
      if (Array.isArray(finalData[f])) {
        finalData[f] = finalData[f].join(", ")
      }
    })

    const updatedUser = await prisma.user.update({
      where: { id: String(id) },
      data: finalData,
    })

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error("❌ Fehler beim Update der Formulardaten:", error.message)
    return res.status(500).json({ error: "Interner Serverfehler" })
  }
}
