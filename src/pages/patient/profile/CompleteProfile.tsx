import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

// Define interfaces for better type safety
interface Concept {
	concept_id: number;
	concept_name: string;
}

interface Domain {
	domain_name: string;
	concepts: Concept[];
}

export default function CompleteProfile() {
	const [token, setToken] = useState<string | null>(null);
	const [userType, setUserType] = useState<"person" | "provider" | null>(
		null,
	);
	const [formData, setFormData] = useState<Record<string, string | number>>({});
	const [done, setDone] = useState(false);
	const [domains, setDomains] = useState<Domain[]>([]);

	useEffect(() => {
		const storedToken = localStorage.getItem("accessToken");
		if (storedToken) {
			setToken(storedToken);
		} else {
			window.location.href = "/login";
		}

		axios
			.get("http://localhost:8000/api/domains/")
			.then((response) => {
				setDomains(response.data);
			})
			.catch((error) => {
				console.error("Erro ao buscar domínios e conceitos", error);
				alert("Erro ao carregar dados.");
			});
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validToken = token;

		const endpoint =
			userType === "person"
				? "http://localhost:8000/api/person/"
				: "http://localhost:8000/api/provider/";

		if (userType) {
			localStorage.setItem("role", userType);
		}

		const res = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${validToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (res.ok) {
			setDone(true);
		} else {
			const error = await res.json();
			console.error("Erro ao criar perfil:", error);
			console.log(formData);
		}
	};

	if (done) {
		console.log(formData);
		if (userType === "provider") {
			window.location.href = "/AcsMainPage";
		} else if (userType === "person") {
			window.location.href = "/PacientMainPage";
		} else {
			window.location.href = "/complete-profile";
		}
		return null;
	}

	const containerStyle = {
		maxWidth: "500px",
		margin: "40px auto",
		padding: "20px",
		border: "1px solid #ddd",
		borderRadius: "8px",
		fontFamily: "sans-serif",
	};

	const fieldStyle = {
		marginBottom: "15px",
		display: "flex",
		flexDirection: "column" as const,
	};

	const labelStyle = {
		marginBottom: "5px",
		fontWeight: "bold",
	};

	const inputStyle = {
		padding: "8px",
		borderRadius: "4px",
		border: "1px solid #ccc",
	};

	if (!userType) {
		return (
			<div style={containerStyle}>
				<h2>Você é uma pessoa ou um profissional de saúde?</h2>
				<button
					onClick={() => setUserType("person")}
					style={{ marginRight: "10px" }}
				>
					Pessoa
				</button>
				<button onClick={() => setUserType("provider")}>Profissional</button>
			</div>
		);
	}

	return (
		<div style={containerStyle}>
			<p
				style={{
					backgroundColor: "#fff3cd",
					padding: "10px",
					borderRadius: "5px",
					border: "1px solid #ffeeba",
					color: "#856404",
				}}
			>
				⚠️ Campos de teste, ainda há alguns faltando.
			</p>

			<form onSubmit={handleSubmit}>
				<h3>
					{userType === "person"
						? "Cadastro de Pessoa"
						: "Cadastro de Profissional"}
				</h3>

				<div style={fieldStyle}>
					<label style={labelStyle}>Nome Social (opcional)</label>
					<input
						name="social_name"
						onChange={handleChange}
						style={inputStyle}
					/>
				</div>

				{userType === "person" ? (
					<>
						<div style={fieldStyle}>
							<label style={labelStyle}>Data de nascimento</label>
							<input
								type="date"
								name="birth"
								onChange={handleChange}
								style={inputStyle}
							/>
						</div>
						<div style={fieldStyle}>
							<label style={labelStyle}>Altura (m)</label>
							<input
								type="number"
								step="0.01"
								name="height"
								onChange={handleChange}
								style={inputStyle}
							/>
						</div>
						<div style={fieldStyle}>
							<label style={labelStyle}>Peso (kg)</label>
							<input
								type="number"
								step="0.1"
								name="weight"
								onChange={handleChange}
								style={inputStyle}
							/>
						</div>

						{domains.map((domain) => {
							if (domain.domain_name === "Gender Identity") {
								return (
									<div key={domain.domain_name} style={fieldStyle}>
										<label style={labelStyle}>Gênero</label>
										<select
											name="gender_identity"
											onChange={handleChange}
											style={inputStyle}
											defaultValue=""
										>
											<option value="" disabled hidden>
												Selecione uma opção
											</option>
											{domain.concepts.map((concept: Concept) => (
												<option
													key={concept.concept_id}
													value={concept.concept_id}
												>
													{concept.concept_name}
												</option>
											))}
										</select>
									</div>
								);
							}
							if (domain.domain_name === "Race") {
								return (
									<div key={domain.domain_name} style={fieldStyle}>
										<label style={labelStyle}>Raça</label>
										<select
											name="race_concept"
											onChange={handleChange}
											style={inputStyle}
											defaultValue=""
										>
											<option value="" disabled hidden>
												Selecione uma opção
											</option>
											{domain.concepts.map((concept: Concept) => (
												<option
													key={concept.concept_id}
													value={concept.concept_id}
												>
													{concept.concept_name}
												</option>
											))}
										</select>
									</div>
								);
							}
							if (domain.domain_name === "Biological Sex") {
								return (
									<div key={domain.domain_name} style={fieldStyle}>
										<label style={labelStyle}>Sexo Biológico</label>
										<select
											name="biological_sex"
											onChange={handleChange}
											style={inputStyle}
											defaultValue=""
										>
											<option value="" disabled hidden>
												Selecione uma opção
											</option>
											{domain.concepts.map((concept: Concept) => (
												<option
													key={concept.concept_id}
													value={concept.concept_id}
												>
													{concept.concept_name}
												</option>
											))}
										</select>
									</div>
								);
							}
							return null;
						})}
					</>
				) : (
					<>
						<div style={fieldStyle}>
							<label style={labelStyle}>Email Profissional</label>
							<input
								type="email"
								name="professional_email"
								onChange={handleChange}
								style={inputStyle}
							/>
						</div>
						<div style={fieldStyle}>
							<label style={labelStyle}>Registro Profissional</label>
							<input
								type="text"
								name="professional_registration"
								onChange={handleChange}
								style={inputStyle}
							/>
						</div>
					</>
				)}

				<button
					type="submit"
					style={{
						marginTop: "20px",
						padding: "10px 20px",
						backgroundColor: "#007bff",
						color: "white",
						border: "none",
						borderRadius: "4px",
					}}
				>
					Enviar
				</button>
			</form>
		</div>
	);
}
