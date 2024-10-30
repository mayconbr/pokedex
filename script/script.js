const tipoCores = {
    grass: "#78C850",
    fire: "#F08030",
    water: "#6890F0",
    bug: "#A8B820",
    normal: "#A8A878",
    poison: "#A040A0",
    electric: "#F8D030",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C03028",
    psychic: "#F85888",
    rock: "#B8A038",
    ghost: "#705898",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    flying: "#A890F0"
};

var modal = document.getElementById("modal");
var close = document.getElementsByClassName("close")[0];

const limit = 10;
var offset = 0;


// Chama as funções ao carregar a página
populateTypeSelect();
populateHabitatSelect();
buscarPokemonsPaginados();

function openModal(pokemon) {
    modal.style.display = "block";
     createModal(pokemon);
}

close.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function createModal(pokemon) {
    endpoint = 'pokemon'
    const data = await PokeApi(endpoint, pokemon);

    nomePokemon = data.name; 

    h1 = document.getElementById("namePokemonModal");
    h1.textContent  = nomePokemon.charAt(0).toUpperCase() + nomePokemon.slice(1);

    IdPokemon = document.getElementById('numberPokemonModal');
    let IdComZeros = pokemon.toString().padStart(3, '0');
    IdPokemon.textContent = '#' + IdComZeros;

    const tipos = data.types.map(tipoInfo => tipoInfo.type.name);
    const corDoTipo = tipoCores[tipos[0]] || "#A8A878"; 
    var ColorModal = document.getElementById('ColorModal');
    var ContentInfo = document.getElementById('ContentInfo');

    ColorModal.style.backgroundColor = corDoTipo;
    ContentInfo.style.backgroundColor = corDoTipo;

    // Preencher os tipos do Pokémon
    const cardTypeContainer = document.getElementById("cardTypeModal");
    cardTypeContainer.innerHTML = ''; // Limpa os tipos existentes

    // Cria um span para cada tipo
    tipos.forEach(tipos => {
        const tipoElemento = document.createElement("span");
        tipoElemento.classList.add("card-type-item", tipos); 
        tipoElemento.textContent = tipos;

        cardTypeContainer.appendChild(tipoElemento);
    });


//cria array status
const statusBase = data.stats.map(statInfo => ({
    stat: statInfo.stat.name.charAt(0).toUpperCase() + statInfo.stat.name.slice(1),
    valor: statInfo.base_stat
}));

const aboutModal = document.querySelector('.stats');  

// apaga stats
aboutModal.querySelectorAll('p').forEach(p => p.remove());
statusBase.forEach(({ stat, valor }) => {
    const p = document.createElement('p');
    p.textContent = `${stat}: ${valor}`;
    aboutModal.appendChild(p);
});

// cria array de habilidades
const habilidades = data.abilities.map(abilityInfo => ({
    habilidade: abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)
}));

const abilitiesContainer = document.querySelector('.container-habities div');

// apaga habilidades
abilitiesContainer.querySelectorAll('p').forEach(p => p.remove());

habilidades.forEach(({ habilidade }) => {
    const p = document.createElement('p');
    p.textContent = habilidade;
    abilitiesContainer.appendChild(p);
});

//imagem
const imgUrl = data.sprites.front_default;
const imgElement = document.querySelector('img#pokemonImageModal');

imgElement.src = imgUrl;
imgElement.alt = `${pokemon} image`

}

//remover função e editar 
document.getElementById('searchPokemon').addEventListener('keydown', function (event) {
    const pokemon = document.getElementById('searchPokemon').value;
    if (event.key === 'Enter' || event.keyCode === 13) {
        searchPokemon(pokemon);
    }
});

//Função generica 
async function PokeApi(endpoint, pokemon) {
    const response = await fetch('https://pokeapi.co/api/v2/' + endpoint + '/' + pokemon);
    const data = await response.json();
    return data;
}

async function AllSeach(endpoint) {
    const response = await fetch(`https://pokeapi.co/api/v2/${endpoint}`);
    const data = await response.json();
    return data;
}

async function searchPokemon(query) {
    const allPokemons = await AllSeach('pokemon?limit=1000');
    const filteredPokemons = allPokemons.results.filter(pokemon =>
        pokemon.name.includes(query.toLowerCase()) // Verifica se o nome contém o termo digitado
    );

    if (filteredPokemons.length === 0) {
        alert("Nenhum Pokémon encontrado.");
        return;
    }

    var idsSearch = filteredPokemons.map(pokemon => {
        const urlParts = pokemon.url.split('/');
        return urlParts[urlParts.length - 2]; // Pega o penúltimo elemento, que é o ID
    });

    buscarPokemonsPorIds(idsSearch);

    // endpoint = 'pokemon'
    // const data = await PokeApi(endpoint, idsSearch);

    // offset = data.id;
    // offset = offset - 1;
    // buscarPokemonsPaginados();
}


async function buscarPokemonsPaginados() {
    apagarTodosOsCartoes();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();

        const container = document.getElementById("cont-card");

        for (const pokemon of data.results) {
            const detalhesResponse = await fetch(pokemon.url);
            const detalhesData = await detalhesResponse.json();

            // Ebases pokemon
            const nome = detalhesData.name;
            const tipos = detalhesData.types.map(tipoInfo => tipoInfo.type.name);
            const imagem = detalhesData.sprites.front_default;
            const id = detalhesData.id;

            // Define a cor do cartão 
            const corDoTipo = tipoCores[tipos[0]] || "#A8A878"; 

            // Cria card
            const card = document.createElement("div");
            card.classList.add("card-pokemon");
            card.setAttribute("id", `card-${nome}`);
            card.setAttribute("onclick", `openModal(${id})`); // pokemonid
            card.style.backgroundColor = corDoTipo;

            // nome 
            const nomeElemento = document.createElement("p");
            nomeElemento.setAttribute("id", `pokemonName-${nome}`);
            nomeElemento.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);

            // tipo
            const contType = document.createElement("div");
            contType.classList.add("cont-type");

            const primaryType = document.createElement("span");
            primaryType.classList.add("card-type");
            primaryType.setAttribute("id", `primaryType-${nome}`);
            primaryType.textContent = tipos[0];
            contType.appendChild(primaryType);

            if (tipos[1]) {
                const secondaryType = document.createElement("span");
                secondaryType.classList.add("card-type");
                secondaryType.setAttribute("id", `secondaryType-${nome}`);
                secondaryType.textContent = tipos[1];
                contType.appendChild(secondaryType);
            }

            // Imagem 
            const imgContainer = document.createElement("div");
            const imagemElemento = document.createElement("img");
            imagemElemento.setAttribute("id", `pokemonImage-${nome}`);
            imagemElemento.src = imagem;
            imagemElemento.width = 150;
            imagemElemento.classList.add("pokemon-img");
            imgContainer.appendChild(imagemElemento);

            // Monta o card
            const cardContent = document.createElement("div");
            cardContent.appendChild(nomeElemento);
            cardContent.appendChild(contType);

            card.appendChild(cardContent);
            card.appendChild(imgContainer);

            // Adiciona o card no container
            container.appendChild(card);
        }
    } catch (error) {
        alert.error("Erro ao buscar Pokémons:", error);
    }
}


function paginaAnterior() {
    offset = offset - limit;
    buscarPokemonsPaginados();

}

function proximaPagina() {
    offset = offset + limit;
    buscarPokemonsPaginados();
}


function apagarTodosOsCartoes() {
    const container = document.getElementById("cont-card");
    container.innerHTML = "";
}

async function buscarPokemonsPorIds(ids) {
    apagarTodosOsCartoes();

    try {
        const container = document.getElementById("cont-card");

        for (const id of ids) {
            const detalhesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const detalhesData = await detalhesResponse.json();

            const nome = detalhesData.name;
            const tipos = detalhesData.types.map(tipoInfo => tipoInfo.type.name);
            const imagem = detalhesData.sprites.front_default;

            const corDoTipo = tipoCores[tipos[0]] || "#A8A878";

            const card = document.createElement("div");
            card.classList.add("card-pokemon");
            card.setAttribute("id", `card-${nome}`);
            card.setAttribute("onclick", `openModal(${id})`);
            card.style.backgroundColor = corDoTipo;

            const nomeElemento = document.createElement("p");
            nomeElemento.setAttribute("id", `pokemonName-${nome}`);
            nomeElemento.textContent = nome.charAt(0).toUpperCase() + nome.slice(1);

            const contType = document.createElement("div");
            contType.classList.add("cont-type");

            const primaryType = document.createElement("span");
            primaryType.classList.add("card-type");
            primaryType.setAttribute("id", `primaryType-${nome}`);
            primaryType.textContent = tipos[0];
            contType.appendChild(primaryType);

            if (tipos[1]) {
                const secondaryType = document.createElement("span");
                secondaryType.classList.add("card-type");
                secondaryType.setAttribute("id", `secondaryType-${nome}`);
                secondaryType.textContent = tipos[1];
                contType.appendChild(secondaryType);
            }

            // Imagem do Pokémon
            const imgContainer = document.createElement("div");
            const imagemElemento = document.createElement("img");
            imagemElemento.setAttribute("id", `pokemonImage-${nome}`);
            imagemElemento.src = imagem;
            imagemElemento.width = 150;
            imagemElemento.classList.add("pokemon-img");
            imgContainer.appendChild(imagemElemento);

            // Monta o card
            const cardContent = document.createElement("div");
            cardContent.appendChild(nomeElemento);
            cardContent.appendChild(contType);

            card.appendChild(cardContent);
            card.appendChild(imgContainer);

            // Adiciona o card no container
            container.appendChild(card);
        }
    } catch (error) {
        alert("Erro ao buscar Pokémons:", error);
    }
}


async function populateTypeSelect() {
    const typeSelect = document.getElementById("typeSelect");
    typeSelect.innerHTML = '<option value="">Tipos</option>';
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();
    data.results.forEach(type => {
        const option = document.createElement("option");
        option.value = type.url.split("/").slice(-2, -1)[0]; // Define o ID do tipo
        option.textContent = type.name;
        typeSelect.appendChild(option);
    });
}

// Preenche o select de habitat
async function populateHabitatSelect() {
    const habitatSelect = document.getElementById("habitatSelect");
    habitatSelect.innerHTML = '<option value="">Habitats</option>';
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-habitat");
    const data = await response.json();
    data.results.forEach(habitat => {
        const option = document.createElement("option");
        option.value = habitat.url.split("/").slice(-2, -1)[0]; // Define o ID do habitat
        option.textContent = habitat.name;
        habitatSelect.appendChild(option);
    });
}

async function fetchFilteredPokemonIDs() {
    const typeSelectValue = document.getElementById('typeSelect').value;
    const habitatSelectValue = document.getElementById('habitatSelect').value;

    // Verifica se pelo menos um filtro foi selecionado
    if (!typeSelectValue && !habitatSelectValue) {
        console.warn("Selecione pelo menos um filtro: tipo ou habitat.");
        return [];
    }

    let pokemonByType = [];
    let pokemonByHabitat = [];

    try {
        // Requisição para o filtro de tipo (se um valor foi selecionado)
        if (typeSelectValue) {
            const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${typeSelectValue}`);
            if (!typeResponse.ok) {
                throw new Error(`Erro ao buscar tipo: ${typeResponse.statusText}`);
            }
            const typeData = await typeResponse.json();
            pokemonByType = typeData.pokemon.map(pokemonEntry => pokemonEntry.pokemon);
        }

        // Requisição para o filtro de habitat (se um valor foi selecionado)
        if (habitatSelectValue) {
            const habitatResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${habitatSelectValue}`);
            if (!habitatResponse.ok) {
                throw new Error(`Erro ao buscar habitat: ${habitatResponse.statusText}`);
            }
            const habitatData = await habitatResponse.json();
            pokemonByHabitat = habitatData.pokemon_species;
        }

        // Filtra Pokémon com base em ambos os filtros, ou apenas um, conforme selecionado
        let filteredPokemons;
        if (typeSelectValue && habitatSelectValue) {
            filteredPokemons = pokemonByType.filter(pokemonType =>
                pokemonByHabitat.some(pokemonHabitat => pokemonHabitat.name === pokemonType.name)
            );
        } else {
            filteredPokemons = typeSelectValue ? pokemonByType : pokemonByHabitat;
        }

        // Extrai os IDs dos Pokémon que passaram nos filtros e retorna como array
        const pokemonIDs = filteredPokemons.map(pokemon => {
            const urlParts = pokemon.url.split('/');
            return urlParts[urlParts.length - 2]; // ID do Pokémon na URL
        });

        console.log("Pokémon IDs filtrados:", pokemonIDs);

        buscarPokemonsPorIds(pokemonIDs);


        return pokemonIDs;
    } catch (error) {
        console.error("Erro ao buscar Pokémon pelos filtros:", error);
        return [];
    }
}
