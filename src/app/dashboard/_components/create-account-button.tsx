"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CreateAccountButton() {
	const [loading, setLoading] = useState<boolean>(false);

	async function handleCreateStripeAccount() {
		setLoading(true);

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_HOST_URL}/api/stripe/create-account`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.message ?? "Falha ao criar conta de pagamento");
				return;
			}

			if (!data.url) {
				toast.error("URL de redirecionamento não encontrada");
				return;
			}

			window.location.href = data.url;
		} catch (error) {
			console.error(error);
			toast.error("Erro inesperado. Tente novamente.");
		} finally {
			setLoading(false); // ✅ Sempre executa, em qualquer cenário
		}
	}

	return (
		<div className="mb-5">
			<Button
				className="cursor-pointer"
				onClick={handleCreateStripeAccount}
				disabled={loading}
			>
				{loading ? "Carregando..." : "Ativar conta de pagamentos"}
			</Button>
		</div>
	);
}
