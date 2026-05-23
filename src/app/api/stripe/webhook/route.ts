/** biome-ignore-all lint/style/noNonNullAssertion: req.headers.get("stripe-signature")! */

import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
	const sig = req.headers.get("stripe-signature")!;
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

	let event: Stripe.Event;

	try {
		const payload = await req.text(); // pega o payload que vem do stripe
		event = stripe.webhooks.constructEvent(payload, sig, endpointSecret!); // valida o payload e o signature
	} catch (error) {
		console.log("FALHA AO AUTENTICAR ASSINATURA", error);
		return new NextResponse(`Webhook Error: `, { status: 400 });
	}

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;

            // Pega o ID da intençaõ de pagamento
			const paymentIntentId = session.payment_intent as string;

			// Pegar infos do pagamento, detalhes no Stripe
			const paymentIntent =
				await stripe.paymentIntents.retrieve(paymentIntentId);
			console.log("## PAYMENT INTENT", paymentIntent);

            // Extrai metadados que foram salvos no checkout
			const donorName = paymentIntent.metadata.donorName;
			const donorMessage = paymentIntent.metadata.donorMessage;
			const donateId = paymentIntent.metadata.donationId;

            // se buscar um evento de checkout.session.completed, atualiza o status para PAID
			try {
				const updateDonation = await prisma.donation.update({
					where: {
						id: donateId,
					},
					data: {
						status: "PAID",
						donorName: donorName ?? "Anônimo",
						donorMessage: donorMessage ?? "Sem mensagem...",
					},
				});

				console.log("DOAÇÃO ATUALIZADA: ", updateDonation);
			} catch (error) {
				console.log("## ERRO", error);
			}

			break;
		}

		default:
			console.log(`Unhandled event type ${event.type}`);
			break;
	}

    return NextResponse.json({ ok: true });
}
