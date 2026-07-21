import { createServerFn } from '@tanstack/react-start';
import process from 'node:process';

export interface EmailOrderParams {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
  paymentMethod: string;
  discountAmount: number;
  shippingRate: number;
}

export const sendOrderConfirmationEmail = createServerFn({ method: 'POST' })
  .validator((order: EmailOrderParams) => order)
  .handler(async ({ data: order }): Promise<{ success: boolean; message?: string }> => {
    // Read from server-side environment variables
    const apiKey = process.env.RESEND_API_KEY || '';
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

    // Format order items list as HTML list items
    const itemsHtml = order.items
      .map(item => `<li style="padding: 6px 0; border-bottom: 1px solid #eeeeee; font-size: 14px; color: #333333;">${item}</li>`)
      .join('');

    // Premium HTML Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - ERHA Trade Link</title>
      </head>
      <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #eef2f5;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 20px; text-align: center;">
              <div style="font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 8px;">ERHA Trade Link</div>
              <div style="font-size: 16px; color: rgba(255,255,255,0.85); font-weight: 500;">Control Center - Order Confirmation</div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #1e293b; margin-top: 0; margin-bottom: 15px;">Thank you for your order, ${order.customer}!</h2>
              <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 25px;">
                Your order has been received and is currently being processed by our control center. Here are your order details:
              </p>

              <!-- Order Summary Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-size: 13px; font-weight: 600; color: #475569;" width="40%">Order ID</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #1e293b; font-family: monospace;">${order.id}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-size: 13px; font-weight: 600; color: #475569;">Payment Method</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-size: 13px; font-weight: 600; color: #475569;">Delivery Address</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${order.address}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; background-color: #f8fafc; font-size: 13px; font-weight: 600; color: #475569;">Contact Phone</td>
                  <td style="padding: 12px; border: 1px solid #e2e8f0; font-size: 14px; color: #334155;">${order.phone}</td>
                </tr>
              </table>

              <!-- Order Items -->
              <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 15px;">Items Ordered</h3>
              <ul style="list-style: none; padding-left: 0; margin-top: 0; margin-bottom: 30px;">
                ${itemsHtml}
              </ul>

              <!-- Totals -->
              <table width="100%" style="font-size: 14px; color: #475569; line-height: 1.8;">
                <tr>
                  <td>Subtotal</td>
                  <td align="right" style="font-weight: 600; color: #1e293b;">Rs. ${(order.total - order.shippingRate + order.discountAmount).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Shipping Rate</td>
                  <td align="right" style="font-weight: 600; color: #1e293b;">${order.shippingRate === 0 ? 'FREE' : `Rs. ${order.shippingRate.toLocaleString()}`}</td>
                </tr>
                ${order.discountAmount > 0 ? `
                <tr style="color: #16a34a;">
                  <td>Discount Coupon</td>
                  <td align="right" style="font-weight: 600;">- Rs. ${order.discountAmount.toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr style="font-size: 16px; font-weight: 800; color: #4f46e5; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                  <td style="padding-top: 10px;">Total Amount</td>
                  <td align="right" style="padding-top: 10px;">Rs. ${order.total.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Call to Action -->
              <div style="text-align: center; margin-top: 40px; margin-bottom: 20px;">
                <a href="https://wa.me/923023333499" style="background-color: #25D366; color: #ffffff; padding: 12px 30px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 30px; display: inline-block; box-shadow: 0 4px 10px rgba(37,211,102,0.25);">
                  Confirm on WhatsApp
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                ERHA Trade Link International — PACE N PACE Mall Near Chaseup, Chungi#6, Multan, Pakistan
              </p>
              <p style="font-size: 11px; color: #cbd5e1; margin-top: 5px; margin-bottom: 0;">
                This is an automated confirmation email. Do not reply directly to this mail.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    if (!apiKey) {
      console.warn(
        `[Resend Email Simulation]\n` +
        `No Resend API Key found in env variables. Mocking confirmation email:\n` +
        `To: ${order.email}\n` +
        `Subject: Order Confirmed - ${order.id}\n` +
        `Items: ${JSON.stringify(order.items)}`
      );
      return { 
        success: true, 
        message: `[Simulated] Order confirmation email sent to ${order.email}. (Configure RESEND_API_KEY in server environment variables for real email delivery).` 
      };
    }

    let customerSent = false;
    let adminSent = false;
    let errorMsg = '';

    const isSandbox = fromEmail === 'onboarding@resend.dev';
    const customerRecipient = isSandbox ? 'muhammadzeeshan0477@gmail.com' : order.email;
    const isSandboxNotice = isSandbox ? ` [Sandbox Customer Copy]` : '';

    // 1. Send to Customer
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ERHA Trade Link <${fromEmail}>`,
          to: [customerRecipient],
          subject: `Order Confirmed - ${order.id}${isSandboxNotice} | ERHA Trade Link`,
          html: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        customerSent = true;
      } else {
        console.error('Resend customer email error:', data);
        errorMsg = data.message || 'Error from Resend server.';

        if (!isSandbox && customerRecipient !== 'muhammadzeeshan0477@gmail.com') {
          try {
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: `ERHA Trade Link <${fromEmail}>`,
                to: ['muhammadzeeshan0477@gmail.com'],
                subject: `Order Confirmed - ${order.id} [Fallback Customer Copy] | ERHA Trade Link`,
                html: htmlContent,
              }),
            });
            if (fallbackRes.ok) {
              customerSent = true;
              errorMsg = '';
            }
          } catch (fallbackErr) {
            console.error('Fallback send error:', fallbackErr);
          }
        }
      }
    } catch (error: any) {
      console.error('Catch customer email error:', error);
      errorMsg = error.message || 'Network error.';
    }

    // 2. Send to Admin
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `ERHA Trade Link <${fromEmail}>`,
          to: ['muhammadzeeshan0477@gmail.com'],
          subject: `[New Order Notification] ID: ${order.id} | ERHA Trade Link`,
          html: htmlContent,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        adminSent = true;
      } else {
        console.error('Resend admin email error:', data);
      }
    } catch (error) {
      console.error('Catch admin email error:', error);
    }

    if (customerSent || adminSent) {
      return { 
        success: true, 
        message: customerSent && !isSandbox 
          ? undefined 
          : `Order confirmation processed. (Sandbox/Fallback mode: routed copy to verified admin email)` 
      };
    } else {
      return { 
        success: false, 
        message: `${errorMsg} (Admin notification: Failed)`
      };
    }
  });
