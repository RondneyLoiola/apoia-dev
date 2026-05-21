/** biome-ignore-all lint/style/noNonNullAssertion: process.env.HOST_URL! */
"use server";

import { stripe } from "@/lib/stripe";

export async function getLoginOnboardAccount(accountId: string | undefined) {
	if (!accountId) {
		return null;
	}

	try {
		// cria um onboard do stripe
		const accountLink = await stripe.accountLinks.create({
			account: accountId,
			refresh_url: `${process.env.HOST_URL!}/dashboard`,
			return_url: `${process.env.HOST_URL!}/dashboard`,
			type: "account_onboarding",
		});

		return accountLink.url;
	} catch (error) {
		console.log("## ERRO ACCOUNT ID", error);
		return null;
	}
}
