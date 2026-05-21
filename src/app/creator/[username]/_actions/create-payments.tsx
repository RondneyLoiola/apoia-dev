"use server";

//import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
			data: null,
			error: schema.error.issues[0].message,
		};
	}

	try {
		console.log(data);
	} catch (_error) {
		return {
			data: null,
			error: "Falha ao efetuar o pagamento, tente mais tarde",
		};
	}
}
