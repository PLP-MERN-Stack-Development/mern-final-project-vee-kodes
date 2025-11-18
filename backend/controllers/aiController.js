const OpenAI = require('openai');
const dotenv = require('dotenv');
const FarmActivity = require('../models/FarmActivity.js');
const Farmer = require('../models/Farmer.js');
const Collection = require('../models/Collection.js'); 

dotenv.config();

// Initialize OpenAI client
let openai;
if (process.env.NODE_ENV !== 'test') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  // Mock OpenAI for testing
  openai = {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: '{"insights": ["Test insight"]}' } }],
        }),
      },
    },
  };
}

// Helper function to call OpenAI
const getOpenAICompletion = async (prompt, model = 'gpt-3.5-turbo', response_format = { type: "text" }) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: model,
      response_format: response_format, 
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    throw new Error('Failed to get response from AI');
  }
};


// 1. QUALITATIVE AI INSIGHTS (Text-Based)

// Get AI Dashboard Insights
// GET /api/ai/insights
// @access  Private (Admin)
const getDashboardInsights = async (req, res) => {
  try {
    // Fetch relevant data
    const activities = await FarmActivity.find()
      .populate('farmer', 'name location contractedCrop')
      .sort({createdAt: -1})
      .limit(50);

    const farmers = await Farmer.find().countDocuments();

    // Format data for the prompt
    const activitySummary = activities
      .filter(a => a.farmer) 
      .map(a => ({
        farmer: a.farmer.name,
        crop: a.farmer.contractedCrop,
        location: a.farmer.location,
        activity: a.type,
        date: a.date.toISOString().split('T')[0],
        details: a.details
    }));

    // Create the prompt
      const prompt = `
      You are an agricultural analyst for AgriTrace AI.
      Total registered farmers: ${farmers}.
      Here is the latest farm activity data:
      ${JSON.stringify(activitySummary, null, 2)}

      Based *only* on the data provided, analyze the last 3 months' farm data.
      Identify 2-3 key insights, risks, or potential yield shortages/surpluses.
      Each insight should be a single, concise string.

      You MUST return your insights as a valid JSON object in the following format:
      {
        "insights": [
          "string insight 1",
          "string insight 2",
          "..."
        ]
      }

      Example response based on the provided data:
      {
        "insights": [
          "Pineapple yields in Kiambu by farmer Jim Kariuki are on track due to consistent farm management.",
          "Potential risk in Bomet mango yield by farmer Jacinta Tosh is noted due to lack of follow-up activities after June seeding."
        ]
      }
    `;

    // Get response from AI in JSON mode
    const insightJSONString = await getOpenAICompletion(
      prompt,
      'gpt-4-turbo',
      { type: "json_object" } // Request JSON mode
    );

    // Parse the JSON string and send the object
    const parsedInsights = JSON.parse(insightJSONString);

    res.status(200).json(parsedInsights);

  } catch (error) {
    console.error('Error in getDashboardInsights:', error.message);
    res.status(500).json({ message: error.message });
  }
};


// Generate Farmer Smart Summary
// GET /api/ai/farmer-summary/:farmerId
// @access  Private (Admin, FieldOfficer)
const getFarmerSummary = async (req, res) => {
    try {
        const {farmerId} = req.params;
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }       
        const activities = await FarmActivity.find({ farmer: farmerId }).sort({ date: 1 });
        const collections = await Collection.find({ farmer: farmerId }).sort({ collectionDate: 1 });
        const data = {
            farmer: farmer.name,
            crop: farmer.contractedCrop,
            location: farmer.location,
            activities: activities.map(a => `${a.date.toISOString().split('T')[0]}: ${a.type} (${a.details})`),
            collections: collections.map(c => `${c.collectionDate.toISOString().split('T')[0]}: Collected ${c.weight}kg, Grade ${c.qualityGrade}, Payment ${c.paymentStatus}`)
        };

        // Using "Smart Summary" prompt
        const prompt = `
            Here is the data for a farmer:
            ${JSON.stringify(data, null, 2)}

            Summarize this farmer’s lifecycle from planting to harvest in under 5 sentences for the manager dashboard.
        `;
        
        const summary = await getOpenAICompletion(prompt);
        res.status(200).json({ summary });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 2. QUANTITATIVE ANALYTICS (For Charts)

// Get analytics on farm activity types
// GET /api/ai/analytics/activity-distribution
// @access  Private (Admin)
const getActivityDistribution = async (req, res) => {
  try {
    const data = await FarmActivity.aggregate([
      {
        $group: {
          _id: '$type', // Group by the 'type' field (e.g., "Planting", "Weeding")
          count: { $sum: 1 } // Count one for each document in the group
        }
      },
      {
        $project: {
          _id: 0,        // Exclude the default _id
          type: '$_id',  // Rename _id to 'type'
          count: 1       // Include the count
        }
      }
    ]);

    // Format for Chart.js
    const labels = data.map(item => item.type);
    const series = data.map(item => item.count);

    res.status(200).json({ labels, series });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get analytics on collection weight over time
// GET /api/ai/analytics/collections-timeseries
// @access  Private (Admin)
const getCollectionsOverTime = async (req, res) => {
  try {
    const data = await Collection.aggregate([
      {
        $group: {
          // Group by the date part of 'collectionDate'
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$collectionDate" } },
          totalWeight: { $sum: "$weight" } // Sum the 'weight' for each day
        }
      },
      {
        $sort: { _id: 1 } // Sort by date in ascending order
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          weight: '$totalWeight'
        }
      }
    ]);

    // Format for Chart.js
    const labels = data.map(item => item.date);   // Dates for the X-axis
    const series = data.map(item => item.weight); // Weights for the Y-axis

    res.status(200).json({ labels, series });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total yield grouped by farmer region
// GET /api/ai/analytics/yield-by-region
// @access  Private (Admin)
const getYieldByRegion = async (req, res) => {
  try {
    const data = await Collection.aggregate([
      // Join with the 'farmers' collection
      {
        $lookup: {
          from: 'farmers', // The name of the Farmer collection in MongoDB Atlas
          localField: 'farmer',
          foreignField: '_id',
          as: 'farmerDetails'
        }
      },
      // Unwind the farmerDetails array
      {
        $unwind: '$farmerDetails'
      },
      // Group by the farmer's region
      {
        $group: {
          _id: '$farmerDetails.region',
          totalYield: { $sum: '$weight' }
        }
      },
      // Filter out any null/undefined regions 
      {
        $match: {
          _id: { $ne: null, $ne: "" } 
        }
      },
      {
        $project: {
          _id: 0,
          region: '$_id',
          yield: '$totalYield'
        }
      },
      // Sort by region name A-Z
      {
        $sort: { region: 1 }
      }
    ]);

    const labels = data.map(item => item.region);
    const series = data.map(item => item.yield);

    res.status(200).json({ labels, series });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get analytics on collection quality grades
// GET /api/ai/analytics/quality-distribution
// @access  Private (Admin)
const getQualityDistribution = async (req, res) => {
  try {
    const data = await Collection.aggregate([
      {
        $group: {
          _id: '$qualityGrade', // Group by the 'qualityGrade' field
          totalWeight: { $sum: '$weight' } // Sum the 'weight' for each grade
        }
      },
      {
        $match: {
          _id: { $ne: null } // Filter out any null grades
        }
      },
      {
        $project: {
          _id: 0,
          grade: '$_id',
          weight: '$totalWeight'
        }
      },
      {
        $sort: { grade: 1 } // Sort A, B, C...
      }
    ]);

    // Format for Chart.js
    const labels = data.map(item => item.grade);
    const series = data.map(item => item.weight);

    res.status(200).json({ labels, series });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 3. AI-DRIVEN FORECASTING

// Get AI-driven yield forecast
// GET /api/ai/analytics/yield-forecast
// @access  Private (Admin)
const getYieldForecast = async (req, res) => {
  try {
    // Define the time window (e.g., last 90 days)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    // Fetch recent "Planting" activities
    const seedingActivities = await FarmActivity.find({
      type: 'Planting',
      date: { $gte: ninetyDaysAgo }
    })
    .populate('farmer', 'name region contractedCrop') //
    .sort({ date: 1 });

    // Format data for the prompt
    const seedingSummary = seedingActivities
      .filter(a => a.farmer) // Filter out activities with null/deleted farmers
      .map(a => ({
        farmer: a.farmer.name,
        region: a.farmer.region,
        crop: a.farmer.contractedCrop,
        date: a.date.toISOString().split('T')[0],
        details: a.details // e.g., "5 acres", "20kg of seeds"
      }));

    if (seedingSummary.length === 0) {
      return res.status(200).json({ 
        mainForecast: null,
        keyRisks: [],
        opportunities: [],
        notes: "No recent seeding activities found to generate a forecast."
      });
    }

    // Create the prompt 
    const prompt = `
      You are an expert agricultural analyst for AgriTrace AI.
      Today's date is ${new Date().toISOString().split('T')[0]}.
      
      Here is a list of "Planting" activities from the last 90 days:
      ${JSON.stringify(seedingSummary, null, 2)}

      Based *only* on this data and your general knowledge of crop growth cycles:
      
      1.  Analyze all planting activities.
      2.  Create a list of harvest forecasts. Each forecast must be a single string in the format:
          "- [Crop Name] ([Region]) harvest: [Predicted Timeframe]"
      3.  Identify one or two (1-2) key risks as an array of strings.
      4.  Identify one (1) opportunity, if any, as an array of strings.

      You MUST return your insights as a valid JSON object in the following format.
      Do not add any text outside of the JSON object.
      
      {
        "forecasts": [
          "- Mushrooms (Nyanza) harvest: late Jan to early Feb 2026",
          "- Maize (Rift Valley) harvest: mid-Feb 2026"
        ],
        "keyRisks": [
          "string risk 1",
          "string risk 2"
        ],
        "opportunities": [
          "string opportunity 1"
        ],
        "notes": null
      }
    `;

    // Get response from AI in JSON mode
    const forecastJSONString = await getOpenAICompletion(
      prompt, 
      'gpt-4-turbo', 
      { type: "json_object" } 
    );

    const parsedForecasts = JSON.parse(forecastJSONString);
    
    res.status(200).json(parsedForecasts); // e.g., { forecasts: [...] }

  } catch (error) {
    console.error('CRASH in getYieldForecast:', error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getDashboardInsights,
  getFarmerSummary,
  getActivityDistribution,
  getCollectionsOverTime,
  getYieldByRegion,
  getQualityDistribution,
  getYieldForecast 
};