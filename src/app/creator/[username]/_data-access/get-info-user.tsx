"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const getInfoUserSchema = z.object({
	userName: z.string().min(4, "O userName precisa ter pelo menos 4 caracteres"),
});

type CreateInfoUserSchema = z.infer<typeof getInfoUserSchema>;

export async function getInfoUser(data: CreateInfoUserSchema) {
	const schema = getInfoUserSchema.safeParse(data);

	if (!schema.success) {
		return null
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				userName: data.userName,
			}
		});

		return user;
	} catch (_error) {
		return null;
	}
}
