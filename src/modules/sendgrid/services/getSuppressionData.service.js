const client = require('@sendgrid/client');
const logger = require('../../../config/logger');

// SendGrid Configuration
const apiKey = process.env.SENDGRID_API_KEY;
client.setApiKey(apiKey);

const getSuppressionData = async (days = null, specificDate = null) => {
  try {
    let startTime = null;
    let endTime = null;
    let dateRangeUsed = false;

    // Calculate date range if days provided
    if (days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      startTime = Math.floor(startDate.getTime() / 1000);
      endTime = Math.floor(endDate.getTime() / 1000);
      dateRangeUsed = true;
    }
    
    // Use specific date if provided (overrides days)
    if (specificDate) {
      const date = new Date(specificDate);
      date.setHours(0, 0, 0, 0); // Start of day
      const endDate = new Date(specificDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      
      startTime = Math.floor(date.getTime() / 1000);
      endTime = Math.floor(endDate.getTime() / 1000);
      dateRangeUsed = true;
    }

    // Build query params
    const queryParams = dateRangeUsed ? { start_time: startTime, end_time: endTime } : {};

    // Get bounces (hard bounces - invalid/non-existent emails)
    const [bouncesResponse] = await client.request({
      url: '/v3/suppression/bounces',
      method: 'GET',
      qs: queryParams
    });
    
    // Get spam reports (users marked email as spam)
    const [spamResponse] = await client.request({
      url: '/v3/suppression/spam_reports',
      method: 'GET',
      qs: queryParams
    });
    
    // Get invalid emails
    const [invalidResponse] = await client.request({
      url: '/v3/suppression/invalid_emails',
      method: 'GET',
      qs: queryParams
    });
    
    // Get blocks (soft bounces/temporary failures)
    const [blocksResponse] = await client.request({
      url: '/v3/suppression/blocks',
      method: 'GET',
      qs: queryParams
    });
    
    // Get global unsubscribes (revoked permissions)
    const [unsubscribesResponse] = await client.request({
      url: '/v3/suppression/unsubscribes',
      method: 'GET',
      qs: queryParams
    });
    
    const bounces = bouncesResponse.body || [];
    const spamReports = spamResponse.body || [];
    const invalidEmails = invalidResponse.body || [];
    const blocks = blocksResponse.body || [];
    const unsubscribes = unsubscribesResponse.body || [];
    
    const totalSuppressions = bounces.length + spamReports.length + invalidEmails.length + blocks.length + unsubscribes.length;
    
    // Format data with IST timezone
    const formatSuppressionData = (data) => {
      return data.map(item => ({
        email: item.email,
        reason: item.reason || 'N/A',
        created: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        createdTimestamp: item.created,
        createdDate: new Date(item.created * 1000).toISOString().split('T')[0]
      }));
    };

    // Group by date for daily breakdown
    const groupByDate = (data) => {
      const grouped = {};
      data.forEach(item => {
        const date = new Date(item.createdTimestamp * 1000).toISOString().split('T')[0];
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(item);
      });
      return grouped;
    };

    const formattedBounces = formatSuppressionData(bounces);
    const formattedSpamReports = spamReports.map(item => ({
      email: item.email,
      created: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      createdTimestamp: item.created,
      createdDate: new Date(item.created * 1000).toISOString().split('T')[0]
    }));
    const formattedInvalidEmails = formatSuppressionData(invalidEmails);
    const formattedBlocks = formatSuppressionData(blocks);
    const formattedUnsubscribes = unsubscribes.map(item => ({
      email: item.email,
      created: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      createdTimestamp: item.created,
      createdDate: new Date(item.created * 1000).toISOString().split('T')[0]
    }));

    // Create daily breakdown
    const dailyBreakdown = {};
    
    [...formattedBounces, ...formattedSpamReports, ...formattedInvalidEmails, ...formattedBlocks, ...formattedUnsubscribes]
      .forEach(item => {
        const date = item.createdDate;
        if (!dailyBreakdown[date]) {
          dailyBreakdown[date] = {
            date,
            bounces: 0,
            spamReports: 0,
            invalidEmails: 0,
            blocks: 0,
            unsubscribes: 0,
            total: 0
          };
        }
      });

    formattedBounces.forEach(item => {
      if (dailyBreakdown[item.createdDate]) {
        dailyBreakdown[item.createdDate].bounces++;
        dailyBreakdown[item.createdDate].total++;
      }
    });

    formattedSpamReports.forEach(item => {
      if (dailyBreakdown[item.createdDate]) {
        dailyBreakdown[item.createdDate].spamReports++;
        dailyBreakdown[item.createdDate].total++;
      }
    });

    formattedInvalidEmails.forEach(item => {
      if (dailyBreakdown[item.createdDate]) {
        dailyBreakdown[item.createdDate].invalidEmails++;
        dailyBreakdown[item.createdDate].total++;
      }
    });

    formattedBlocks.forEach(item => {
      if (dailyBreakdown[item.createdDate]) {
        dailyBreakdown[item.createdDate].blocks++;
        dailyBreakdown[item.createdDate].total++;
      }
    });

    formattedUnsubscribes.forEach(item => {
      if (dailyBreakdown[item.createdDate]) {
        dailyBreakdown[item.createdDate].unsubscribes++;
        dailyBreakdown[item.createdDate].total++;
      }
    });

    const sortedDailyBreakdown = Object.values(dailyBreakdown).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    // Build date range info
    let dateRangeInfo = {};
    if (specificDate) {
      dateRangeInfo = {
        type: 'specific_date',
        date: specificDate
      };
    } else if (days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateRangeInfo = {
        type: 'date_range',
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
        days: days
      };
    } else {
      dateRangeInfo = {
        type: 'all_time',
        note: 'Showing all suppressions (no date filter applied)'
      };
    }
    
    return {
      status: true,
      code: 200,
      data: {
        summary: {
          totalBounces: bounces.length,
          totalSpamReports: spamReports.length,
          totalInvalidEmails: invalidEmails.length,
          totalBlocks: blocks.length,
          totalUnsubscribes: unsubscribes.length,
          totalSuppressions: totalSuppressions,
          dateRange: dateRangeInfo
        },
        dailyBreakdown: sortedDailyBreakdown,
        bounces: formattedBounces,
        spamReports: formattedSpamReports,
        invalidEmails: formattedInvalidEmails,
        blocks: formattedBlocks,
        unsubscribes: formattedUnsubscribes
      }
    };
    
  } catch (error) {
    logger.error(`Error fetching suppression data: ${error.message}`);
    
    if (error.response) {
      logger.error(`SendGrid API Error get suppressionData: ${JSON.stringify(error.response.body)}`);
    }
    
    return { 
      status: false, 
      code: error.response?.statusCode || 500, 
      msg: 'Failed to fetch suppression data',
      error: error.message 
    };
  }
};

module.exports = getSuppressionData;
