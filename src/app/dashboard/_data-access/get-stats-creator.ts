"use server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function getStats(userId: string, stripeAccountId: string) {
	if (!userId) {
		return {
			error: "Usuário não autenticado",
		};
	}

	try {
		const totalDonations = await prisma.donation.count({
			where: {
				userId: userId,
				status: "PAID",
			},
		});

		// Pega as doações do usuário logado
		const totalAmountDonated = await prisma.donation.aggregate({
			where: {
				userId: userId,
				status: "PAID",
			},
			_sum: {
				amount: true,
			},
		});

		const balance = await stripe.balance.retrieve(
			{},
			{
				stripeAccount: stripeAccountId,
			},
		);

		return {
			totalDonations: totalDonations,
			totalAmountDonated: totalAmountDonated._sum.amount ?? 0,
			balance: balance?.pending[0].amount ?? 0,
		};
	} catch (_error) {
		return {
			error: "Falha ao buscar estatísticas",
		};
	}
}
