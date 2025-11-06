import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
})

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Your OTP for Naiem Shaikh Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff006e;">Naiem Shaikh Store - Verification</h2>
        <p>Your OTP is: <strong style="font-size: 24px; color: #00d9ff;">${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">Don't share this OTP with anyone.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderDetails: {
    orderId: string
    totalAmount: number
    items: Array<{ name: string; price: number }>
    downloadUrl?: string
  },
) {
  const itemsHtml = orderDetails.items.map((item) => `<li>${item.name} - ₹${item.price}</li>`).join("")

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Order Confirmation - Naiem Shaikh Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff006e;">Order Confirmed!</h2>
        <p>Thank you for your purchase from Naiem Shaikh Store.</p>
        <div style="background: #1a1f3a; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
          <h3 style="color: #00d9ff;">Items:</h3>
          <ul>${itemsHtml}</ul>
        </div>
        ${
          orderDetails.downloadUrl
            ? `<p><a href="${orderDetails.downloadUrl}" style="display: inline-block; padding: 12px 24px; background: #ff006e; color: white; text-decoration: none; border-radius: 4px;">Download Your Product</a></p>`
            : ""
        }
        <p style="color: #666; font-size: 12px;">This is an automated email. Please don't reply.</p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

// Alias for backward compatibility
export const sendOrderConfirmation = sendOrderConfirmationEmail
