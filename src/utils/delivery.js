// Coordenadas fictícias do restaurante (Centro de São Luís, por exemplo)
export const RESTAURANT_COORDS = {
    lat: -2.5297,
    lng: -44.3028
};

// Lista mockada de bairros (alguns exemplos de São Luís - MA)
export const NEIGHBORHOODS = [
    { name: 'Centro', lat: -2.5297, lng: -44.3028 },
    { name: 'Renascença', lat: -2.5085, lng: -44.2989 },
    { name: 'Cohama', lat: -2.5186, lng: -44.2536 },
    { name: 'Turu', lat: -2.4867, lng: -44.2372 },
    { name: 'São Francisco', lat: -2.5123, lng: -44.3129 },
    { name: 'Anjo da Guarda', lat: -2.5701, lng: -44.3117 },
    { name: 'Tirirical', lat: -2.5647, lng: -44.2461 },
    { name: 'Calhau', lat: -2.4932, lng: -44.2885 }
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * Calcula a distância em km entre duas coordenadas usando a fórmula de Haversine.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

/**
 * Calcula a estimativa de preço baseada na distância.
 * Pode ser facilmente substituída por chamadas de API reais no futuro.
 * 
 * @param {number} distance Distância em km
 * @returns {object} Estimativas para Uber e 99
 */
export function calculateEstimates(distance) {
    // Valores mockados
    const baseFee = 5.00;
    const pricePerKm = 1.50;

    // Cálculo base (+10% para 99 como mock de diferença, por ex., ou mesmo valor)
    const basePriceUber = baseFee + (pricePerKm * distance);
    const basePrice99 = (baseFee - 0.50) + (pricePerKm * distance); // 99 um pouco mais barato, por exemplo

    // Aplica variação de 15% para criar uma faixa
    const variation = 0.15;

    return {
        uber: {
            min: basePriceUber * (1 - variation),
            max: basePriceUber * (1 + variation)
        },
        99: {
            min: basePrice99 * (1 - variation),
            max: basePrice99 * (1 + variation)
        }
    };
}
