"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const createUserNameSchema = z.object({
	slug: z.string().min(3, "O Slug do criador é obrigatório"),
	name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
	message: z.string().min(5, "A mensagem precisa ter pelo menos 5 caracteres"),
	price: z.number().min(1500, "Selecione um valor maior que R$ 15"),
	creatorId: z.string(),
});

type CreatePaymentSchema = z.infer<typeof createUserNameSchema>;

export async function createPayments(data: CreatePaymentSchema) {
	const schema = createUserNameSchema.safeParse(data);

	if (!schema.success) {
		return {
			error: schema.error.issues[0].message,
		};
	}

	if (!data.creatorId) {
		return {
			error: "Creator não encontrado",
		};
	}

	try {
		const creator = await prisma.user.findFirst({
			where: {
				connectedStripeAccountId: data.creatorId,
			},
		});

		if (!creator) {
			return {
				error: "Creator não encontrado",
			};
		}

		if(!creator.connectedStripeAccountId) {
			return {
				error: "Creator não possui conta de pagamento configurada"
			}
		}

		// Calcular a taxa que o Apoia Dev envia para o criador
		const applicationFeeAmount = Math.floor(data.price * 0.1);

		const donation = await prisma.donation.create({
			data: {
				donorName: data.name,
				donorMessage: data.message,
				userId: creator.id,
				status: "PENDING",
				amount: data.price - applicationFeeAmount,
			},
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			success_url: `${process.env.HOST_URL}/creator/${data.slug}`,
			cancel_url: `${process.env.HOST_URL}/creator/${data.slug}`,
			line_items: [
				{
					price_data: {
						currency: "brl",
						product_data: {
							name: `Apoiar ${creator.name}`,
						},
						unit_amount: data.price,
					},
					quantity: 1,
				},
			],
			// taxa que a plataforma vai receber
			payment_intent_data: {
				application_fee_amount: applicationFeeAmount, // stripe trabalha em centavos
				transfer_data: {
					destination: creator.connectedStripeAccountId, // criador que vai receber
				},
				metadata: {
					donorName: data.name,
					donorMessage: data.message,
					donationId: donation.id,
				},
			},
		});

		return {
			sessionId: session.id,
			url: session.url,
		};
	} catch (_error) {
		return {
			error: "Falha ao efetuar o pagamento, tente mais tarde",
		};
	}
}
