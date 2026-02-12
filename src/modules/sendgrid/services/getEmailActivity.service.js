const client = require('@sendgrid/client');
const logger = require('../../../config/logger');

const apiKey = process.env.SENDGRID_API_KEY;
client.setApiKey(apiKey);

const getEmailActivity = async (days = 1) => {
  try {
    // NOTE: The /v3/messages endpoint requires a PAID add-on
    // This alternative uses free APIs: /v3/stats + /v3/suppression/*
    
    // 1. Get stats for the period (FREE API)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const statsRequest = {
      url: '/v3/stats',
      method: 'GET',
      qs: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        aggregated_by: 'day'
      }
    };
    
    const [statsResponse] = await client.request(statsRequest);
    
    // 2. Get recent bounces (FREE API)
    const [bouncesResponse] = await client.request({
      url: '/v3/suppression/bounces',
      method: 'GET',
      qs: {
        start_time: Math.floor(startDate.getTime() / 1000),
        end_time: Math.floor(new Date().getTime() / 1000)
      }
    });
    
    // 3. Get recent blocks (FREE API)
    const [blocksResponse] = await client.request({
      url: '/v3/suppression/blocks',
      method: 'GET',
      qs: {
        start_time: Math.floor(startDate.getTime() / 1000),
        end_time: Math.floor(new Date().getTime() / 1000)
      }
    });
    
    // 4. Get recent invalid emails (FREE API)
    const [invalidResponse] = await client.request({
      url: '/v3/suppression/invalid_emails',
      method: 'GET',
      qs: {
        start_time: Math.floor(startDate.getTime() / 1000),
        end_time: Math.floor(new Date().getTime() / 1000)
      }
    });

    // Process stats
    let totalSent = 0;
    let totalDelivered = 0;
    let totalOpens = 0;
    let totalClicks = 0;
    let totalBounces = 0;
    let totalDropped = 0;
    let totalDeferred = 0;
    
    const dailyStats = statsResponse.body.map((stat) => {
      const metrics = stat.stats[0]?.metrics || {};
      totalSent += metrics.requests || 0;
      totalDelivered += metrics.delivered || 0;
      totalOpens += metrics.opens || 0;
      totalClicks += metrics.clicks || 0;
      totalBounces += metrics.bounces || 0;
      totalDropped += metrics.drops || 0;
      totalDeferred += metrics.deferred || 0;
      
      return {
        date: stat.date,
        sent: metrics.requests || 0,
        delivered: metrics.delivered || 0,
        opens: metrics.opens || 0,
        clicks: metrics.clicks || 0,
        bounces: metrics.bounces || 0,
        dropped: metrics.drops || 0,
        deferred: metrics.deferred || 0
      };
    });

    // Format failed emails from suppression lists
    const bounces = (bouncesResponse.body || []).map(item => ({
      email: item.email,
      reason: item.reason || 'Unknown bounce reason',
      status: 'bounce',
      created: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      createdTimestamp: item.created
    }));

    const blocks = (blocksResponse.body || []).map(item => ({
      email: item.email,
      reason: item.reason || 'Blocked',
      status: 'blocked',
      created: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      createdTimestamp: item.created
    }));

    const invalids = (invalidResponse.body || []).map(item => ({
      email: item.email,
      reason: item.reason || 'Invalid email',
      status: 'invalid',
      created: new Date(item.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      createdTimestamp: item.created
    }));

    const allFailedEmails = [...bounces, ...blocks, ...invalids];
    const totalFailed = totalBounces + totalDropped;

    return {
      status: true,
      code: 200,
      data: {
        summary: {
          totalMessages: totalSent,
          dateRange: {
            from: startDate.toISOString().split('T')[0],
            to: new Date().toISOString().split('T')[0],
            days: days
          },
          counts: {
            sent: totalSent,
            delivered: totalDelivered,
            bounced: totalBounces,
            dropped: totalDropped,
            deferred: totalDeferred,
            failed: totalFailed,
            opened: totalOpens,
            clicked: totalClicks
          },
          rates: {
            deliveryRate: totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(2) + '%' : '0%',
            bounceRate: totalSent > 0 ? ((totalBounces / totalSent) * 100).toFixed(2) + '%' : '0%',
            dropRate: totalSent > 0 ? ((totalDropped / totalSent) * 100).toFixed(2) + '%' : '0%',
            openRate: totalDelivered > 0 ? ((totalOpens / totalDelivered) * 100).toFixed(2) + '%' : '0%',
            clickRate: totalDelivered > 0 ? ((totalClicks / totalDelivered) * 100).toFixed(2) + '%' : '0%'
          }
        },
        dailyStats,
        failedEmails: allFailedEmails,
        bouncedEmails: bounces,
        blockedEmails: blocks,
        invalidEmails: invalids,
        note: 'Email details require SendGrid Email Activity History add-on. Using stats + suppression APIs instead.'
      }
    };

  } catch (error) {
    logger.error(`Error fetching email activity: ${error.message}`);
    
    if (error.response) {
      logger.error(`SendGrid API Error getEmailActivity: ${JSON.stringify(error.response.body)}`);
      
      // Check for 403 Forbidden (Email Activity API not available)
      if (error.response.statusCode === 403) {
        return {
          status: false,
          code: 403,
          msg: 'Email Activity API requires "30 Days Additional Email Activity History" add-on. Please purchase from SendGrid Settings > Account Details > Your Products.',
          error: error.message,
          documentation: 'https://support.sendgrid.com/hc/en-us/articles/31240221874971'
        };
      }
    }
    
    return {
      status: false,
      code: error.response?.statusCode || 500,
      msg: error.response?.body?.errors?.[0]?.message || 'Failed to fetch email activity',
      error: error.message
    };
  }
};

module.exports = getEmailActivity;
