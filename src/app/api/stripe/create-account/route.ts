/** biome-ignore-all lint/style/noNonNullAssertion: request.auth.user */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const POST = auth(async function POST(request) {
	if (!request.auth) {
		return NextResponse.json(
			{ error: "Usuário não autenticado" },
			{ status: 401 },
		);
	}

	try {
		const account = await stripe.accounts.create({
			controller: {
				losses: {
					payments: "application",
				},
				fees: {
					payer: "application",
				},
				stripe_dashboard: {
					type: "express",
				},
			},
		});

		if (!account.id) {
			return NextResponse.json(
				{ error: "Falha ao criar conta de pagamento" },
				{ status: 400 },
			);
		}

		// Atualiza no banco do user logado com a conta criada do stripe
		await prisma.user.update({
			where: {
				id: request.auth.user!.id,
			},
			data: {
				connectedStripeAccountId: account.id,
			},
		});

        // cria o link da conta do usuário
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.HOST_URL}/dashboard`,
            return_url: `${process.env.HOST_URL}/dashboard`,
            type: "account_onboarding",
        })

		// retorna o link para configuração da conta
        return NextResponse.json({ url: accountLink?.url }, { status: 200 });
	} catch (error) {
		console.error("Erro ao criar conta Stripe:", error);
		return NextResponse.json(
			
			{ error: "Falha ao criar link de configuração" },
			{ status: 400 },
		);
	}
});
