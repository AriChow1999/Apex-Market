const { Resend } = require('resend');

// Initialize Resend with your API key from Render environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

const email = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email address is required.' });
    }

    try {
        const data = await resend.emails.send({
            from: 'APEX MARKET <onboarding@resend.dev>', // Use your verified domain later if you have one
            to: [email],
            subject: 'Welcome to APEX MARKET - Explore Our Collections!',
            html: `
            <div style="background-color: #f8fafc; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <div style="background-color: #ffffff; color: #1e293b; padding: 40px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);">
                    
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #0f172a;">
                            APEX<span style="color: #6366f1;">MARKET</span>
                        </h1>
                        <p style="margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; color: #64748b;">
                            Curated Luxury & Tech
                        </p>
                    </div>

                    <div style="height: 1px; background: linear-gradient(to right, transparent, #cbd5e1, transparent); margin-bottom: 30px;"></div>

                    <h2 style="color: #0f172a; font-size: 20px; font-weight: 600; margin-bottom: 15px;">Welcome to the Inner Circle</h2>
                    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                        Thank you for subscribing. You now hold VIP access to exclusive drops, curated tech releases, and private member pricing before anyone else.
                    </p>

                    <h3 style="color: #6366f1; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 35px; margin-bottom: 20px;">
                        Explore Our Flagship Collections
                    </h3>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 35px;">
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="color: #0f172a; font-weight: 600; font-size: 15px;">⚽ Sportswear</span>
                                <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0; line-height: 1.4;">Official jerseys, match kits, and elite training gear from top global clubs.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="color: #0f172a; font-weight: 600; font-size: 15px;">⚡ Electronics</span>
                                <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0; line-height: 1.4;">Cutting-edge tech hardware, immersive peripherals, and lifestyle gadgets.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                <span style="color: #0f172a; font-weight: 600; font-size: 15px;">🏠 Appliances</span>
                                <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0; line-height: 1.4;">Modern, automated solutions designed to streamline your living space.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0;">
                                <span style="color: #0f172a; font-weight: 600; font-size: 15px;">📱 Mobiles</span>
                                <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0; line-height: 1.4;">State-of-the-art smartphones and mobile communication technology.</p>
                            </td>
                        </tr>
                    </table>

                    <div style="height: 1px; background: linear-gradient(to right, transparent, #cbd5e1, transparent); margin-top: 40px; margin-bottom: 25px;"></div>

                    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5;">
                        You received this email because you signed up on APEX MARKET.<br>
                        © ${new Date().getFullYear()} APEX MARKET. All rights reserved.
                    </p>

                </div>
            </div>
            `
        });

        res.status(200).json({ message: 'Subscribed successfully! Product catalog sent to your email.' });
    } catch (error) {
        console.error('Resend Error:', error);
        res.status(500).json({ error: 'Failed to send welcome email. Please try again later.' });
    }
};

module.exports = email;