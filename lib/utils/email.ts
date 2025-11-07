import nodemailer from "nodemailer";

const BRAND_NAME = "Naiem Shaikh";
const BRAND_LOGO = "https://imagizer.imageshack.com/img923/2457/VbSgG9.png";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// ------------------------ OTP EMAIL ------------------------
export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: `"${BRAND_NAME}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Your OTP for ${BRAND_NAME}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP Verification • ${BRAND_NAME}</title>
        <style>
          body { margin:0; padding:0; font-family:Arial,sans-serif; background-color:#121212; color:#fff; }
          .container { max-width:600px; margin:0 auto; background:#1e1e1e; border-radius:16px; padding:40px 20px; text-align:center; }
          .otp-code h2 { font-size:42px; letter-spacing:8px; color:#ff006e; margin:20px 0; }
          .timer-bar { width:100%; height:6px; background-color:#ff006e; border-radius:4px; animation: countdown 600s linear forwards; margin:20px 0; }
          @keyframes countdown { from { width:100%; } to { width:0%; } }
          .social-links img { width:24px; height:24px; margin:0 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="https://naiemshaikh.com" target="_blank">
            <img src="${BRAND_LOGO}" width="120" alt="${BRAND_NAME} Logo" style="margin-bottom:20px;" />
          </a>
          <h2 style="color:#f0f0f0;">${BRAND_NAME} - Verification</h2>

          <p style="color:#f0f0f0; font-size:16px;">
  Please use the following OTP. It's valid for <span style="color:#FF0033; font-weight:600;">10 minutes</span>.
</p>
          <div class="otp-code">
            <h2>${otp}</h2>
          </div>
          <div class="timer-bar"></div>
          <p style="font-size:14px; color:#00d9ff; margin-top:10px;">Valid for 10 minutes only</p>
          <p style="font-size:12px; color:#aaa; margin-top:20px;">Don't share this OTP with anyone.</p>
          <div class="social-links" style="margin-top:30px;">
            <a href="https://instagram.com/NaiemShaikhofficial" target="_blank">
              <img src="https://img.icons8.com/?size=100&id=A9HjOYbAQaNS&format=png&color=FFFFFF" alt="Instagram" />
            </a>
            <a href="https://t.me/NaiemShaikh" target="_blank">
              <img src="https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF" alt="Telegram" />
            </a>
            <a href="https://youtube.com/@NaiemShaikh" target="_blank">
              <img src="https://img.icons8.com/?size=100&id=YXls9ifWMvbU&format=png&color=FFFFFF" alt="YouTube" />
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// ------------------------ ORDER CONFIRMATION EMAIL ------------------------
export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderId: string;
    totalAmount: number;
    items: Array<{ name: string; price: number }>;
    downloadUrl?: string;
  }
) {
  const itemsHtml = orderDetails.items
    .map((item) => `<li>${item.name} - ₹${item.price}</li>`)
    .join("");

  const mailOptions = {
    from: `"${BRAND_NAME}" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation - ${BRAND_NAME}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation • ${BRAND_NAME}</title>
        <style>
          body { margin:0; padding:0; font-family:Arial,sans-serif; background-color:#121212; color:#fff; }
          .container { max-width:600px; margin:0 auto; background:#1e1e1e; border-radius:16px; padding:40px 20px; text-align:center; }
          .items-list li { text-align:left; margin:5px 0; }
          .btn { display:inline-block; padding:12px 24px; background:#ff006e; color:#fff; text-decoration:none; border-radius:4px; margin-top:20px; }
          .header { margin-bottom:20px; }
          .order-box { background:#1a1f3a; padding:20px; border-radius:8px; margin:20px 0; text-align:left; }
          h3 { color:#00d9ff; }
        </style>
      </head>
      <body>
        <div class="container">
          <a href="https://naiemshaikhstore.com" class="header" target="_blank">
            <img src="${BRAND_LOGO}" width="120" alt="${BRAND_NAME} Logo" />
          </a>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase from ${BRAND_NAME}.</p>
          <div class="order-box">
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
            <h3>Items:</h3>
            <ul class="items-list">${itemsHtml}</ul>
          </div>
          ${
            orderDetails.downloadUrl
              ? `<a href="${orderDetails.downloadUrl}" class="btn">Download Your Product</a>`
              : ""
          }
          <p style="font-size:12px; color:#aaa; margin-top:20px;">This is an automated email. Please don't reply.</p>
          <div class="social-links" style="margin-top:30px;">
            <a href="https://instagram.com/NaiemShaikhStore" target="_blank">
              <img src="https://img.icons8.com/ios-filled/50/aaaaaa/instagram-new.png" alt="Instagram" />
            </a>
            <a href="https://t.me/NaiemShaikhStore" target="_blank">
              <img src="https://img.icons8.com/ios-filled/50/aaaaaa/telegram-app.png" alt="Telegram" />
            </a>
            <a href="https://youtube.com/@NaiemShaikhStore" target="_blank">
              <img src="https://img.icons8.com/ios-filled/50/aaaaaa/youtube-play.png" alt="YouTube" />
            </a>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Alias for backward compatibility
export const sendOrderConfirmation = sendOrderConfirmationEmail;
