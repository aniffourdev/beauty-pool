// // types/amazon-pay.ts
// interface SubMerchant {
//     id: string;
//     name: string;
//     commissionRate: number;
//   }
  
//   // lib/amazon-pay-platform.ts
//   import AmazonPay from 'amazon-pay-api-sdk-v2';
  
//   export class AmazonPayPlatform {
//     private client: AmazonPay;
    
//     constructor(config: {
//       merchantId: string;
//       publicKeyId: string;
//       privateKey: string;
//       sandbox: boolean;
//     }) {
//       this.client = new AmazonPay({
//         region: 'us',
//         ...config
//       });
//     }
  
//     async createBookingSession(params: {
//       amount: number;
//       subMerchant: SubMerchant;
//       bookingId: string;
//     }) {
//       const { amount, subMerchant, bookingId } = params;
      
//       const payload = {
//         webCheckoutDetails: {
//           checkoutReviewReturnUrl: `${process.env.NEXT_PUBLIC_URL}/booking/${bookingId}/review`,
//           checkoutResultReturnUrl: `${process.env.NEXT_PUBLIC_URL}/booking/${bookingId}/complete`,
//         },
//         paymentDetails: {
//           paymentIntent: 'Authorize',
//           canHandlePendingAuthorization: false,
//           chargeAmount: {
//             amount,
//             currencyCode: 'USD'
//           },
//           softDescriptor: subMerchant.name,
//         },
//         merchantMetadata: {
//           merchantReferenceId: bookingId,
//           merchantStoreName: 'Your Platform Name',
//           customInformation: JSON.stringify({
//             subMerchantId: subMerchant.id,
//             commissionRate: subMerchant.commissionRate
//           })
//         }
//       };
  
//       return this.client.createCheckoutSession(payload);
//     }
  
//     async processPayment(checkoutSessionId: string) {
//       const session = await this.client.getCheckoutSession(checkoutSessionId);
//       const metadata = JSON.parse(session.merchantMetadata.customInformation);
  
//       // Calculate split amounts
//       const totalAmount = session.paymentDetails.chargeAmount.amount;
//       const platformFee = totalAmount * metadata.commissionRate;
//       const merchantAmount = totalAmount - platformFee;
  
//       // Process payment with splits
//       await this.client.charge({
//         ...session,
//         softDescriptor: session.paymentDetails.softDescriptor,
//         merchantMetadata: {
//           ...session.merchantMetadata,
//           platformFee,
//           merchantAmount
//         }
//       });
//     }
//   }
  
//   // pages/api/bookings/[id]/payment.ts
//   import { NextApiRequest, NextApiResponse } from 'next';
//   import { AmazonPayPlatform } from '@/lib/amazon-pay-platform';
  
//   export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
//   ) {
//     if (req.method !== 'POST') return res.status(405).end();
  
//     const { id: bookingId } = req.query;
//     const booking = await prisma.booking.findUnique({ 
//       where: { id: bookingId as string },
//       include: { business: true }
//     });
  
//     const amazonPay = new AmazonPayPlatform({
//       merchantId: process.env.AMAZON_PAY_MERCHANT_ID!,
//       publicKeyId: process.env.AMAZON_PAY_PUBLIC_KEY_ID!,
//       privateKey: process.env.AMAZON_PAY_PRIVATE_KEY!,
//       sandbox: process.env.NODE_ENV !== 'production'
//     });
  
//     try {
//       const session = await amazonPay.createBookingSession({
//         amount: booking.price,
//         subMerchant: {
//           id: booking.business.id,
//           name: booking.business.name,
//           commissionRate: 0.15 // 15% platform fee
//         },
//         bookingId: booking.id
//       });
  
//       res.status(200).json(session);
//     } catch (error) {
//       console.error('Amazon Pay Error:', error);
//       res.status(500).json({ error: 'Failed to create payment session' });
//     }
//   }