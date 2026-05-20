"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createUserName } from "../_actions/create-userName";

export function UrlPreview() {
	const [error, setError] = useState<null | string>(null);

	async function submitAction(formData: FormData) {
		const userName = formData.get("userName") as string;

		if (userName === "") {
			return;
		}

		const response = await createUserName({ userName });
		console.log(response);

		if (response.error) {
			setError(response.error);
		}
	}

	return (
		<div className="w-full">
			<div className="flex items-center flex-1 p-2 text-gray-100">
				<form
					action={submitAction}
					className="flex flex-1 flex-col md:flex-row gap-4 items-start md:items-center"
				>
					<div className="flex items-center justify-center w-full">
						<p>{process.env.NEXT_PUBLIC_HOST_URL}/creator/</p>
						<input
							type="text"
							className="flex-1 outline-none border h-9 border-gray-300 bg-gray-50
                text-black rounded-md px-1"
							placeholder="Digite seu username..."
							name="userName"
						/>
					</div>

					<Button
						type="submit"
						className="bg-blue-500 hover:bg-blue-600 h-9 w-full md:w-fit text-white px-4 rounded-md cursor-pointer"
					>
						Salvar
					</Button>
				</form>
			</div>
			{error && <p className="text-red-500">{error}</p>}
		</div>
	);
}
