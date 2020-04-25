//this might be where the graphQL stuff goes?
const { buildSchema } = require("graphql");
const data = require("./data"); //wherever your data is

const schema = buildSchema(`
  type Pokemon {
    id: String
    name: String!
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: WeightOrHeight
    height: WeightOrHeight
    fleeRate: Float
    evolutionRequirements: EvolutionRequirements
    evolutions: [Evolutions]
    maxCP: Int
    maxHP: Int
    attacks: Attacks
  }

  type WeightOrHeight {
    minimum: String
    maximum: String
  }

  type EvolutionRequirements {
    amount: Int
    name: String
  }

  type Evolutions {
    id: Int
    name: String
  }

  type Attacks {
    fast: [Attack]
    special: [Attack]
  }

  type Attack {
    name: String
    type: String
    damage: Int
  }

  type HasAttack {
    name: String
    type: String
    damage: Int
  }

  input PokemonInput {
    id: String
    name: String!
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: WeightOrHeightInput
    height: WeightOrHeightInput
    fleeRate: Float
    evolutionRequirements: EvolutionRequirementsInput
    evolutions: [EvolutionsInput]
    maxCP: Int
    maxHP: Int
    attacks: AttacksInput
  }

 input WeightOrHeightInput {
    minimum: String
    maximum: String
  }

 input EvolutionRequirementsInput {
    amount: Int
    name: String
  }

  input EvolutionsInput {
    id: Int
    name: String
  }

input AttacksInput {
    fast: [AttackInput]
    special: [AttackInput]
  }

input AttackInput {
    name: String
    type: String
    damage: Int
  }

  type Query {
    Pokemons: [Pokemon]
    Pokemon(id: String, name: String): Pokemon
    HasType(type: String): [Pokemon]
    HasAttack(attack: String): [Pokemon]
    AllAttacks: Attacks
    AttacksByType(type: String): [Attack]
    Types: [String]
  }

  type Mutation {
    AddType(type: String): [String]
    AddPokemon(input: PokemonInput): [Pokemon]
    AddAttack(type: String, input: AttackInput): Attacks
    DeleteType(type: String): [String]
    DeletePokemon(id: String, name: String): [Pokemon]
    DeleteAttack(name: String): Attacks
    ModifyPokemon(id: String, name: String, input: PokemonInput): [Pokemon]
    ModifyType(type: String, typeInput: String): [String]
    ModifyAttacks(name: String, input: AttackInput): Attacks
  }

`);

//Notes on how to query
//mutation {
//AddPokemon(input: {name:"tsest"}) {name id}
//AddAttack(type: "fast", input: {name:"test"}) {special{name type damage}}
//}

const root = {
  Pokemons: () => {
    return data.pokemon;
  },
  Pokemon: (request) => {
    return data.pokemon.find(
      (pokemon) => pokemon.name === request.name || pokemon.id === request.id
    );
  },
  AttacksByType: (request) => {
    const type = request.type;
    return data.attacks[type];
  },
  Types: () => {
    return data.types;
  },
  AllAttacks: () => {
    return data.attacks;
  },
  HasType: (request) => {
    const pokemons = [];
    data.pokemon.forEach((pokemon) => {
      if (pokemon.types.includes(request.type)) {
        pokemons.push(pokemon);
      }
    });
    return pokemons;
  },
  HasAttack: (request) => {
    const pokemons = [];
    data.pokemon.forEach((pokemon) => {
      for (const key in pokemon.attacks) {
        pokemon.attacks[key].forEach((attack) => {
          if (attack.name === request.attack) {
            pokemons.push(pokemon);
          }
        });
      }
    });
    return pokemons;
  },
  AddType: (request) => {
    data.types.push(request.type);
    return data.types;
  },
  AddPokemon: (request) => {
    const pokemon = Object.assign({}, request.input);
    data.pokemon.push(pokemon);
    return data.pokemon;
  },
  AddAttack: (request) => {
    data.attacks[request.type].push(request.input);
    return data.attacks;
  },
  DeleteType: (request) => {
    const index = data.types.indexOf(request.type);
    data.types.splice(index, 1);
    return data.types;
  },
  DeletePokemon: (request) => {
    for (let i = 0; i < data.pokemon.length; i++) {
      if (
        data.pokemon[i].id === request.id ||
        data.pokemon[i].name === request.name
      ) {
        data.pokemon.splice([i], 1);
      }
    }
    return data.pokemon;
  },
  DeleteAttack: (request) => {
    for (const key in data.attacks) {
      for (let i = 0; i < data.attacks[key].length; i++) {
        if (data.attacks[key][i].name === request.name) {
          data.attacks.fast.splice([i], 1);
        }
      }
    }
    return data.attacks;
  },
  ModifyType: (request) => {
    const index = data.types.indexOf(request.type);
    console.log(request.typeInput);
    data.types[index] = request.typeInput;
    return data.types;
  },

  ModifyPokemon: (request) => {
    data.pokemon.forEach((pokemon) => {
      if (request.id && pokemon.id === request.id) {
        Object.assign(pokemon, request.input);
      }
      if (request.name && pokemon.name === request.name) {
        Object.assign(pokemon, request.input);
      }
    });
    return data.pokemon;
  },
  ModifyAttacks: (request) => {
    for (const key in data.attacks) {
      data.attacks[key].forEach((attack) => {
        if (request.name === attack.name) {
          Object.assign(attack, request.input);
        }
      });
    }
    return data.attacks;
  },
};
