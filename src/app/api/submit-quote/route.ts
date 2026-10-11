import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const RECIPIENT_EMAIL = 'jasurkhonazizkhonov@gmail.com';

interface AirportInfo {
  iata: string;
  name: string;
  city: string;
  country: string;
}

interface Segment {
  from: AirportInfo | null;
  to: AirportInfo | null;
  depart: string;
}

interface QuotePayload {
  tripType: 'roundtrip' | 'oneway' | 'multi';
  travelClass: 'economy' | 'premium' | 'business' | 'first';
  travelers: number;
  segments: Segment[];
  returnDate: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  submittedAt: string;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function tripLabel(t: QuotePayload['tripType']): string {
  return t === 'roundtrip' ? 'Round Trip' : t === 'oneway' ? 'One Way' : 'Multi-city';
}

function classLabel(c: QuotePayload['travelClass']): string {
  switch (c) {
    case 'first':
      return 'First Class';
    case 'business':
      return 'Business Class';
    case 'premium':
      return 'Premium Economy';
    case 'economy':
      return 'Economy';
    default:
      return String(c);
  }
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return iso;
  }
}

function airportBlock(a: AirportInfo | null): string {
  if (!a) {
    return `<span style="color:#999;">Not selected</span>`;
  }
  return `
    <div style="line-height:1.5;">
      <div style="font-size:20px;font-weight:700;color:#b91c1c;font-family:'Courier New',monospace;letter-spacing:1px;">
        ${escapeHtml(a.iata)}
      </div>
      <div style="font-size:15px;color:#111;font-weight:600;margin-top:2px;">
        ${escapeHtml(a.city)}, ${escapeHtml(a.country)}
      </div>
      <div style="font-size:12px;color:#666;margin-top:2px;">
        ${escapeHtml(a.name)}
      </div>
    </div>`;
}

function buildHtml(data: QuotePayload): string {
  const trip = tripLabel(data.tripType);
  const cabin = classLabel(data.travelClass);
  const totalSegments = data.segments.length;

  const segmentBlocks = data.segments
    .map(
      (s, i) => `
    <tr>
      <td style="padding:0 24px 16px 24px;">
        <div style="background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
          <!-- Flight header -->
          <div style="background:linear-gradient(90deg,#b91c1c 0%,#dc2626 100%);color:#fff;padding:10px 18px;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
            ${data.tripType === 'multi' ? `Flight ${i + 1} of ${totalSegments}` : trip}
          </div>

          <!-- Route -->
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:20px;width:45%;vertical-align:top;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;font-weight:600;margin-bottom:8px;">Departure</div>
                ${airportBlock(s.from)}
              </td>
              <td style="padding:20px 0;width:10%;text-align:center;vertical-align:middle;">
                <div style="font-size:24px;color:#b91c1c;">✈</div>
              </td>
              <td style="padding:20px;width:45%;vertical-align:top;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;font-weight:600;margin-bottom:8px;">Arrival</div>
                ${airportBlock(s.to)}
              </td>
            </tr>
          </table>

          <!-- Date -->
          <div style="border-top:1px solid #eee;padding:14px 20px;background:#fafafa;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;font-weight:600;">
                  Departure Date
                </td>
                <td style="text-align:right;font-size:14px;color:#111;font-weight:600;">
                  ${escapeHtml(formatDate(s.depart))}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </td>
    </tr>`
    )
    .join('');

  const returnBlock =
    data.tripType === 'roundtrip' && data.returnDate
      ? `
    <tr>
      <td style="padding:0 24px 16px 24px;">
        <div style="background:#fff;border:2px dashed #b91c1c;border-radius:12px;overflow:hidden;">
          <div style="background:#fef2f2;color:#b91c1c;padding:10px 18px;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">
            Return Flight
          </div>
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:20px;width:45%;vertical-align:top;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;font-weight:600;margin-bottom:8px;">Departure</div>
                ${airportBlock(data.segments[0]?.to || null)}
              </td>
              <td style="padding:20px 0;width:10%;text-align:center;vertical-align:middle;">
                <div style="font-size:24px;color:#b91c1c;">✈</div>
              </td>
              <td style="padding:20px;width:45%;vertical-align:top;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;font-weight:600;margin-bottom:8px;">Arrival</div>
                ${airportBlock(data.segments[0]?.from || null)}
              </td>
            </tr>
          </table>
          <div style="border-top:1px solid #eee;padding:14px 20px;background:#fafafa;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;font-weight:600;">
                  Return Date
                </td>
                <td style="text-align:right;font-size:14px;color:#111;font-weight:600;">
                  ${escapeHtml(formatDate(data.returnDate))}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </td>
    </tr>`
      : '';

  const cabinBadgeColor =
    data.travelClass === 'first'
      ? '#8b5cf6'
      : data.travelClass === 'business'
      ? '#b91c1c'
      : data.travelClass === 'premium'
      ? '#059669'
      : '#0369a1';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;">

  <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f3f4f6;padding:32px 12px;">
    <tr>
      <td align="center">

        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:680px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#7f1d1d 0%,#b91c1c 50%,#dc2626 100%);padding:36px 32px;color:#ffffff;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:4px;opacity:0.85;font-weight:600;margin-bottom:8px;">
                ✈  Elite Flights Travel
              </div>
              <div style="font-size:26px;font-weight:700;letter-spacing:-0.5px;margin-bottom:6px;">
                New Quote Request
              </div>
              <div style="font-size:14px;opacity:0.9;">
                From ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}
              </div>
            </td>
          </tr>

          <!-- SUMMARY STRIP -->
          <tr>
            <td style="padding:20px 24px;background:#111827;color:#fff;">
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="width:33%;text-align:center;padding:4px;border-right:1px solid #374151;">
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:4px;">Trip Type</div>
                    <div style="font-size:15px;font-weight:700;color:#fff;">${trip}</div>
                  </td>
                  <td style="width:34%;text-align:center;padding:4px;border-right:1px solid #374151;">
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:4px;">Cabin Class</div>
                    <div style="font-size:15px;font-weight:700;color:${cabinBadgeColor};">${cabin}</div>
                  </td>
                  <td style="width:33%;text-align:center;padding:4px;">
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:4px;">Travelers</div>
                    <div style="font-size:15px;font-weight:700;color:#fff;">${data.travelers} ${
    data.travelers === 1 ? 'Person' : 'People'
  }</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CLIENT INFO -->
          <tr>
            <td style="padding:28px 24px 12px 24px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#b91c1c;font-weight:700;margin-bottom:14px;">
                👤  Client Information
              </div>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;width:35%;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;font-weight:600;">Full Name</div>
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111;font-weight:600;">
                    ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;font-weight:600;">Email Address</div>
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;">
                    <a href="mailto:${escapeHtml(
                      data.email
                    )}" style="color:#b91c1c;text-decoration:none;font-weight:600;font-size:15px;">
                      ${escapeHtml(data.email)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;font-weight:600;">Phone Number</div>
                  </td>
                  <td style="padding:14px 18px;">
                    <a href="tel:${escapeHtml(
                      data.phone
                    )}" style="color:#b91c1c;text-decoration:none;font-weight:600;font-size:15px;">
                      ${escapeHtml(data.phone)}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TRIP DETAILS TABLE -->
          <tr>
            <td style="padding:20px 24px 12px 24px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#b91c1c;font-weight:700;margin-bottom:14px;">
                🎫  Trip Details
              </div>
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;width:35%;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;font-weight:600;">Trip Type</div>
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111;font-weight:600;">
                    ${trip}${data.tripType === 'multi' ? ` (${totalSegments} segments)` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;font-weight:600;">Cabin Class</div>
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #e5e7eb;font-size:15px;color:#111;font-weight:600;">
                    <span style="display:inline-block;background:${cabinBadgeColor};color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                      ${cabin}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;">
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6b7280;font-weight:600;">Number of Travelers</div>
                  </td>
                  <td style="padding:14px 18px;font-size:15px;color:#111;font-weight:600;">
                    ${data.travelers} ${data.travelers === 1 ? 'traveler' : 'travelers'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FLIGHT SEGMENTS -->
          <tr>
            <td style="padding:20px 0 8px 0;">
              <div style="padding:0 24px 14px 24px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#b91c1c;font-weight:700;">
                  🛫  Flight Itinerary
                </div>
              </div>
            </td>
          </tr>

          ${segmentBlocks}
          ${returnBlock}

          <!-- ACTION BOX -->
          <tr>
            <td style="padding:8px 24px 28px 24px;">
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#b91c1c;font-weight:700;margin-bottom:8px;">
                      ⚡ Action Required
                    </div>
                    <div style="font-size:14px;color:#7f1d1d;line-height:1.6;">
                      Please respond to this client within <strong>30 minutes</strong>.
                      Reply to this email or call the client directly at
                      <a href="tel:${escapeHtml(data.phone)}" style="color:#b91c1c;font-weight:600;">${escapeHtml(data.phone)}</a>.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <tr>
                  <td style="font-size:11px;color:#6b7280;line-height:1.6;">
                    <strong style="color:#111;">Submission Details</strong><br>
                    Submitted: ${escapeHtml(formatDateTime(data.submittedAt))}<br>
                    Source: Elite Flights Travel Website
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <div style="max-width:680px;margin:16px auto 0;text-align:center;font-size:11px;color:#9ca3af;line-height:1.6;">
          This email was sent automatically from your Elite Flights Travel website<br>
          when a customer submitted a quote request form.
        </div>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

function buildPlainText(data: QuotePayload): string {
  const trip = tripLabel(data.tripType);
  const cabin = classLabel(data.travelClass);

  const segments = data.segments
    .map((s, i) => {
      const fromStr = s.from
        ? `${s.from.iata} - ${s.from.city}, ${s.from.country} (${s.from.name})`
        : 'Not selected';
      const toStr = s.to
        ? `${s.to.iata} - ${s.to.city}, ${s.to.country} (${s.to.name})`
        : 'Not selected';
      return `FLIGHT ${i + 1}${data.tripType === 'multi' ? ` OF ${data.segments.length}` : ''}
  From:   ${fromStr}
  To:     ${toStr}
  Depart: ${formatDate(s.depart)}`;
    })
    .join('\n\n');

  const returnLine =
    data.tripType === 'roundtrip' && data.returnDate
      ? `\n\nRETURN FLIGHT\n  Depart: ${formatDate(data.returnDate)}`
      : '';

  return `================================================================
ELITE FLIGHTS TRAVEL - NEW QUOTE REQUEST
================================================================

CLIENT INFORMATION
------------------
  Name:  ${data.firstName} ${data.lastName}
  Email: ${data.email}
  Phone: ${data.phone}

TRIP DETAILS
------------
  Trip Type:    ${trip}${data.tripType === 'multi' ? ` (${data.segments.length} segments)` : ''}
  Cabin Class:  ${cabin}
  Travelers:    ${data.travelers} ${data.travelers === 1 ? 'person' : 'people'}

FLIGHT ITINERARY
----------------
${segments}${returnLine}

================================================================
ACTION REQUIRED: Please respond within 30 minutes.
Submitted: ${formatDateTime(data.submittedAt)}
================================================================
`;
}

export async function POST(request: Request) {
  try {
    const body: QuotePayload = await request.json();

    // Basic validation
    if (
      !body ||
      !body.firstName ||
      !body.lastName ||
      !body.email ||
      !body.phone ||
      !Array.isArray(body.segments) ||
      body.segments.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const html = buildHtml(body);
    const text = buildPlainText(body);
    const trip = tripLabel(body.tripType);
    const cabin = classLabel(body.travelClass);
    const firstSeg = body.segments[0];
    const routeSummary =
      firstSeg && firstSeg.from && firstSeg.to
        ? `${firstSeg.from.iata} → ${firstSeg.to.iata}${
            body.segments.length > 1 ? ` +${body.segments.length - 1}` : ''
          }`
        : 'New request';

    const subject = `✈ ${routeSummary} · ${cabin} · ${body.travelers}p · ${body.firstName} ${body.lastName}`;

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(
      /\s+/g,
      ''
    );

    if (gmailUser && gmailAppPassword) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      try {
        await transporter.sendMail({
          from: `"Elite Flights Travel" <${gmailUser}>`,
          to: RECIPIENT_EMAIL,
          subject,
          text,
          html,
          replyTo: `"${body.firstName} ${body.lastName}" <${body.email}>`,
        });
      } catch (mailErr) {
        console.error('Gmail send error:', mailErr);
        return NextResponse.json(
          {
            error:
              'The request was received but we could not deliver the notification email. Please try again or contact us by phone.',
          },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        '[submit-quote] GMAIL_USER / GMAIL_APP_PASSWORD not configured. Request logged only.'
      );
      console.log('[submit-quote] Subject:', subject);
      console.log('[submit-quote] Payload:', JSON.stringify(body, null, 2));
    }

    // Small delay for logs; keep suppressed variable usage.
    void trip;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('submit-quote error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
