import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM || "SchoolDesk <noreply@mail.ibiz.name.ng>";

export async function sendEnquiryConfirmation(opts: {
  to: string; parentName: string; childName: string; division: string;
}) {
  return resend.emails.send({
    from: FROM, to: opts.to,
    subject: "We received your admission enquiry — Cecilia Learning Academy",
    html: `
      <div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;color:#0F2D5C">
        <div style="background:#0F2D5C;padding:28px 32px;display:flex;align-items:center;gap:16px">
          <div style="background:#C0182A;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:bold;color:white;font-family:Georgia,serif">C</div>
          <div>
            <div style="color:white;font-size:18px;font-weight:bold">Cecilia Learning Academy</div>
            <div style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:2px;text-transform:uppercase">Learning for Development</div>
          </div>
        </div>
        <div style="padding:36px 32px;border:1px solid #E8ECF2;border-top:none">
          <p style="font-size:16px;margin-bottom:8px">Dear ${opts.parentName},</p>
          <p style="color:#4A5568;line-height:1.7">Thank you for your interest in enrolling <strong>${opts.childName}</strong> in our <strong>${opts.division}</strong> programme. We have received your enquiry and our admissions team will contact you within <strong>24–48 hours</strong>.</p>
          <div style="background:#F5F7FA;border-left:4px solid #C0182A;padding:16px 20px;margin:24px 0">
            <p style="margin:0;font-size:13px;color:#4A5568">Questions? Call us on <a href="tel:08037925637" style="color:#C0182A;font-weight:bold">08037925637</a> or email <a href="mailto:info@cecilialearningacademy.com.ng" style="color:#C0182A">info@cecilialearningacademy.com.ng</a></p>
          </div>
        </div>
        <div style="background:#F5F7FA;padding:16px 32px;text-align:center">
          <p style="color:#9BA8BC;font-size:11px;margin:0">© ${new Date().getFullYear()} Cecilia Learning Academy · 4 Miller Avenue, Rumuolumeni, Port Harcourt</p>
        </div>
      </div>`,
  });
}

export async function sendContactConfirmation(opts: { to: string; name: string; subject: string; }) {
  return resend.emails.send({
    from: FROM, to: opts.to,
    subject: `Message received: ${opts.subject} — Cecilia Learning Academy`,
    html: `<div style="font-family:Georgia,serif;max-width:580px;margin:0 auto;color:#0F2D5C">
      <div style="background:#0F2D5C;padding:28px 32px"><div style="color:white;font-size:18px;font-weight:bold">Cecilia Learning Academy</div></div>
      <div style="padding:36px 32px;border:1px solid #E8ECF2;border-top:none">
        <p>Dear ${opts.name},</p>
        <p style="color:#4A5568;line-height:1.7">We have received your message regarding <strong>"${opts.subject}"</strong> and will respond within 24 hours.</p>
      </div>
      <div style="background:#F5F7FA;padding:16px 32px;text-align:center">
        <p style="color:#9BA8BC;font-size:11px;margin:0">© ${new Date().getFullYear()} Cecilia Learning Academy</p>
      </div>
    </div>`,
  });
}
