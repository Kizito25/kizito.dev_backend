// Imports the Google Analytics Data API client library.
import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */

let propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

/**
 * TODO(developer):
 * Replace these variables below with Google Analytics API Credentials
 */
let analyticsClientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL;
let privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: analyticsClientEmail,
    private_key: privateKey.replace(/\n/gm, "\n"), // replacing is necessary
  },
});

// Runs a simple report.
async function runReport(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `7daysAgo`, //👈  e.g. "7daysAgo" or "30daysAgo"
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "year", // data will be year wise
        },
      ],
      metrics: [
        {
          name: "active28DayUsers", // it returs the active users
        },
      ],
    });

    console.log("Report result:", response);
    response.rows.forEach((row) => {
      console.log(row);
      //   res.send({
      //     dimension: row.dimensionValues[0],
      //     metric: row.metricValues[0],
      //   });
    });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
}

export const googleAnalytics = {
  runReport,
};
