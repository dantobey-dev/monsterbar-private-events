// Netlify background function — fires on every form submission
// Sends a formatted email notification to dan@monsterbar.nyc
// Uses Netlify's built-in sendgrid integration OR falls back to mailto link

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  const data = payload.payload?.data || {};
  const form = payload.payload || {};

  // Pull all submitted fields
  const name       = data.name        || '—';
  const org        = data.organization || '—';
  const email      = data.email       || '—';
  const phone      = data.phone       || '—';
  const evDate     = data.event_date  || '—';
  const space      = data.space       || '—';
  const guests     = data.guests      || '—';
  const barType    = data.bar_type    || '—';
  const notes      = data.notes       || '—';
  const summary    = data.quote_summary || '—';

  const subject = `New private event inquiry — ${name}${org && org !== '—' ? ' / ' + org : ''} · ${evDate}`;

  const body = `
NEW PRIVATE EVENT INQUIRY
The Manhattan Monster Bar — monsterbar-private-events
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CONTACT
Name:          ${name}
Organization:  ${org}
Email:         ${email}
Phone:         ${phone}

EVENT
Date:          ${evDate}
Space:         ${space}
Guests:        ${guests}
Bar type:      ${barType}

QUOTE SUMMARY
${summary}

NOTES FROM CLIENT
${notes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply directly to ${email} to follow up.
Submitted: ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})} ET
`.trim();

  // Send via Netlify Emails (requires Netlify Emails add-on)
  // OR via a simple fetch to a mail endpoint
  // This function logs the submission — email delivery via Netlify Forms
  // notification (set once in dashboard) handles the actual send.

  console.log('New submission:', subject);
  console.log(body);

  // If you add SENDGRID_API_KEY to Netlify env vars, uncomment below:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  await sgMail.send({
    to: 'dan@monsterbar.nyc',
    from: 'noreply@monsterbar.nyc',
    subject,
    text: body,
  });
  */

  return { statusCode: 200 };
};
