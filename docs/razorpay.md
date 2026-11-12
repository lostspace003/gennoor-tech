# Razorpay: online payment for the AI Weekend

The AI Weekend page (`/ai-weekend`) takes the ₹499 fee through Razorpay. Until the keys below are set, payment is off: people reserve a seat and you mark them Paid by hand on `/admin/weekend`.

## Set it up

1. **Create the account** at [razorpay.com](https://razorpay.com) and complete KYC (PAN, bank account, business details). Live payments start only after Razorpay approves it.
2. **Get test keys.** Dashboard → switch to **Test Mode** → Account & Settings → API Keys → Generate. You get a Key ID (`rzp_test_…`) and a Key Secret. The secret is shown once, so save it.
3. **Save the three values as GitHub secrets.** Open a terminal in the project folder and run these one at a time. Each asks you to paste the value, and nothing is shown on screen:

   ```
   gh secret set RAZORPAY_KEY_ID
   gh secret set RAZORPAY_KEY_SECRET
   gh secret set RAZORPAY_WEBHOOK_SECRET
   ```

   | Secret | Value |
   |---|---|
   | `RAZORPAY_KEY_ID` | The Key ID |
   | `RAZORPAY_KEY_SECRET` | The Key Secret |
   | `RAZORPAY_WEBHOOK_SECRET` | Any long random text you choose. Keep a copy for step 4. |

   Then redeploy so the site picks them up: `gh workflow run deploy.yml --ref main`. The deploy copies the three values to the Azure App Service. Never commit them or paste them into chat. For local testing, put the same three names in `.env.local`.

4. **Add the webhook.** Dashboard → Account & Settings → Webhooks → Add New Webhook.

   | Field | Value |
   |---|---|
   | URL | `https://www.gennoor.com/api/weekend/pay/webhook` |
   | Secret | The same text as `RAZORPAY_WEBHOOK_SECRET` |
   | Events | `payment.captured` and `order.paid` |

5. **Test.** Register on `/ai-weekend` with your own email and pay with the test UPI ID `success@razorpay`. No real money moves. Check that:
   - the page says "Payment received",
   - you get the receipt email,
   - `/admin/weekend` shows you as Paid with a payment reference.
6. **Go live.** After KYC approval, switch the dashboard to **Live Mode**, generate Live keys, run `gh secret set` again for `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, redeploy, and add the webhook again (webhooks are separate for Test and Live).

While test keys are in use, `/admin/weekend` shows a "test mode" notice.

## What happens when someone pays

1. They fill in the form. The seat is reserved and the Razorpay window opens (UPI, cards, net banking).
2. On success the seat is marked **Paid**, a receipt is emailed to them, and `admin@gennoor.com` is told.
3. If they close the window, the seat stays reserved. The confirmation email has a **Pay ₹499 now** button, and the "How to pay" email on the staff desk sends the same button again.
4. If they pay and close the browser before the page can confirm, the webhook marks them Paid within a few minutes.

## Refunds

Refund the payment in the Razorpay dashboard, then set the person to **Refunded** on `/admin/weekend`. Their seat is released.

## International payers

UPI needs an Indian bank account, so it does not work for most people abroad. For them, request **International Payments** in Razorpay (Account & Settings). It needs Razorpay's approval. Once it is on, the same payment window accepts foreign cards with no code change. The price is still charged in rupees and their bank converts it.

## If something goes wrong

| What you see | Likely cause |
|---|---|
| The page still says "Reserve now, pay after" | The two key secrets are missing, or the site was not redeployed after adding them. The page also refreshes only every 5 minutes. |
| The payment window does not open | The Key ID is wrong, or belongs to a different mode than the secret. |
| Paid in Razorpay, still "Not paid yet" on the desk | The webhook is missing, its secret does not match `RAZORPAY_WEBHOOK_SECRET`, or it was added in the other mode (Test or Live). |
| "We could not confirm this payment" | The Key Secret on the site does not match the Key ID. |

## For developers

- `src/lib/razorpay.ts`: create an order, check a payment signature, check a webhook signature. No SDK.
- `src/lib/weekend-pay.ts`: open or reuse the order for a registration, the signed "pay later" link, and `markPaid` (safe to call twice).
- Routes: `POST /api/weekend/register` (returns the checkout), `POST /api/weekend/pay` (pay later link), `POST /api/weekend/pay/verify` (browser reports a payment), `POST /api/weekend/pay/webhook` (Razorpay reports a payment).
- The amount is set on the server from `src/data/ai-weekend.ts`. A payment is believed only when Razorpay's signature checks out.
- Checks: `npx tsx scripts/crm-flow-test.ts`.
