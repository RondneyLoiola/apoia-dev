"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/utils/create-slug";

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

		const slug = createSlug(data.userName);

		const existSlug = await prisma.user.findFirst({
			where: {
				userName: slug,
			}
		})

		if(existSlug) {
			return {
				data: null,
				error: "Esse username já existe, por favor, tente outro",
			};
		}

		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				userName: slug,
			},
		});

		return {
			data: slug,
			error: null,
		};
	} catch (_error) {
		return {
			data: null,
			error: "Falha ao atualizar userName",
		};
	}
}
