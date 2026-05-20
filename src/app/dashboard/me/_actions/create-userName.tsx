"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createUserNameSchema = z.object({
	userName: z
		.string({ message: "O userName é obrigatório" })
		.min(4, "O userName precisa ter pelo menos 4 caracteres"),
});

type CreateUserNameFormData = z.infer<typeof createUserNameSchema>;

export async function createUserName(data: CreateUserNameFormData) {
	const session = await auth();

	if (!session?.user) {
		return {
			data: null,
			error: "Usuário não logado",
		};
	}

	const schema = createUserNameSchema.safeParse(data); // valida o schema

	if (!schema.success) {
		console.log(schema);
		return {
			data: null,
			error: schema.error.issues[0].message,
		};
	}

	try {
		const userId = session.user.id;

		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				userName: data.userName,
			},
		});

		return {
			data: "UserName atualizado com sucesso",
			error: null,
		};
	} catch (_error) {
		return {
			data: null,
			error: "Falha ao atualizar userName",
		};
	}
}
