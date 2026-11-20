'use strict'

const base_api_url = "https://pokeapi.co/api/v2/"

const message = document.getElementById("message");
const list_element = document.getElementById("generations-list");
const speciesContainer = document.getElementById("species");
const species_list_element = document.getElementById("species-list");

let currentGenerationId = null;


function displayMessage(msg) {
    if(message) {
        message.classList.remove("displayNone");
        message.innerHTML = msg;
    }
}
function hideMessage() {
    if(message) {
        message.classList.add("displayNone");
    }
}

async function loadGenerations() {
    displayMessage("Loading pokemons generations...")
    const response = await fetch(base_api_url + "generation/");
    if (!response.ok)
    {
        console.error(`${base_api_url} + generation/ -> ${response.status} (${response.statusText})`);
        return null;
    }
    const generation_json = await response.json();
    hideMessage();
    return generation_json;
}

async function loadPokemon(pokemon_url)
{    
    //const response = await fetch(base_api_url + "pokemon/"+pokemon_name);
    const response = await fetch(pokemon_url);
    if (!response.ok)
    {
        console.error(`${pokemon_name} -> ${response.status} (${response.statusText})`);
        return null;
    }
    const pokemon_json = await response.json();
    return pokemon_json;    
}

async function displayPokemon(pokemon_json) {  
    const titleName = document.getElementById("name");
    const image = document.getElementById("image");
    const types = document.getElementById("types");

    titleName.textContent = pokemon_json.name;
    image.src = pokemon_json.sprites.other.home.front_shiny;
    for (let i = 0 ; i < pokemon_json.types.length ; i++) {
        const typeElement = document.createElement("li")
        typeElement.innerHTML = pokemon_json.types[i].type.name;
        types.appendChild(typeElement);        
    }    
}

function displayGenerations(generations_json) {
    const generations_element = document.getElementById("generations");  
    const generations_items = generations_json.results;
    for(let i = 0 ; i < generations_items.length ; i++) {
        const listItem = document.createElement("li");
        listItem.id = `gen-${i}`;
        listItem.innerHTML = `<a href='javascript:generation_btn_click("${listItem.id}", "${generations_items[i].url}");'>${generations_items[i].name}</a>`;
        list_element.appendChild(listItem);
    }
    generations_element.classList.remove("displayNone");
}
function displaySpecies(species) {
    for(const species_item of species)
    {
        const species_item_li = document.createElement("li");        
        const species_item_link = document.createElement("a");
        species_item_link.href = species_item.url;
        const species_item_img = document.createElement("img");
        // species_item_img.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/259.png";
        loadPokemonThumb(species_item_img,species_item.name);
        species_item_link.appendChild(species_item_img);
        const species_item_name = document.createElement("div")
        species_item_link.appendChild(species_item_name);
        species_item_name.textContent = species_item.name;
        species_item_li.appendChild(species_item_link);
        species_list_element.appendChild(species_item_li);
        species_list_element.classList.remove("displayNone");
    }
    speciesContainer.classList.remove("displayNone");
}
function clearSpecies()
{
    species_list_element.innerHTML = "";
}



async function generation_btn_click(generation_id, generation_url) {
    if(currentGenerationId == null || currentGenerationId != generation_id)
    {
        const generation_json = await getGeneration(generation_url);
        const species = generation_json.pokemon_species;
        displaySpecies(species);        
    }
    else
    {
        clearSpecies();
    }
    toggleHighlightGeneration(generation_id);
}
function toggleHighlightGeneration(generation_id) { 
    if(currentGenerationId == null || currentGenerationId != generation_id)
    {
        currentGenerationId = generation_id;
        for(const node of list_element.children) {
            if(node.id != currentGenerationId)
            {
                node.classList.add("displayNone");
            }
        }
    }
    else
    {
        currentGenerationId = null;
        for(const node of list_element.children) {
            node.classList.remove("displayNone");            
        }
    }   
}

async function getGeneration(generation_url)
{
    const response = await fetch(generation_url);
    if(!response.ok)
    {
        displayMessage("Error loading species.")    
        return
    }
    const response_json = await response.json();
    hideMessage();
    return response_json;
}





async function loadPokemonThumb(img_element, pokemon_name)
{
    const response = await fetch(base_api_url + "pokemon-species/" + pokemon_name);

    if (!response.ok)
    {
        console.error(`${pokemon_name} -> ${response.status}`);
        return null;
    }

    const species_json = await response.json();
    const pokemon_url = species_json.varieties[0].pokemon.url;
    const pokemon_json = await loadPokemon(pokemon_name);
    console.log(pokemon_json);

    // Continue processing...
}
