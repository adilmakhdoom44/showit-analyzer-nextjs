import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const TO_EMAIL = 'adil.makhdoom44@gmail.com';

const MC_API_KEY    = process.env.MAILCHIMP_API_KEY!;
const MC_AUDIENCE   = process.env.MAILCHIMP_AUDIENCE_ID!;
const MC_SERVER     = process.env.MAILCHIMP_SERVER ?? 'us20';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, type, message } = await req.json();

    if (!name || !email || !type || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    const typeLabels: Record<string, string> = {
      bug:      '🐛 Bug Report',
      feature:  '💡 Feature Request',
      general:  '❓ General Question',
      strategy: '📞 Strategy Call Request',
    };
    const label = typeLabels[type] ?? type;
    const [firstName, ...rest] = name.trim().split(' ');
    const lastName = rest.join(' ') || '';

    // ── 1. Save lead to Mailchimp ────────────────────────────────────────
    if (MC_API_KEY && MC_AUDIENCE) {
      try {
        const mcRes = await fetch(
          `https://${MC_SERVER}.api.mailchimp.com/3.0/lists/${MC_AUDIENCE}/members`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${Buffer.from(`anystring:${MC_API_KEY}`).toString('base64')}`,
            },
            body: JSON.stringify({
              email_address: email,
              status: 'subscribed',
              merge_fields: {
                FNAME:   firstName,
                LNAME:   lastName,
                PHONE:   phone || '',
                MTYPE:   label,
                MESSAGE: message.slice(0, 255),
              },
            }),
          }
        );
        const mcData = await mcRes.json();
        // 400 with "Member Exists" is fine — just update instead
        if (!mcRes.ok && mcData.title !== 'Member Exists') {
          console.error('Mailchimp error:', mcData);
        }
      } catch (mcErr) {
        console.error('Mailchimp request failed:', mcErr);
      }
    }

    // ── 2. Send notification email ───────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = `
        <div style="font-family:sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#111;">
          <div style="background:#6366f1;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <h2 style="margin:0;color:#fff;font-size:18px;">New Contact Form Submission</h2>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">showitanalyzer.com/contact</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:10px 12px;font-weight:700;color:#555;width:90px;">Name</td>
              <td style="padding:10px 12px;">${name}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:10px 12px;font-weight:700;color:#555;">Email</td>
              <td style="padding:10px 12px;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:10px 12px;font-weight:700;color:#555;">Phone</td>
              <td style="padding:10px 12px;">${phone || '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0;">
              <td style="padding:10px 12px;font-weight:700;color:#555;">Type</td>
              <td style="padding:10px 12px;">${label}</td>
            </tr>
          </table>
          <div style="background:#fafafa;border:1px solid #e8e8e8;border-radius:10px;padding:16px 20px;font-size:14px;line-height:1.7;white-space:pre-wrap;margin-bottom:24px;">${message}</div>
          <a href="mailto:${email}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:10px 22px;border-radius:8px;font-size:13px;font-weight:600;">
            Reply to ${name} →
          </a>
          <p style="margin:24px 0 0;font-size:11px;color:#aaa;">Received ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
        </div>
      `;
      await resend.emails.send({
        from: 'Showit Analyzer <onboarding@resend.dev>',
        to: TO_EMAIL,
        replyTo: email,
        subject: `[Showit Analyzer] ${label} from ${name}`,
        html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
