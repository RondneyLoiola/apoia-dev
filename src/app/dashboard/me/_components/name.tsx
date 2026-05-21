"use client";

import { debounce } from "lodash";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { changeName } from "../_actions/change-name";

export function Name({ initialName }: { initialName: string }) {
	const [name, setName] = useState(initialName);
	const [originalName, _setOriginalName] = useState(initialName);

	// cria um delay de 500ms, antes de enviar o nome para o banco
	const debounceSaveName = useRef(
		debounce(async (currentName: string) => {
			if (currentName.trim() === "") {
				setName(originalName);
				return;
			}

			if (currentName !== name) {
				try {
					const response = await changeName({ name: currentName });

					if (response.error) {
						toast.error(response.error);
						setName(originalName);
						return;
					}

					toast.success("Nome alterado com sucesso!");
				} catch (error) {
					console.log(error);
					setName(originalName);
				}
			}
		}, 500),
	).current;

	// atualiza quando digita algo, sem precisar de botão para confirmar
	function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setName(value);

		debounceSaveName(value);
	}

	return (
		<input
			type="text"
			className="text-xl md:text-2xl font-bold bg-gray-50 border border-gray-100 rounded-md outline-none
        p-2 w-full max-w-2xl text-center my-3"
			value={name}
			onChange={handleChangeName}
		/>
	);
}
