import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Stats } from "./_components/analytics";
import { CreateAccountButton } from "./_components/create-account-button";
import { DonationTable } from "./_components/donates";
import { getStripeDashboard } from "./_data-access/get-stripe-dashboard";

export default async function Dashboard() {
	const session = await auth();

	if (!session?.user) {
		redirect("/");
	}

	const urlStripeDashboard = await getStripeDashboard(
		session.user.connectedStripeAccountId,
	);

	//const donates = await getAllDonations(session.user.id);

	return (
		<div className="p-4">
			<section className="flex items-center justify-between mb-4">
				<div className="w-full flex items-center gap-2 justify-between">
					<h1 className="text-2xl font-semibold">Minha conta</h1>

					{urlStripeDashboard && (
						<a
							href={urlStripeDashboard}
							className="bg-zinc-900 text-white px-4 py-1 rounded-md crusor-pointer"
							target="_blank"
							rel="noopener noreferrer"
						>
							Ajustar conta
						</a>
					)}
				</div>
			</section>

			{!session.user.connectedStripeAccountId && <CreateAccountButton />}

			{session.user.connectedStripeAccountId && (
				<>
					<Stats
						userId={session.user.id}
						stripeAccountId={session.user.connectedStripeAccountId ?? ""}
					/>

					<h2 className="text-2xl font-semibold mb-2">Últimas doações</h2>

					<DonationTable />
				</>
			)}
		</div>
	);
}
