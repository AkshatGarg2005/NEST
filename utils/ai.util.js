import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import axios from "axios"

// Analyze image using AI
export const analyzeImage = async (imageUrl, category) => {
  try {
    // Download image as buffer
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
    const imageBuffer = Buffer.from(response.data, "binary").toString("base64")

    // Prepare prompt based on category
    let prompt = ""

    switch (category) {
      case "pothole":
        prompt = `Analyze this image and determine if it shows a pothole on a road or sidewalk. 
                 If it does, estimate the severity (low, medium, high) based on size and depth.`
        break
      case "cleanliness":
        prompt = `Analyze this image and determine if it shows garbage, debris, or unclean areas. 
                 If it does, estimate the severity (low, medium, high) based on amount and type.`
        break
      case "water":
        prompt = `Analyze this image and determine if it shows a water leak, flooding, or water damage. 
                 If it does, estimate the severity (low, medium, high) based on extent and potential damage.`
        break
      case "electricity":
        prompt = `Analyze this image and determine if it shows electrical issues like downed wires, damaged poles, or broken streetlights. 
                 If it does, estimate the severity (low, medium, high) based on safety risk.`
        break
      default:
        prompt = `Analyze this image and describe what you see. Is there any visible issue or problem?`
    }

    // Generate analysis using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `${prompt}\n\nImage: data:image/jpeg;base64,${imageBuffer}`,
    })

    // Parse the response
    const isValid =
      text.toLowerCase().includes("yes") || !text.toLowerCase().includes("no") || !text.toLowerCase().includes("not")

    let severity = "low"
    if (text.toLowerCase().includes("medium")) severity = "medium"
    if (text.toLowerCase().includes("high")) severity = "high"

    // Extract tags
    const tags = []
    if (category === "pothole") {
      if (text.toLowerCase().includes("large")) tags.push("large")
      if (text.toLowerCase().includes("deep")) tags.push("deep")
      if (text.toLowerCase().includes("multiple")) tags.push("multiple")
    } else if (category === "cleanliness") {
      if (text.toLowerCase().includes("garbage")) tags.push("garbage")
      if (text.toLowerCase().includes("debris")) tags.push("debris")
      if (text.toLowerCase().includes("graffiti")) tags.push("graffiti")
    }

    return {
      isValid,
      severity,
      confidence: isValid ? 0.8 : 0.3,
      tags,
      analysis: text,
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    return {
      isValid: false,
      severity: "low",
      confidence: 0,
      tags: [],
      analysis: "Failed to analyze image",
    }
  }
}

// Generate predictive insights
export const generatePredictiveInsights = async (historicalData, category) => {
  try {
    // Format historical data for the AI
    const formattedData = JSON.stringify(historicalData)

    // Generate insights
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following historical data for ${category} issues in a neighborhood:
        
        ${formattedData}
        
        Based on this data, predict:
        1. Areas likely to experience similar issues in the future
        2. Potential root causes
        3. Recommended preventive measures
        4. Estimated timeframe for when issues might occur again
        
        Format your response as JSON with the following structure:
        {
          "predictions": [
            {
              "area": "area description",
              "probability": 0.X,
              "timeframe": "description",
              "causes": ["cause1", "cause2"]
            }
          ],
          "preventiveMeasures": ["measure1", "measure2"],
          "confidence": 0.X
        }
      `,
    })

    // Parse JSON response
    try {
      const insights = JSON.parse(text)
      return insights
    } catch (jsonError) {
      console.error("Error parsing AI response as JSON:", jsonError)
      return {
        predictions: [],
        preventiveMeasures: [],
        confidence: 0,
      }
    }
  } catch (error) {
    console.error("Error generating predictive insights:", error)
    return {
      predictions: [],
      preventiveMeasures: [],
      confidence: 0,
    }
  }
}

