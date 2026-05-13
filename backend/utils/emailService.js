const nodemailer = require('nodemailer');

// Create transporter (Gmail)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // Use Gmail App Password (NOT real password)
    }
  });
};

// ─── HTML EMAIL TEMPLATES ────────────────────────────────────────────────────

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; color: #1a1a2e; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 30px 15px; }
    .card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 35px 40px; text-align: center; }
    .header h1 { color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: rgba(255,255,255,0.85); margin-top: 6px; font-size: 15px; }
    .body { padding: 40px; }
    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
    .text { color: #475569; line-height: 1.7; margin-bottom: 20px; font-size: 15px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white !important;
           padding: 14px 35px; border-radius: 50px; text-decoration: none; font-weight: 600;
           font-size: 15px; margin: 20px 0; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 25px 0; }
    .footer { text-align: center; padding: 25px 40px; background: #f8fafc; }
    .footer p { color: #94a3b8; font-size: 13px; line-height: 1.8; }
    .badge { display: inline-block; background: #fef3c7; color: #d97706; padding: 4px 12px;
             border-radius: 20px; font-size: 13px; font-weight: 600; }
    .highlight-box { background: #f0f4ff; border-left: 4px solid #2563eb; border-radius: 8px;
                     padding: 18px 20px; margin: 20px 0; }
    .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .order-table th { background: #f8fafc; padding: 12px 15px; text-align: left;
                      font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .order-table td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .order-table tr:last-child td { border-bottom: none; }
    .total-row td { font-weight: 700; font-size: 16px; color: #2563eb; }
    .points-banner { background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px;
                     padding: 18px 20px; text-align: center; margin: 20px 0; }
    .points-banner .pts { font-size: 32px; font-weight: 800; color: #d97706; }
    .points-banner p { color: #92400e; font-size: 14px; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1>⚡ Echo</h1>
        <p>Premium Tech Gadgets</p>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <p>© 2025 Echo Premium Tech Gadgets. All rights reserved.<br>
           Chaudhary Charan Singh University, Meerut<br>
           <a href="mailto:support@echo.com" style="color:#2563eb;">support@echo.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Welcome email after registration
const welcomeTemplate = (name) => baseTemplate(`
  <p class="greeting">Welcome aboard, ${name}! 🎉</p>
  <p class="text">
    Your Echo account has been created successfully. You now have access to our full
    collection of premium tech gadgets and our exclusive loyalty rewards program.
  </p>
  <div class="highlight-box">
    <strong>🌟 Your Loyalty Rewards</strong><br>
    <span style="color:#475569; font-size:14px; margin-top:6px; display:block;">
      Earn <strong>1 point for every ₹100 spent</strong>. Redeem points for discount vouchers,
      free shipping, premium membership and more!
    </span>
  </div>
  <p class="text">Start exploring our products and earn your first loyalty points today.</p>
  <center><a href="${process.env.FRONTEND_URL}" class="btn">Start Shopping →</a></center>
  <hr class="divider">
  <p class="text" style="font-size:13px; color:#94a3b8;">
    If you didn't create this account, please ignore this email.
  </p>
`);

// Order confirmation email
const orderConfirmTemplate = (name, order) => {
  const itemsHTML = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return baseTemplate(`
    <p class="greeting">Order Confirmed! ✅</p>
    <p class="text">Hey ${name}, your order has been placed successfully. Here's your order summary:</p>

    <div class="highlight-box">
      <strong>Order ID:</strong> <span style="color:#2563eb; font-family:monospace;">${order.orderId}</span><br>
      <span style="color:#475569; font-size:13px;">Placed on ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
    </div>

    <table class="order-table">
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
        <tr><td colspan="3"><hr style="border-top:1px solid #e2e8f0; margin:5px 0;"></td></tr>
        <tr>
          <td colspan="2" style="color:#64748b;">Subtotal</td>
          <td style="text-align:right;">₹${order.subtotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td colspan="2" style="color:#64748b;">Shipping</td>
          <td style="text-align:right;">${order.shipping === 0 ? '🎉 FREE' : '₹' + order.shipping}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Total Paid</td>
          <td style="text-align:right;">₹${order.total.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div class="points-banner">
      <div class="pts">+${order.pointsEarned} pts</div>
      <p>Loyalty points added to your account!</p>
    </div>

    <p class="text">Your order is being processed. You'll receive updates as it progresses.</p>
    <center><a href="${process.env.FRONTEND_URL}/orders" class="btn">View My Orders →</a></center>
  `);
};

// Reward redeemed email
const rewardRedeemedTemplate = (name, reward) => baseTemplate(`
  <p class="greeting">Reward Redeemed! 🎁</p>
  <p class="text">Hey ${name}, you've successfully redeemed a reward from the Echo Rewards Store.</p>

  <div class="highlight-box">
    <strong style="font-size:16px;">${reward.name}</strong><br>
    <span class="badge" style="margin-top:8px; display:inline-block;">-${reward.points} Points</span>
    <br><span style="color:#475569; font-size:13px; margin-top:6px; display:block;">
      Redeemed on ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
    </span>
  </div>

  ${reward.voucherCode ? `
    <div class="points-banner">
      <p style="color:#92400e; margin-bottom:8px;">Your Discount Voucher Code:</p>
      <div class="pts" style="font-family:monospace; letter-spacing:3px;">${reward.voucherCode}</div>
      <p>Use this code at checkout to get your discount!</p>
    </div>
  ` : `
    <p class="text">Your reward has been activated and is ready to use. Check your account for details.</p>
  `}

  <p class="text">Keep shopping to earn more loyalty points and unlock even bigger rewards!</p>
  <center><a href="${process.env.FRONTEND_URL}" class="btn">Continue Shopping →</a></center>
`);

// ─── SEND EMAIL FUNCTIONS ─────────────────────────────────────────────────────

const sendEmail = async ({ to, subject, html }) => {
  // If email is not configured, just log and skip (won't crash app)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
      process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.log(`📧 [EMAIL SKIPPED - not configured] To: ${to} | Subject: ${subject}`);
    return { skipped: true };
  }

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `Echo Store <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: '🎉 Welcome to Echo Premium Tech Gadgets!',
    html: welcomeTemplate(user.name)
  });

const sendOrderConfirmEmail = (user, order) =>
  sendEmail({
    to: user.email,
    subject: `✅ Order Confirmed - ${order.orderId} | Echo`,
    html: orderConfirmTemplate(user.name, order)
  });

const sendRewardRedeemedEmail = (user, reward) =>
  sendEmail({
    to: user.email,
    subject: `🎁 Reward Redeemed - ${reward.name} | Echo`,
    html: rewardRedeemedTemplate(user.name, reward)
  });

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmEmail,
  sendRewardRedeemedEmail
};
