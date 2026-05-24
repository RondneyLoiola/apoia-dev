/** biome-ignore-all lint/style/noNonNullAssertion: user.userName! */
import { notFound } from "next/navigation";
import { AboutSection } from "./_components/about-section";
import CoverSection from "./_components/cover-section";
import { FormDonate } from "./_components/form";
import { getInfoUser } from "./_data-access/get-info-user";

export default async function Apoia({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;

	const user = await getInfoUser({ userName: username });

	if (!user) {
		notFound();
	}

	return (
		<div className=" min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
			<CoverSection
				coverImage={user?.image ?? ""}
				profileImage={user?.image ?? ""}
				name={user?.name ?? "Sem nome"}
			/>

			<main className="container mx-auto maxw-6xl p-4 sm:p-6 -mt-8 md:-mt-16 relative z-10">
				<div className="grid grid-col-1 lg:grid-cols-2 gap-6 lg:gap-8">
					<div className="order-2 lg:order-1">
						<AboutSection
							name={user?.name ?? "Sem nome"}
							description={user?.bio ?? ""}
						/>
					</div>

					<div className="order-1 lg:order-2">
						<FormDonate
							slug={user.userName!}
							creatorId={user.connectedStripeAccountId ?? ""}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
