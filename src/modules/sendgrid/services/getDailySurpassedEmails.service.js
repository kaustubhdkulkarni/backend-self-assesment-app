const client = require('@sendgrid/client');
const logger = require('../../../config/logger');

// SendGrid Configuration
const apiKey = process.env.SENDGRID_API_KEY;
client.setApiKey(apiKey);

const getDailySurpassedEmails = async (days = 10) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const request = {
      url: '/v3/stats',
      method: 'GET',
      qs: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        aggregated_by: 'day'
      }
    };
    
    const [response] = await client.request(request);
    
    // Calculate total emails sent
    let totalSent = 0;
    let totalDelivered = 0;
    let totalOpens = 0;
    let totalClicks = 0;
    let totalBounces = 0;
    
    const dailyStats = response.body.map((stat) => {
      const metrics = stat.stats[0]?.metrics || {};
      const daySent = metrics.requests || 0;
      const dayDelivered = metrics.delivered || 0;
      const dayOpens = metrics.opens || 0;
      const dayClicks = metrics.clicks || 0;
      const dayBounces = metrics.bounces || 0;
      
      totalSent += daySent;
      totalDelivered += dayDelivered;
      totalOpens += dayOpens;
      totalClicks += dayClicks;
      totalBounces += dayBounces;
      
      return {
        date: stat.date,
        sent: daySent,
        delivered: dayDelivered,
        opens: dayOpens,
        clicks: dayClicks,
        bounces: dayBounces
      };
    });
    
    return {
      status: true,
      code: 200,
      data: {
        totalSent,
        totalDelivered,
        totalOpens,
        totalClicks,
        totalBounces,
        days,
        averagePerDay: Math.round(totalSent / days),
        deliveryRate: totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(2) + '%' : '0%',
        openRate: totalDelivered > 0 ? ((totalOpens / totalDelivered) * 100).toFixed(2) + '%' : '0%',
        clickRate: totalDelivered > 0 ? ((totalClicks / totalDelivered) * 100).toFixed(2) + '%' : '0%',
        bounceRate: totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) + '%' : '0%',
        dailyStats
      }
    };
  } catch (error) {
    logger.error(`Error fetching SendGrid stats: ${error.message}`);
    if (error.response) {
      logger.error(`SendGrid API Error getDailySurpassedEmails: ${JSON.stringify(error.response.body)}`);
    }
    return { 
      status: false, 
      code: 500, 
      msg: 'Failed to fetch email statistics',
      error: error.message 
    };
  }
};

module.exports = getDailySurpassedEmails;
