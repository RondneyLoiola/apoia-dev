"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createUserNameSchema = z.object({
	userName: z.string().min(4, "O userName precisa ter pelo menos 4 caracteres"),
});

type CreateUserNameSchema = z.infer<typeof createUserNameSchema>;

export async function getInfoUser(data: CreateUserNameSchema) {
	const schema = createUserNameSchema.safeParse(data);

	if (!schema.success) {
		return null
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				userName: data.userName,
			},
			select: {
				id: true,
				name: true,
				userName: true,
				bio: true,
				image: true,
			},
		});

		return user;
	} catch (_error) {
		return null;
	}
}
