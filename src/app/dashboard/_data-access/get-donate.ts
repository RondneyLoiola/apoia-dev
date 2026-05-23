"use server";

import { prisma } from "@/lib/prisma";

export async function getAllDonations(userId: string) {
	if (!userId) {
		return {
			data: [],
		};
	}

	try {
		const donates = await prisma.donation.findMany({
			where: {
				userId: userId,
                status: "PAID", // apenas doações pagas
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				amount: true,
				createdAt: true,
				donorName: true,
				donorMessage: true,
			},
		});

		return {
			data: donates,
		};
	} catch (_error) {
		return {
			data: [],
		};
	}
}
