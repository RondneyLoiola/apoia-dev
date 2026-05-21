export function createSlug(username: string): string {
  return username
    // Decompõe caracteres especiais (ã -> a + ˜)
    .normalize("NFD")

    // Remove acentos e diacríticos
    .replace(/[\u0300-\u036f]/g, "")

    // Substitui espaços por hífen
    .replace(/\s+/g, "-")

    // Remove caracteres especiais, mantendo apenas letras, números e hífen
    .replace(/[^a-zA-Z0-9-]/g, "")

    // Remove hífens duplicados
    .replace(/-+/g, "-")

    // Remove hífen do início e fim
    .replace(/^-|-$/g, "")

    // Converte para minúsculo
    .toLowerCase();
}