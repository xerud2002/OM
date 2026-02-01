import { cityData, CityData, getAllCitySlugs, getCityBySlug } from "./citySlugData";

export interface RouteData {
    fromCity: CityData;
    toCity: CityData;
    distanceKm: number; // Estimated
    durationHrs: number; // Estimated
    priceEstimate: {
        studio: string;
        twoRoom: string;
        house: string;
    };
}

// Simple distance matrix (mock data for now, could be replaced with real API or comprehensive matrix)
// Distances from Bucharest (Hub) to others roughly
const distancesFromBucharest: Record<string, number> = {
    "cluj-napoca": 450,
    "timisoara": 550,
    "iasi": 380,
    "constanta": 225,
    "brasov": 180,
    "craiova": 230,
    "galati": 250,
    "oradea": 600,
    "ploiesti": 60,
    "sibiu": 280,
    "bacau": 300,
    "suceava": 450,
    "arad": 600,
    "pitesti": 120,
    "targu-mures": 350,
    "baia-mare": 600,
    "satu-mare": 650,
    "bistrita": 450,
    "botosani": 450,
    "braila": 220,
    "buzau": 110,
    "calarasi": 120,
    "resita": 480,
    "sfantu-gheorghe": 200,
    "targoviste": 80,
    "slobozia": 130,
    "drobeta-turnu-severin": 350,
    "piatra-neamt": 350,
    "slatina": 180,
    "alexandria": 90,
    "giurgiu": 65,
    "zalau": 530,
    "deva": 400,
    "vaslui": 330,
    "targu-jiu": 300,
    "focsani": 180,
    "tulcea": 280,
    "ramnicu-valcea": 180,
    "alba-iulia": 360,
};

// Estimate distance between two cities (very rough triangulation via Bucharest if unknown direct)
function getEstimatedDistance(slug1: string, slug2: string): number {
    if (slug1 === slug2) return 0;

    // Specific direct routes (Hub to Hub) override
    if ((slug1 === "cluj-napoca" && slug2 === "timisoara") || (slug2 === "cluj-napoca" && slug1 === "timisoara")) return 320;
    if ((slug1 === "cluj-napoca" && slug2 === "iasi") || (slug2 === "cluj-napoca" && slug1 === "iasi")) return 390;
    if ((slug1 === "cluj-napoca" && slug2 === "brasov") || (slug2 === "cluj-napoca" && slug1 === "brasov")) return 270;
    if ((slug1 === "timisoara" && slug2 === "oradea") || (slug2 === "timisoara" && slug1 === "oradea")) return 170;
    if ((slug1 === "iasi" && slug2 === "bacau") || (slug2 === "iasi" && slug1 === "bacau")) return 130;
    if ((slug1 === "constanta" && slug2 === "tulcea") || (slug2 === "constanta" && slug1 === "tulcea")) return 125;

    // Default via Bucharest triangulation (Triangle inequality approximation * 0.8 for road efficiency vs direct line)
    const d1 = distancesFromBucharest[slug1] || 300;
    const d2 = distancesFromBucharest[slug2] || 300;

    if (slug1 === "bucuresti") return d2;
    if (slug2 === "bucuresti") return d1;

    // Simple approximation logic:
    // If distinct regions, sum likely accurate. If same region, substract?
    // Let's just sum and reduce by 20% to account for non-Bucharest routing
    return Math.round((d1 + d2) * 0.85);
}

export function getAllRoutePaths() {
    const paths: { params: { from: string; to: string } }[] = [];
    const tier1Cities = cityData.filter(c => c.tier === 1);
    const tier2Cities = cityData.filter(c => c.tier === 2);

    // Strategy 1: Inter-connect all Tier 1 cities (10 cities)
    // 10 * 9 = 90 routes
    for (const fromCity of tier1Cities) {
        for (const toCity of tier1Cities) {
            if (fromCity.slug !== toCity.slug) {
                paths.push({ params: { from: fromCity.slug, to: toCity.slug } });
            }
        }
    }

    // Strategy 2: Connect all Tier 2 to/from Bucharest (Capital Hub)
    const bucuresti = cityData.find(c => c.slug === "bucuresti");
    if (bucuresti) {
        for (const city of tier2Cities) {
            // Bucuresti -> Tier 2
            paths.push({ params: { from: "bucuresti", to: city.slug } });
            // Tier 2 -> Bucuresti
            paths.push({ params: { from: city.slug, to: "bucuresti" } });
        }
    }

    // Strategy 3: Regional Hub Connections (e.g. Cluj to nearby Tier 2)
    // Can be added later.

    return paths;
}

export function getRouteData(fromSlug: string, toSlug: string): RouteData | null {
    const fromCity = getCityBySlug(fromSlug);
    const toCity = getCityBySlug(toSlug);

    if (!fromCity || !toCity) return null;

    const distance = getEstimatedDistance(fromSlug, toSlug);
    const duration = Math.ceil(distance / 60) + 1; // Approx 60km/h avg speed + 1h loading/unloading buffer

    // Dynamic pricing based on distance (simplified model)
    // Base price + (Distance * Rate per km)
    const ratePerKm = 5.5; // RON/km one way (covers round trip fuel/driver)

    const studioBase = 600;
    const twoRoomBase = 900;
    const houseBase = 1500;

    const transportCost = distance * ratePerKm;

    const studioTotal = Math.round((studioBase + transportCost) / 50) * 50; // Round to nearest 50
    const twoRoomTotal = Math.round((twoRoomBase + (transportCost * 1.2)) / 50) * 50; // More weight/volume
    const houseTotal = Math.round((houseBase + (transportCost * 1.5)) / 50) * 50;

    return {
        fromCity,
        toCity,
        distanceKm: distance,
        durationHrs: duration,
        priceEstimate: {
            studio: `${studioTotal} - ${Math.round(studioTotal * 1.3)} RON`,
            twoRoom: `${twoRoomTotal} - ${Math.round(twoRoomTotal * 1.3)} RON`,
            house: `${houseTotal} - ${Math.round(houseTotal * 1.4)} RON`,
        }
    };
}
