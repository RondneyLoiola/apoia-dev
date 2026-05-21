"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const changeNameSchema = z.object({
	name: z.string().min(4, "O username precisa ter pelo menos 4 caracteres"),
});

type ChangeNameSchema = z.infer<typeof changeNameSchema>;

export async function changeName(data: ChangeNameSchema) {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		return {
			data: null,
			error: "Usuário não autenticado",
		};
	}

	const schema = changeNameSchema.safeParse(data); // valida o schema

	if (!schema.success) {
		return {
			data: null,
			error: schema.error.issues[0].message,
		};
	}

	try {
		const user = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				name: data.name,
			},
		});

		return {
			data: user.name,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			data: null,
			error: "Falha ao salvar alterações",
		};
	}
}
