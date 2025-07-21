// 🛠️ FILE: /api/docs.js

export default function handler(req, res) {
  return res.status(200).json({
    overview: "This API serves Pokémon data for GPT agents to build, validate, and simulate matches.",
    endpoints: [
      {
        path: "/api/species?name={species}",
        description: "Returns full data for one Pokémon. Species is case-insensitive."
      },
      {
        path: "/api/moves?name={move}",
        description: "Returns metadata for a specific move."
      },
      {
        path: "/api/tms",
        description: "Returns list of all TM moves and their availability."
      },
      {
        path: "/api/trainers?name={trainer}",
        description: "Returns full team data for a named trainer."
      },
      {
        path: "/api/legality?species={species}&level=##&badges=##",
        description: "Returns legal moves available at given level and badge count."
      },
      {
        path: "/api/build?species={species}&level=##&badges=##",
        description: "Returns best legal moveset and stats for a Pokémon."
      },
      {
        path: "/api/recommend",
        method: "POST",
        body: { trainer: "string", userTeam: "[{species, level}]" },
        description: "Scores current user team vs trainer. Uses cookie if no team passed."
      },
      {
        path: "/api/team-predict?trainer={trainer}&level=##&badges=##",
        description: "Builds best team vs trainer from full Pokédex."
      },
      {
        path: "/api/search?term={query}&type={pokemon|move|tm}",
        description: "Fuzzy search across Pokémon, move names, or types with full metadata."
      },
      {
        path: "/api/autocomplete?term={query}",
        description: "Fast search for names only (species, moves, TMs) for suggestions/autocomplete."
      }
    ],
    tips: [
      "Moves are stored internally as MOVE_NAME",
      "Use displayName for readability",
      "Badge count gates TM (≥2) and tutor (≥6) access",
      "Best builds sort by highest legal power moves"
    ]
  });
}
