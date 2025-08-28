import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
}) : null;

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      console.error('❌ Stripe not initialized');
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    if (!supabase) {
      console.error('❌ Supabase not initialized');
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      console.error('❌ No signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('🔔 Webhook received:', event.type);

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`🔔 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Manejar pago exitoso
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment succeeded:', paymentIntent.id);
  
  try {
    // Obtener metadata del payment intent
    const { user_id, prompt_id, type } = paymentIntent.metadata;
    
    if (type === 'prompt_purchase' && prompt_id) {
      // Registrar compra de prompt
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id,
          prompt_id,
          amount: paymentIntent.amount / 100, // Convertir de centavos
          currency: paymentIntent.currency,
          stripe_payment_intent_id: paymentIntent.id,
          status: 'completed'
        });
      
      if (error) {
        console.error('❌ Error saving purchase:', error);
      } else {
        console.log('✅ Purchase saved successfully');
      }
    }
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
  }
}

// Manejar pago fallido
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);
  
  try {
    const { user_id, prompt_id } = paymentIntent.metadata;
    
    // Registrar intento de pago fallido
    const { error } = await supabase
      .from('payment_attempts')
      .insert({
        user_id,
        prompt_id,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'failed',
        failure_reason: paymentIntent.last_payment_error?.message || 'Unknown error'
      });
    
    if (error) {
      console.error('❌ Error saving failed payment:', error);
    }
  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

// Manejar suscripción creada
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription created:', subscription.id);
  
  try {
    const customerId = subscription.customer as string;
    
    // Obtener información del cliente
    const customer = await stripe.customers.retrieve(customerId);
    const userEmail = (customer as Stripe.Customer).email;
    
    if (userEmail) {
      // Buscar usuario por email
      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single();
      
      if (user) {
        // Actualizar perfil del usuario con suscripción
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_id: subscription.id,
            subscription_plan: subscription.items.data[0]?.price?.nickname || 'premium'
          })
          .eq('id', user.id);
        
        if (error) {
          console.error('❌ Error updating user subscription:', error);
        } else {
          console.log('✅ User subscription updated successfully');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error handling subscription creation:', error);
  }
}

// Manejar suscripción actualizada
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id);
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        subscription_plan: subscription.items.data[0]?.price?.nickname || 'premium'
      })
      .eq('subscription_id', subscription.id);
    
    if (error) {
      console.error('❌ Error updating subscription:', error);
    } else {
      console.log('✅ Subscription updated successfully');
    }
  } catch (error) {
    console.error('❌ Error handling subscription update:', error);
  }
}

// Manejar suscripción cancelada
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('❌ Subscription deleted:', subscription.id);
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled',
        subscription_id: null,
        subscription_plan: null
      })
      .eq('subscription_id', subscription.id);
    
    if (error) {
      console.error('❌ Error canceling subscription:', error);
    } else {
      console.log('✅ Subscription canceled successfully');
    }
  } catch (error) {
    console.error('❌ Error handling subscription deletion:', error);
  }
}

// Manejar factura pagada exitosamente
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('✅ Invoice payment succeeded:', invoice.id);
  
  try {
    const subscriptionId = (invoice as any).subscription as string;
    
    if (subscriptionId) {
      // Asegurar que la suscripción esté activa
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active'
        })
        .eq('subscription_id', subscriptionId);
      
      if (error) {
        console.error('❌ Error updating subscription status:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error handling invoice payment success:', error);
  }
}

// Manejar factura con pago fallido
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id);
  
  try {
    const subscriptionId = (invoice as any).subscription as string;
    
    if (subscriptionId) {
      // Marcar suscripción como con problemas de pago
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'past_due'
        })
        .eq('subscription_id', subscriptionId);
      
      if (error) {
        console.error('❌ Error updating subscription status:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error handling invoice payment failure:', error);
  }
}

// Manejar checkout completado
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout completed:', session.id);
  
  try {
    const { user_id, prompt_id, type } = session.metadata || {};
    
    if (type === 'prompt_purchase' && prompt_id && user_id) {
      // El pago ya se manejará en payment_intent.succeeded
      console.log('✅ Checkout completed for prompt purchase');
    } else if (type === 'subscription' && user_id) {
      // La suscripción ya se manejará en customer.subscription.created
      console.log('✅ Checkout completed for subscription');
    }
  } catch (error) {
    console.error('❌ Error handling checkout completion:', error);
  }
}