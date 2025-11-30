import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64');

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
