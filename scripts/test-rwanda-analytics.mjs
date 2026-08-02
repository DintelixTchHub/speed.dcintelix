#!/usr/bin/env node

/**
 * Rwanda Analytics Test Script
 * 
 * This script demonstrates how to:
 * 1. Submit anonymous speed test data
 * 2. Query Rwanda-specific analytics
 * 3. Get ISP rankings
 * 4. Compare city performance
 */

const API_BASE = "http://localhost:3000";

// Example speed test data for Rwanda
const testDataSamples = [
  {
    download: 45.5,
    upload: 15.2,
    ping: 48.3,
    jitter: 8.5,
    packetLoss: 0.15,
    isp: "MTN Rwanda",
    asn: 37394,
    country: "Rwanda",
    province: "Kigali",
    city: "Kigali",
    latitude: -1.9459,
    longitude: 29.8739,
    browser: "Chrome",
    operatingSystem: "Windows",
    deviceType: "Desktop",
    networkType: "Wi-Fi",
    server: "Kigali-1",
    ipAddress: "192.168.1.1",
  },
  {
    download: 35.2,
    upload: 12.5,
    ping: 52.1,
    jitter: 10.2,
    packetLoss: 0.25,
    isp: "Airtel Rwanda",
    asn: 37650,
    country: "Rwanda",
    province: "Northern",
    city: "Musanze",
    latitude: -1.4977,
    longitude: 29.6355,
    browser: "Safari",
    operatingSystem: "iOS",
    deviceType: "Mobile",
    networkType: "4G",
    server: "Musanze-1",
    ipAddress: "192.168.1.2",
  },
  {
    download: 55.8,
    upload: 18.3,
    ping: 42.5,
    jitter: 6.2,
    packetLoss: 0.05,
    isp: "Liquid Telecom Rwanda",
    asn: 37100,
    country: "Rwanda",
    province: "Southern",
    city: "Butare",
    latitude: -2.5833,
    longitude: 29.7667,
    browser: "Firefox",
    operatingSystem: "Linux",
    deviceType: "Desktop",
    networkType: "Ethernet",
    server: "Butare-1",
    ipAddress: "192.168.1.3",
  },
];

/**
 * Submit anonymous speed test
 */
async function submitSpeedTest(testData) {
  try {
    const response = await fetch(`${API_BASE}/api/analytics/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`Submit failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("✓ Speed test submitted (Anonymous)", {
      isp: testData.isp,
      city: testData.city,
      download: testData.download,
      // Note: IP address is hashed, never stored in plain text
    });
    return result;
  } catch (error) {
    console.error("✗ Failed to submit speed test:", error.message);
  }
}

/**
 * Get Rwanda ISP Rankings
 */
async function getRwandaRankings(range = "30d") {
  try {
    const response = await fetch(
      `${API_BASE}/api/analytics/rwanda/isp-rankings?range=${range}`
    );

    if (!response.ok) {
      throw new Error(`Query failed: ${response.status}`);
    }

    const rankings = await response.json();
    console.log("\n📊 Rwanda ISP Rankings (Top 5):");
    console.log("─".repeat(70));

    rankings.slice(0, 5).forEach((isp) => {
      console.log(`
${isp.rank}. ${isp.name}
   Download: ${isp.averageDownload} Mbps | Upload: ${isp.averageUpload} Mbps
   Ping: ${isp.averagePing}ms | Jitter: ${isp.averageJitter}ms
   Packet Loss: ${isp.packetLoss}% | Tests: ${isp.tests}`);
    });

    return rankings;
  } catch (error) {
    console.error("✗ Failed to get rankings:", error.message);
  }
}

/**
 * Get Rwanda Overview
 */
async function getRwandaOverview(range = "30d") {
  try {
    const response = await fetch(`${API_BASE}/api/analytics/rwanda?range=${range}`);

    if (!response.ok) {
      throw new Error(`Query failed: ${response.status}`);
    }

    const overview = await response.json();
    console.log("\n🇷🇼 Rwanda Internet Analytics Overview:");
    console.log("─".repeat(70));
    console.log(`
Total Tests: ${overview.totalTests}
Tests Today: ${overview.testsToday}
Active ISPs: ${overview.activeISPs}
Cities Covered: ${overview.cities}

Network Performance:
  Average Download: ${overview.averageDownload} Mbps
  Average Upload: ${overview.averageUpload} Mbps
  Average Ping: ${overview.averagePing} ms
  Average Jitter: ${overview.averageJitter} ms
  Average Packet Loss: ${overview.averagePacketLoss}%
`);

    return overview;
  } catch (error) {
    console.error("✗ Failed to get overview:", error.message);
  }
}

/**
 * Get City Performance
 */
async function getCityStats(range = "30d") {
  try {
    const response = await fetch(
      `${API_BASE}/api/analytics/rwanda/cities?range=${range}`
    );

    if (!response.ok) {
      throw new Error(`Query failed: ${response.status}`);
    }

    const cities = await response.json();
    console.log("\n🏙️  Rwanda Cities - Performance Comparison:");
    console.log("─".repeat(70));

    cities.slice(0, 10).forEach((city, index) => {
      console.log(`
${index + 1}. ${city.city}${city.province ? ` (${city.province})` : ""}
   Download: ${city.averageDownload} Mbps | Upload: ${city.averageUpload} Mbps
   Ping: ${city.averagePing}ms | Tests: ${city.testCount}`);
    });

    return cities;
  } catch (error) {
    console.error("✗ Failed to get city stats:", error.message);
  }
}

/**
 * Get ISP Performance by City
 */
async function getIspCityComparison(range = "30d") {
  try {
    const response = await fetch(
      `${API_BASE}/api/analytics/rwanda/isp-city-comparison?range=${range}`
    );

    if (!response.ok) {
      throw new Error(`Query failed: ${response.status}`);
    }

    const comparisons = await response.json();
    console.log("\n🔍 ISP Performance by City (Top 10):");
    console.log("─".repeat(70));

    comparisons.slice(0, 10).forEach((comp) => {
      console.log(`
${comp.isp} in ${comp.city}
   Download: ${comp.averageDownload} Mbps | Upload: ${comp.averageUpload} Mbps
   Tests: ${comp.testCount}`);
    });

    return comparisons;
  } catch (error) {
    console.error("✗ Failed to get ISP-city comparison:", error.message);
  }
}

/**
 * Privacy Features Demo
 */
function demonstrizePrivacyFeatures() {
  console.log("\n🔒 Privacy Features:");
  console.log("─".repeat(70));
  console.log(`
✓ IP Address: Hashed with SHA-256 (cannot be reversed)
✓ Coordinates: Rounded to 2 decimal places for privacy
✓ No PII: Personal information is never collected
✓ No Tracking: Results are aggregated only
✓ Data Retention: Records kept for 90 days maximum
✓ Encryption: All data encrypted in transit (HTTPS)
✓ Database: Follows PostgreSQL security best practices

Your privacy is our priority. No individual data is ever displayed publicly.
`);
}

/**
 * Main execution
 */
async function main() {
  console.log("\n");
  console.log("╔".padEnd(71, "═") + "╗");
  console.log("║ Rwanda Internet Speed Test Analytics - Demo".padEnd(71) + "║");
  console.log("╚".padEnd(71, "═") + "╝");

  // Step 1: Demonstrate privacy
  demonstrizePrivacyFeatures();

  // Step 2: Submit test data
  console.log("\n📝 Submitting anonymous speed tests...\n");
  for (const testData of testDataSamples) {
    await submitSpeedTest(testData);
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Step 3: Query analytics
  await getRwandaOverview("30d");
  await getRwandaRankings("30d");
  await getCityStats("30d");
  await getIspCityComparison("30d");

  console.log("\n✅ Demo completed!\n");
  console.log("API Endpoints Available:");
  console.log("  GET  /api/analytics/rwanda");
  console.log("  GET  /api/analytics/rwanda/isp-rankings");
  console.log("  GET  /api/analytics/rwanda/cities");
  console.log("  GET  /api/analytics/rwanda/isp-city-comparison");
  console.log("  POST /api/analytics/submit");
  console.log("\nAll data is collected anonymously with privacy protection.\n");
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  submitSpeedTest,
  getRwandaRankings,
  getRwandaOverview,
  getCityStats,
  getIspCityComparison,
};
