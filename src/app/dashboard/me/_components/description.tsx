"use client";

import { debounce } from "lodash";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { changeDescription } from "../_actions/change-bio";

export function Description({
	initialDescription,
}: {
	initialDescription: string;
}) {
	const [description, setDescription] = useState(initialDescription);
	const [originalDescription, _setOriginalDescription] =
		useState(initialDescription);

	// cria um delay de 500ms, antes de enviar o nome para o banco
	const debounceSaveDescription = useRef(
		debounce(async (currentDescription: string) => {
			if (currentDescription.trim() === "") {
				setDescription(originalDescription);
				return;
			}

			if (currentDescription !== description) {
				try {
					const response = await changeDescription({
						description: currentDescription,
					});

					if (response.error) {
						toast.error(response.error);
						setDescription(originalDescription);
						return;
					}

					toast.success("Sua Biografia foi alterada com sucesso!");
				} catch (error) {
					console.log(error);
					setDescription(originalDescription);
				}
			}
		}, 500),
	).current;

	// atualiza quando digita algo, sem precisar de botão para confirmar
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		const value = e.target.value;
		setDescription(value);

		debounceSaveDescription(value);
	}

	return (
		<textarea
			className="text-base bg-gray-50 border border-gray-100 rounded-md outline-none
        p-2 w-full max-w-2xl my-3 h-40 resize-none"
			value={description}
			onChange={handleChange}
		/>
	);
}
