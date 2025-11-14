import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Helper function to fetch with caching
async function fetchWithCache(url: string): Promise<any> {
  const cached = storage.getCache(url);
  if (cached) {
    return cached;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const data = await response.json();
  storage.setCache(url, data);
  return data;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get list of all Pokemon (national dex)
  app.get("/api/pokemon", async (req, res) => {
    try {
      const data = await fetchWithCache(`${POKEAPI_BASE}/pokemon?limit=1025`);
      
      const pokemonList = await Promise.all(
        data.results.map(async (pokemon: any, index: number) => {
          const id = index + 1;
          return {
            id,
            name: pokemon.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        })
      );

      res.json(pokemonList);
    } catch (error) {
      console.error("Error fetching Pokemon list:", error);
      res.status(500).json({ error: "Failed to fetch Pokemon list" });
    }
  });

  // Get individual Pokemon details
  app.get("/api/pokemon/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchWithCache(`${POKEAPI_BASE}/pokemon/${id}`);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching Pokemon ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch Pokemon details" });
    }
  });

  // Get Pokemon species data
  app.get("/api/pokemon/:id/species", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fetchWithCache(`${POKEAPI_BASE}/pokemon-species/${id}`);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching species for Pokemon ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch species data" });
    }
  });

  // Get evolution chain
  app.get("/api/pokemon/:id/evolution", async (req, res) => {
    try {
      const { id } = req.params;
      const speciesData = await fetchWithCache(`${POKEAPI_BASE}/pokemon-species/${id}`);
      const evolutionUrl = speciesData.evolution_chain.url;
      const evolutionData = await fetchWithCache(evolutionUrl);
      res.json(evolutionData);
    } catch (error) {
      console.error(`Error fetching evolution for Pokemon ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch evolution chain" });
    }
  });

  // Get move details for a Pokemon
  app.get("/api/pokemon/:id/moves", async (req, res) => {
    try {
      const { id } = req.params;
      const pokemonData = await fetchWithCache(`${POKEAPI_BASE}/pokemon/${id}`);
      
      // Prioritize level-up moves and popular TMs/HMs for better variety
      const levelUpMoves = pokemonData.moves.filter((m: any) => 
        m.version_group_details.some((v: any) => v.move_learn_method.name === 'level-up')
      );
      const machineMoves = pokemonData.moves.filter((m: any) => 
        m.version_group_details.some((v: any) => v.move_learn_method.name === 'machine')
      );
      const otherMoves = pokemonData.moves.filter((m: any) => 
        !m.version_group_details.some((v: any) => 
          v.move_learn_method.name === 'level-up' || v.move_learn_method.name === 'machine'
        )
      );
      
      // Get up to 60 moves: prioritize level-up, then machines, then others
      const selectedMoves = [
        ...levelUpMoves.slice(0, 35),
        ...machineMoves.slice(0, 20),
        ...otherMoves.slice(0, 5),
      ];
      
      const moveUrls = selectedMoves.map((m: any) => m.move.url);
      
      const movesData = await Promise.all(
        moveUrls.map(async (url: string) => {
          try {
            return await fetchWithCache(url);
          } catch (error) {
            console.error(`Error fetching move from ${url}:`, error);
            return null;
          }
        })
      );

      const validMoves = movesData.filter((move) => move !== null);
      res.json(validMoves);
    } catch (error) {
      console.error(`Error fetching moves for Pokemon ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch moves" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
