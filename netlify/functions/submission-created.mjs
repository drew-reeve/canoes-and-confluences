// Runs automatically every time a Netlify form is submitted (after spam filtering).
// Sends Laurie a clean, formatted email for each request, with Reply-To set to the
// person who wrote in, and sends that person a short confirmation.
//
// Turned OFF until these environment variables are set in Netlify
// (Project configuration > Environment variables):
//   RESEND_API_KEY  API key from resend.com
//   FROM_EMAIL      a verified sender, e.g. "Canoes and Confluences <hello@canoesandconfluences.com>"
//   NOTIFY_TO       where requests go (defaults to Laurie's Gmail)
//   SEND_CONFIRMATIONS  "true" to email the person a confirmation

const FORM_LABELS = {
  contact: 'New inquiry',
  booking: 'Booking request',
  question: 'Question',
  'lesson-request': 'Lesson request',
  newsletter: 'Email list signup'
};
const SKIP = new Set(['ip', 'user_agent', 'referrer', 'subject', 'bot-field', 'form-name']);

const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function notificationHtml(label, data, submittedAt) {
  const rows = Object.entries(data)
    .filter(([k, v]) => !SKIP.has(k) && String(v).trim() !== '')
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e6dfd0;color:#1E5560;font-weight:600;vertical-align:top;white-space:nowrap">${esc(k.charAt(0).toUpperCase() + k.slice(1))}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e6dfd0;color:#1C2733;white-space:pre-wrap">${esc(v)}</td>
      </tr>`).join('');
  return `
  <div style="background:#EFE8DA;padding:24px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden">
      <div style="background:#3D5A80;padding:20px 24px">
        <div style="color:#F2B035;font-family:Georgia,serif;font-size:22px">${esc(label)}</div>
        <div style="color:#EFE8DA;font-size:13px;margin-top:4px">canoesandconfluences.com &middot; ${esc(submittedAt)}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:15px">${rows}</table>
      <div style="padding:16px 24px;font-size:13px;color:#555">Hit reply to answer ${esc(data.name || 'them')} directly.</div>
    </div>
  </div>`;
}

function confirmationHtml(name, label) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;color:#1C2733;max-width:560px;line-height:1.6">
    <p>Hi ${esc(name || 'there')},</p>
    <p>Thanks for reaching out. Your ${esc(label.toLowerCase())} came through, and Laurie will reply within 3 business days. It may take a little longer if she's out in the field.</p>
    <p>Laurie Rudd<br>Canoes and Confluences<br><a href="https://canoesandconfluences.com">canoesandconfluences.com</a></p>
  </div>`;
}

async function send(apiKey, body) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) console.error('Email send failed', res.status, await res.text());
}

export const handler = async (event) => {
  const { RESEND_API_KEY, FROM_EMAIL, NOTIFY_TO = 'canoesandconfluences@gmail.com', SEND_CONFIRMATIONS } = process.env;
  if (!RESEND_API_KEY || !FROM_EMAIL) return { statusCode: 200, body: 'Email not configured' };

  const { payload } = JSON.parse(event.body);
  const data = payload.data || {};
  const label = FORM_LABELS[payload.form_name] || 'Website message';
  const subject = data.subject || `${label} from canoesandconfluences.com`;
  const submittedAt = new Date(payload.created_at || Date.now())
    .toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' });

  await send(RESEND_API_KEY, {
    from: FROM_EMAIL,
    to: NOTIFY_TO.split(',').map(s => s.trim()),
    reply_to: data.email || undefined,
    subject,
    html: notificationHtml(label, data, submittedAt)
  });

  if (SEND_CONFIRMATIONS === 'true' && data.email && payload.form_name !== 'newsletter') {
    await send(RESEND_API_KEY, {
      from: FROM_EMAIL,
      to: [data.email],
      reply_to: NOTIFY_TO.split(',')[0].trim(),
      subject: `We got your ${label.toLowerCase()}`,
      html: confirmationHtml(data.name, label)
    });
  }
  return { statusCode: 200, body: 'ok' };
};
