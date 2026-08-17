const nodemailer = require("nodemailer");

const brand = {
  name: "ARP Associates Chartered Accountants",
  displayName: "ARP ASSOCIATES",
  tagline: "CHARTERED ACCOUNTANTS",
  emailLogoUrl:
    "https://res.cloudinary.com/dygjhlvlg/image/upload/v1785916274/ca-logo_ofy8kv.png",
  shortName: "ARP Associates",
  primary: "#0B5CAD",
  primaryDark: "#063D78",
  orange: "#F58220",
  green: "#55B948",
  ink: "#16213E",
  muted: "#5F6F89",
  border: "#D9E7F7",
  soft: "#F4F8FD",
  phone: "+91 9032576131",
  email: "arpassociateshyd@gmail.com",
  website: "https://www.arpassociates.in",
  address:
    "1-11-122, Shyamlal Buildings, Begumpet, Hyderabad, Telangana - 500016.",
  headOfficeAddress:
    "133/1A, Pushka Bhavan, SN Banerjee Road, 4th Floor, Kolkata - 700013.",
  hours: "Mon - Sat | 10AM - 6PM",
};

const requiredEmailSettings = [
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "EMAIL_FROM",
  "ADMIN_EMAIL",
];

const getMissingEmailSettings = () =>
  requiredEmailSettings.filter((key) => !String(process.env[key] || "").trim());

const isEmailConfigured = () => getMissingEmailSettings().length === 0;

const assertEmailConfigured = () => {
  const missing = getMissingEmailSettings();
  if (missing.length) {
    const error = new Error(
      `Email service is not configured yet. Missing settings: ${missing.join(", ")}`,
    );
    error.code = "EMAIL_CONFIG_MISSING";
    throw error;
  }
};

const getTransporter = () => {
  assertEmailConfigured();

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure:
      String(process.env.EMAIL_SECURE || "").toLowerCase() === "true" ||
      Number(process.env.EMAIL_PORT) === 465,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const nl2br = (value = "") => escapeHtml(value).replace(/\r?\n/g, "<br/>");

const getLogoUrl = () => {
  return "https://res.cloudinary.com/dygjhlvlg/image/upload/v1785916274/ca-logo_ofy8kv.png";
};

const contactCard = ({ icon, title, value, href, width = "50%" }) => `
  <td width="${width}" valign="top" style="padding:6px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:#ffffff;border:1px solid ${brand.border};border-radius:12px;">
      <tr>
        <td width="46" valign="top" style="padding:14px 0 14px 14px;">
          <div style="width:36px;height:36px;border-radius:50%;background:${brand.primary};color:#ffffff;text-align:center;line-height:36px;font-size:13px;font-weight:800;">${icon}</div>
        </td>
        <td valign="top" style="padding:13px 14px 13px 10px;">
          <div style="font-size:13px;line-height:18px;color:${brand.primary};font-weight:800;margin:0 0 3px;">${title}</div>
          <a href="${href}" style="font-size:13px;line-height:20px;color:${brand.ink};text-decoration:none;">${value}</a>
        </td>
      </tr>
    </table>
  </td>`;

const stepCard = ({ icon, title, color }) => `
  <td class="step-cell" width="33.33%" valign="top" style="padding:5px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:#ffffff;border:1px solid ${brand.border};border-radius:12px;box-shadow:0 6px 16px rgba(11,92,173,0.07);">
      <tr>
        <td align="center" style="padding:14px 10px;">
          <div style="width:38px;height:38px;border-radius:50%;background:${color};color:#ffffff;text-align:center;line-height:38px;font-size:17px;font-weight:700;margin:0 auto 9px;">${icon}</div>
          <div style="font-size:12px;line-height:17px;color:${brand.ink};font-weight:700;">${title}</div>
        </td>
      </tr>
    </table>
  </td>`;

const buildCustomerAcknowledgementHtml = (lead) => {
  const currentYear = new Date().getFullYear();
  const safeLead = {
    name: escapeHtml(lead.name || "{{name}}"),
    email: escapeHtml(lead.email || "{{email}}"),
    phone: escapeHtml(lead.phone || "{{phone}}"),
    subject: escapeHtml(lead.subject || "{{subject}}"),
    message: nl2br(lead.message || "{{message}}"),
  };

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Thank You - ${brand.name}</title>
  </head>
  <body bgcolor="#EEF4FB" style="margin:0;padding:0;background:#EEF4FB;color:${brand.ink};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;color-scheme:light;forced-color-adjust:none;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">We have successfully received your request.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#EEF4FB" style="border-collapse:collapse;background:#EEF4FB;color:${brand.ink};color-scheme:light;forced-color-adjust:none;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="650" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:650px;border-collapse:separate;background:#ffffff;color:${brand.ink};border-radius:16px;overflow:hidden;box-shadow:0 20px 45px rgba(16,45,85,0.12);color-scheme:light;forced-color-adjust:none;">
            <tr>
              <td bgcolor="#ffffff" style="padding:22px 20px 18px;background:#ffffff;color:${brand.ink};border-bottom:3px solid ${brand.primary};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="left" valign="middle" style="padding:0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td valign="middle" style="padding:0 10px 0 0;">
                            <img src="${getLogoUrl()}" width="54" alt="${brand.displayName} logo" style="display:block;width:54px;max-width:54px;height:auto;border:0;outline:none;text-decoration:none;" />
                          </td>
                          <td width="1" style="width:1px;background:#9AA8BC;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td valign="middle" style="padding:0 0 0 10px;">
                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;line-height:25px;color:${brand.primary};font-weight:800;letter-spacing:1.3px;margin:0;white-space:nowrap;">${brand.displayName}</div>
                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;color:${brand.muted};font-weight:700;letter-spacing:2.6px;margin:0;white-space:nowrap;">${brand.tagline}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle" style="padding-left:8px;font-size:12px;line-height:18px;color:${brand.ink};white-space:nowrap;">
                      <a href="${brand.website}" style="color:${brand.ink};text-decoration:none;">www.arpassociates.in</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td bgcolor="#ffffff" style="padding:0;background:#ffffff;color:${brand.ink};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td valign="middle" width="58%" bgcolor="${brand.primaryDark}" style="padding:30px 16px 30px 28px;background:${brand.primaryDark};">
                      <div style="font-size:34px;line-height:40px;color:#ffffff;font-weight:800;letter-spacing:0;margin:0 0 6px;">Thank You!</div>
                      <div style="font-size:18px;line-height:25px;color:#ffffff;font-weight:700;margin:0 0 13px;">We have successfully received your request.</div>
                      <div style="width:50px;height:4px;background:${brand.orange};border-radius:6px;margin:0 0 13px;"></div>
                      <div style="font-size:13px;line-height:21px;color:#DCEBFF;">Your enquiry is now with our team and will be reviewed shortly.</div>
                    </td>
                    <td valign="middle" align="center" width="42%" bgcolor="${brand.primaryDark}" style="padding:24px 22px;background:${brand.primaryDark};">
                      <table role="presentation" width="138" height="122" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-collapse:separate;background:#ffffff;border-radius:18px;box-shadow:0 12px 24px rgba(0,0,0,0.16);">
                        <tr>
                          <td align="center" valign="middle" style="padding:16px;">
                            <div style="font-size:42px;line-height:48px;color:${brand.primary};">&#9993;</div>
                            <div style="width:36px;height:36px;border-radius:50%;background:${brand.green};color:#ffffff;line-height:36px;text-align:center;font-size:22px;font-weight:800;margin:-8px auto 0;">&#10003;</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td bgcolor="#ffffff" style="padding:34px 34px 10px;background:#ffffff;color:${brand.ink};">
                <p style="margin:0 0 18px;font-size:18px;line-height:28px;color:${brand.ink};">Dear <strong style="color:${brand.primary};">${safeLead.name}</strong>,</p>
                <p style="margin:0 0 14px;font-size:16px;line-height:28px;color:${brand.ink};">Thank you for contacting <strong style="color:${brand.primary};">${brand.name}</strong>.</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:28px;color:${brand.ink};">We have successfully received your enquiry. Our team is currently reviewing the information you submitted.</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${brand.soft}" style="border-collapse:separate;background:${brand.soft};border:1px solid ${brand.border};border-radius:16px;">
                  <tr>
                    <td style="padding:18px 18px 6px;">
                      <div style="font-size:18px;line-height:24px;color:${brand.primary};font-weight:800;margin:0 0 6px;">What happens next?</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 11px 15px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          ${stepCard({ icon: "1", title: "Our experts will review your enquiry.", color: brand.primary })}
                          ${stepCard({ icon: "2", title: "We will contact you within 24 hours.", color: brand.orange })}
                          ${stepCard({ icon: "3", title: "We will provide the best possible assistance.", color: brand.green })}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-collapse:separate;margin-top:22px;background:#ffffff;border:1px solid ${brand.border};border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-size:15px;line-height:22px;color:${brand.primary};font-weight:800;margin-bottom:10px;">Your enquiry details</div>
                      <div style="font-size:13px;line-height:22px;color:${brand.muted};"><strong style="color:${brand.ink};">Email:</strong> ${safeLead.email}</div>
                      <div style="font-size:13px;line-height:22px;color:${brand.muted};"><strong style="color:${brand.ink};">Phone:</strong> ${safeLead.phone}</div>
                      <div style="font-size:13px;line-height:22px;color:${brand.muted};"><strong style="color:${brand.ink};">Subject:</strong> ${safeLead.subject}</div>
                      <div style="font-size:13px;line-height:22px;color:${brand.muted};"><strong style="color:${brand.ink};">Message:</strong> ${safeLead.message}</div>
                    </td>
                  </tr>
                </table>

                <p style="margin:26px 0 8px;font-size:16px;line-height:28px;color:${brand.ink};">Thank you for choosing <strong style="color:${brand.primary};">${brand.name}</strong>.</p>
                <p style="margin:0 0 22px;font-size:16px;line-height:28px;color:${brand.ink};">We appreciate your trust and look forward to assisting you.</p>

                <p style="margin:0 0 4px;font-size:15px;line-height:24px;color:${brand.ink};">Warm Regards,</p>
                <p style="margin:0 0 26px;font-size:16px;line-height:24px;color:${brand.primary};font-weight:800;">${brand.name}</p>
              </td>
            </tr>

            <tr>
              <td bgcolor="#ffffff" style="padding:0 28px 30px;background:#ffffff;color:${brand.ink};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${brand.soft}" style="border-collapse:separate;background:${brand.soft};border:1px solid ${brand.border};border-radius:16px;box-shadow:0 8px 22px rgba(11,92,173,0.08);padding:10px;">
                  <tr>
                    ${contactCard({ icon: "P", title: "Phone", value: brand.phone, href: "tel:+919032576131" })}
                    ${contactCard({ icon: "E", title: "Email", value: brand.email, href: `mailto:${brand.email}` })}
                  </tr>
                  <tr>
                    ${contactCard({ icon: "W", title: "Website", value: "www.arpassociates.in", href: brand.website })}
                    ${contactCard({ icon: "H", title: "Working Hours", value: brand.hours, href: brand.website })}
                  </tr>
                  <tr>
                    ${contactCard({ icon: "A", title: "Head Office - Kolkata", value: brand.headOfficeAddress, href: brand.website })}
                    ${contactCard({ icon: "A", title: "Branch Office - Hyderabad", value: brand.address, href: brand.website })}
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td align="center" bgcolor="${brand.primaryDark}" style="padding:30px 28px;background:${brand.primaryDark};">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;font-style:italic;color:#ffffff;margin-bottom:18px;">Your Growth, Our Commitment.</div>
                <div style="width:280px;max-width:80%;height:1px;background:#7EADD9;margin:0 auto 18px;"></div>
                <div style="font-size:15px;line-height:22px;color:#ffffff;font-weight:700;margin-bottom:12px;">Stay Connected</div>
                <div style="margin-bottom:18px;">
                  <a href="#" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff;color:${brand.primary};line-height:34px;text-align:center;font-size:14px;font-weight:800;text-decoration:none;margin:0 5px;">f</a>
                  <a href="#" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff;color:${brand.primary};line-height:34px;text-align:center;font-size:14px;font-weight:800;text-decoration:none;margin:0 5px;">in</a>
                  <a href="#" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff;color:${brand.primary};line-height:34px;text-align:center;font-size:14px;font-weight:800;text-decoration:none;margin:0 5px;">ig</a>
                </div>
                <div style="font-size:12px;line-height:18px;color:#DCEBFF;">&copy; ${currentYear} ${brand.name}. All Rights Reserved.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const buildOtpHtml = ({ name, otp, purpose }) => {
  const currentYear = new Date().getFullYear();
  const safeName = escapeHtml(name || "User");
  const safePurpose = escapeHtml(purpose || "account verification");
  const safeOtp = escapeHtml(otp);

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Verification OTP - ${brand.name}</title>
  </head>
  <body bgcolor="#EEF4FB" style="margin:0;padding:0;background:#EEF4FB;color:${brand.ink};font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;color-scheme:light;forced-color-adjust:none;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your ARP Associates OTP is ${safeOtp}.</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#EEF4FB" style="border-collapse:collapse;background:#EEF4FB;color:${brand.ink};color-scheme:light;forced-color-adjust:none;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="650" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="width:100%;max-width:650px;border-collapse:separate;background:#ffffff;color:${brand.ink};border-radius:16px;overflow:hidden;box-shadow:0 20px 45px rgba(16,45,85,0.12);color-scheme:light;forced-color-adjust:none;">
            <tr>
              <td bgcolor="#ffffff" style="padding:22px 20px 18px;background:#ffffff;color:${brand.ink};border-bottom:3px solid ${brand.primary};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="left" valign="middle" style="padding:0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td valign="middle" style="padding:0 10px 0 0;">
                            <img src="${getLogoUrl()}" width="54" alt="${brand.displayName} logo" style="display:block;width:54px;max-width:54px;height:auto;border:0;outline:none;text-decoration:none;" />
                          </td>
                          <td width="1" style="width:1px;background:#9AA8BC;font-size:1px;line-height:1px;">&nbsp;</td>
                          <td valign="middle" style="padding:0 0 0 10px;">
                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:21px;line-height:25px;color:${brand.primary};font-weight:800;letter-spacing:1.3px;margin:0;white-space:nowrap;">${brand.displayName}</div>
                            <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:15px;color:${brand.muted};font-weight:700;letter-spacing:2.6px;margin:0;white-space:nowrap;">${brand.tagline}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td align="right" valign="middle" style="padding-left:8px;font-size:12px;line-height:18px;color:${brand.ink};white-space:nowrap;">
                      <a href="${brand.website}" style="color:${brand.ink};text-decoration:none;">www.arpassociates.in</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="${brand.primaryDark}" style="padding:32px 28px;background:${brand.primaryDark};">
                <div style="font-size:34px;line-height:40px;color:#ffffff;font-weight:800;letter-spacing:0;margin:0 0 6px;">Verification OTP</div>
                <div style="font-size:18px;line-height:25px;color:#ffffff;font-weight:700;margin:0 0 13px;">Use this code to continue your request.</div>
                <div style="width:50px;height:4px;background:${brand.orange};border-radius:6px;margin:0 0 13px;"></div>
                <div style="font-size:13px;line-height:21px;color:#DCEBFF;">This OTP is valid for 10 minutes.</div>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding:34px;background:#ffffff;color:${brand.ink};">
                <p style="margin:0 0 18px;font-size:18px;line-height:28px;color:${brand.ink};">Dear <strong style="color:${brand.primary};">${safeName}</strong>,</p>
                <p style="margin:0 0 20px;font-size:16px;line-height:28px;color:${brand.ink};">Your OTP for <strong style="color:${brand.primary};">${safePurpose}</strong> is:</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${brand.soft}" style="border-collapse:separate;background:${brand.soft};border:1px solid ${brand.border};border-radius:16px;">
                  <tr>
                    <td align="center" style="padding:26px 18px;">
                      <div style="font-size:38px;line-height:44px;color:${brand.primary};font-weight:800;letter-spacing:8px;margin:0;">${safeOtp}</div>
                      <div style="font-size:13px;line-height:20px;color:${brand.muted};font-weight:700;margin-top:10px;">${safePurpose}</div>
                    </td>
                  </tr>
                </table>
                <p style="margin:22px 0 0;font-size:14px;line-height:24px;color:${brand.muted};">If you did not request this, please ignore this email or contact ARP Associates.</p>
              </td>
            </tr>
            <tr>
              <td align="center" bgcolor="${brand.primaryDark}" style="padding:30px 28px;background:${brand.primaryDark};">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:28px;font-style:italic;color:#ffffff;margin-bottom:18px;">Your Growth, Our Commitment.</div>
                <div style="width:280px;max-width:80%;height:1px;background:#7EADD9;margin:0 auto 18px;"></div>
                <div style="font-size:12px;line-height:18px;color:#DCEBFF;">&copy; ${currentYear} ${brand.name}. All Rights Reserved.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const sendAdminNotification = async (lead) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Lead: ${String(lead.subject || "").replace(/[\r\n]/g, " ")}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#f6fbff;padding:32px;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#2c649c,#0254a0);padding:24px 32px;border-radius:8px 8px 0 0;">
          <h2 style="color:#fff;margin:0;font-size:20px;">New Lead Received</h2>
        </div>
        <div style="background:#fff;padding:28px 32px;border-radius:0 0 8px 8px;border:1px solid rgba(13,34,68,0.12);">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#33425e;font-size:14px;border-bottom:1px solid #eaf3fb;width:140px;"><strong>Name</strong></td><td style="padding:10px 0;color:#0d2244;font-size:14px;border-bottom:1px solid #eaf3fb;">${escapeHtml(lead.name)}</td></tr>
            <tr><td style="padding:10px 0;color:#33425e;font-size:14px;border-bottom:1px solid #eaf3fb;"><strong>Email</strong></td><td style="padding:10px 0;color:#0254a0;font-size:14px;border-bottom:1px solid #eaf3fb;">${escapeHtml(lead.email)}</td></tr>
            <tr><td style="padding:10px 0;color:#33425e;font-size:14px;border-bottom:1px solid #eaf3fb;"><strong>Phone</strong></td><td style="padding:10px 0;color:#0d2244;font-size:14px;border-bottom:1px solid #eaf3fb;">${escapeHtml(lead.phone)}</td></tr>
            <tr><td style="padding:10px 0;color:#33425e;font-size:14px;border-bottom:1px solid #eaf3fb;"><strong>Subject</strong></td><td style="padding:10px 0;color:#0d2244;font-size:14px;border-bottom:1px solid #eaf3fb;">${escapeHtml(lead.subject)}</td></tr>
            <tr><td style="padding:10px 0;color:#33425e;font-size:14px;"><strong>Message</strong></td><td style="padding:10px 0;color:#0d2244;font-size:14px;">${nl2br(lead.message)}</td></tr>
          </table>
          <p style="margin:20px 0 0;color:#33425e;font-size:13px;">Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
        </div>
      </div>`,
  });
};

const sendCustomerAcknowledgement = async (lead) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: lead.email,
    subject: "Thank You for Contacting Us - ARP Associates",
    html: buildCustomerAcknowledgementHtml(lead),
  });
};

const sendOtpEmail = async ({ to, name, otp, purpose }) => {
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `ARP Associates OTP for ${String(purpose || "verification").replace(/[\r\n]/g, " ")}`,
    html: buildOtpHtml({ name, otp, purpose }),
  });
};

const sendSecurityAlertEmail = async ({ to, name, resetLink }) => {
  const safeName = escapeHtml(name || "User");
  const safeResetLink = escapeHtml(resetLink || brand.website);
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "ARP Associates account security notice",
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;background:#f4f8fd;padding:28px;border-radius:14px;color:${brand.ink};">
        <div style="background:#ffffff;border:1px solid ${brand.border};border-radius:14px;padding:26px;">
          <h2 style="margin:0 0 12px;color:${brand.primary};font-size:22px;">Account security notice</h2>
          <p style="margin:0 0 14px;font-size:15px;line-height:24px;">Dear <strong>${safeName}</strong>,</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:24px;">We detected repeated unsuccessful sign-in attempts for your ARP Associates account. You can reset your password using the link below if this was not you.</p>
          <p style="margin:24px 0;">
            <a href="${safeResetLink}" style="display:inline-block;background:${brand.primary};color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:10px;">Reset password</a>
          </p>
          <p style="margin:0;font-size:13px;line-height:22px;color:${brand.muted};">If you did not request this, please contact ARP Associates.</p>
        </div>
      </div>`,
  });
};

module.exports = {
  sendAdminNotification,
  sendCustomerAcknowledgement,
  buildCustomerAcknowledgementHtml,
  sendOtpEmail,
  sendSecurityAlertEmail,
  getMissingEmailSettings,
  isEmailConfigured,
};
