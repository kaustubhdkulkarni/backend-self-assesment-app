const client = require('@sendgrid/client');
const logger = require('../../config/logger');

// SendGrid Configuration
const apiKey = process.env.SENDGRID_API_KEY;
client.setApiKey(apiKey);

const getSuppressionData = async () => {
  try {
    console.log('\n========================================');
    console.log('🚫 SENDGRID SUPPRESSION & BOUNCE REPORT');
    console.log('========================================\n');
    
    console.log('⏳ Fetching suppression data from SendGrid...\n');
    
    // Get bounces (hard bounces - invalid/non-existent emails)
    console.log('📥 Fetching bounces...');
    const [bouncesResponse] = await client.request({
      url: '/v3/suppression/bounces',
      method: 'GET'
    });
    
    // Get spam reports (users marked email as spam)
    console.log('📥 Fetching spam reports...');
    const [spamResponse] = await client.request({
      url: '/v3/suppression/spam_reports',
      method: 'GET'
    });
    
    // Get invalid emails
    console.log('📥 Fetching invalid emails...');
    const [invalidResponse] = await client.request({
      url: '/v3/suppression/invalid_emails',
      method: 'GET'
    });
    
    // Get blocks (soft bounces/temporary failures)
    console.log('📥 Fetching blocks...');
    const [blocksResponse] = await client.request({
      url: '/v3/suppression/blocks',
      method: 'GET'
    });
    
    // Get global unsubscribes (revoked permissions)
    console.log('📥 Fetching global unsubscribes...\n');
    const [unsubscribesResponse] = await client.request({
      url: '/v3/suppression/unsubscribes',
      method: 'GET'
    });
    
    const bounces = bouncesResponse.body || [];
    const spamReports = spamResponse.body || [];
    const invalidEmails = invalidResponse.body || [];
    const blocks = blocksResponse.body || [];
    const unsubscribes = unsubscribesResponse.body || [];
    
    console.log('✅ SUCCESS - All suppression data retrieved\n');
    
    console.log('========================================');
    console.log('📊 SUPPRESSION SUMMARY');
    console.log('========================================');
    console.log(`Total Bounces (Hard): ${bounces.length}`);
    console.log(`Total Spam Reports: ${spamReports.length}`);
    console.log(`Total Invalid Emails: ${invalidEmails.length}`);
    console.log(`Total Blocks (Soft): ${blocks.length}`);
    console.log(`Total Unsubscribes: ${unsubscribes.length}`);
    console.log(`\n🔴 Total Suppressed: ${bounces.length + spamReports.length + invalidEmails.length + blocks.length + unsubscribes.length}`);
    console.log('========================================\n');
    
    // Display Bounces
    if (bounces.length > 0) {
      console.log('========================================');
      console.log('⚠️  HARD BOUNCES (Invalid/Non-existent Emails)');
      console.log('========================================');
      console.log('These emails do NOT exist and should be removed immediately.\n');
      console.table(bounces.map(bounce => ({
        email: bounce.email,
        created: new Date(bounce.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reason: bounce.reason || 'N/A'
      })));
      console.log('');
    } else {
      console.log('✅ No hard bounces found\n');
    }
    
    // Display Blocks (Soft Bounces)
    if (blocks.length > 0) {
      console.log('========================================');
      console.log('🚧 BLOCKS (Soft Bounces - Temporary Issues)');
      console.log('========================================');
      console.log('These are temporary delivery failures (full mailbox, server down, etc.)\n');
      console.table(blocks.map(block => ({
        email: block.email,
        created: new Date(block.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reason: block.reason || 'N/A'
      })));
      console.log('');
    } else {
      console.log('✅ No blocks (soft bounces) found\n');
    }
    
    // Display Spam Reports
    if (spamReports.length > 0) {
      console.log('========================================');
      console.log('🚨 SPAM REPORTS (Marked as Spam)');
      console.log('========================================');
      console.log('These users marked your emails as SPAM!\n');
      console.table(spamReports.map(spam => ({
        email: spam.email,
        created: new Date(spam.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      })));
      console.log('');
    } else {
      console.log('✅ No spam reports found\n');
    }
    
    // Display Invalid Emails
    if (invalidEmails.length > 0) {
      console.log('========================================');
      console.log('❌ INVALID EMAIL ADDRESSES');
      console.log('========================================');
      console.log('These email addresses have invalid format or syntax.\n');
      console.table(invalidEmails.map(invalid => ({
        email: invalid.email,
        created: new Date(invalid.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        reason: invalid.reason || 'N/A'
      })));
      console.log('');
    } else {
      console.log('✅ No invalid emails found\n');
    }
    
    // Display Unsubscribes (Revoked Permissions)
    if (unsubscribes.length > 0) {
      console.log('========================================');
      console.log('🔕 GLOBAL UNSUBSCRIBES (Revoked Permissions)');
      console.log('========================================');
      console.log('These users unsubscribed from ALL your emails.\n');
      console.table(unsubscribes.map(unsub => ({
        email: unsub.email,
        created: new Date(unsub.created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      })));
      console.log('');
    } else {
      console.log('✅ No unsubscribes found\n');
    }
    
    // Detailed breakdown
    console.log('========================================');
    console.log('📋 SUPPRESSION BREAKDOWN');
    console.log('========================================');
    
    const totalSuppressions = bounces.length + spamReports.length + invalidEmails.length + blocks.length + unsubscribes.length;
    
    if (totalSuppressions > 0) {
      const bouncePercentage = ((bounces.length / totalSuppressions) * 100).toFixed(2);
      const spamPercentage = ((spamReports.length / totalSuppressions) * 100).toFixed(2);
      const invalidPercentage = ((invalidEmails.length / totalSuppressions) * 100).toFixed(2);
      const blockPercentage = ((blocks.length / totalSuppressions) * 100).toFixed(2);
      const unsubPercentage = ((unsubscribes.length / totalSuppressions) * 100).toFixed(2);
      
      console.log(`Hard Bounces: ${bounces.length} (${bouncePercentage}%)`);
      console.log(`Soft Bounces/Blocks: ${blocks.length} (${blockPercentage}%)`);
      console.log(`Invalid Emails: ${invalidEmails.length} (${invalidPercentage}%)`);
      console.log(`Spam Reports: ${spamReports.length} (${spamPercentage}%)`);
      console.log(`Unsubscribes: ${unsubscribes.length} (${unsubPercentage}%)`);
    } else {
      console.log('🎉 No suppressions found - Your list is clean!');
    }
    
    console.log('========================================\n');
    
    // Raw JSON Data
    console.log('========================================');
    console.log('📄 RAW JSON DATA');
    console.log('========================================');
    
    const result = {
      status: true,
      code: 200,
      data: {
        bounces,
        spamReports,
        invalidEmails,
        blocks,
        unsubscribes,
        summary: {
          totalBounces: bounces.length,
          totalSpamReports: spamReports.length,
          totalInvalidEmails: invalidEmails.length,
          totalBlocks: blocks.length,
          totalUnsubscribes: unsubscribes.length,
          totalSuppressions: totalSuppressions
        }
      }
    };
    
    console.log(JSON.stringify(result, null, 2));
    console.log('========================================\n');
    
    console.log('✨ Suppression report completed successfully!\n');
    
    return result;
    
  } catch (error) {
    console.log('\n❌ ERROR - Failed to retrieve suppression data\n');
    console.log('========================================');
    console.log('ERROR DETAILS');
    console.log('========================================');
    console.error(`Error Message: ${error.message}`);
    
    if (error.response) {
      console.error(`Status Code: ${error.response.statusCode}`);
      console.error(`Response Body: ${JSON.stringify(error.response.body, null, 2)}`);
    }
    
    console.log('========================================\n');
    
    logger.error(`Error fetching suppression data: ${error.message}`);
    
    return { 
      status: false, 
      code: 500, 
      msg: 'Failed to fetch suppression data',
      error: error.message 
    };
  }
};

module.exports = getSuppressionData;

// Direct execution with full console output
if (require.main === module) {
  (async () => {
    try {
      const result = await getSuppressionData();
      process.exit(result.status ? 0 : 1);
    } catch (error) {
      console.log('\n❌ FATAL ERROR\n');
      console.log('========================================');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      console.log('========================================\n');
      process.exit(1);
    }
  })();
}
