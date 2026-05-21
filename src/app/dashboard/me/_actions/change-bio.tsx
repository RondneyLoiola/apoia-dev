"use server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const changeDescriptionSchema = z.object({
    description: z.string().min(4, "O descrição precisa ter pelo menos 4 caracteres"),
});

type ChangeDescriptionSchema = z.infer<typeof changeDescriptionSchema>;

export async function changeDescription(data: ChangeDescriptionSchema) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return {
            data: null,
            error: "UsuáDescription não autenticado",
        };
    }

    const schema = changeDescriptionSchema.safeParse(data); // valida o schema

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
                bio: data.description,
            },
        });

        return {
            data: user.bio,
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
