import { DollarSign, Users, Wallet } from "lucide-react";
import { getStats } from "../_data-access/get-stats-creator";
import { StatCard } from "./stats-card";

export async function Stats({
	userId,
	stripeAccountId,
}: {
	userId: string;
	stripeAccountId: string;
}) {
	const data = await getStats(userId, stripeAccountId);

	console.log(data)

	return (
		<div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
			<StatCard
				title="Apoiadores"
				description="Total de apoiadores"
				icon={<Users className="w-8 h-8 text-blue-400" />}
				value={0}
			/>

			<StatCard
				title="Total recebido"
				description="Quantidade total recebida"
				icon={<DollarSign className="w-8 h-8 text-amber-500" />}
				value={0}
			/>

			<StatCard
				title="Saldo em conta"
				description="Saldo pendente"
				icon={<Wallet className="w-8 h-8 text-green-500" />}
				value={0}
			/>
		</div>
	);
}
  