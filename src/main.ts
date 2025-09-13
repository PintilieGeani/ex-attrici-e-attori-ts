// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Actress = Person & {
  most_famous_movies: [string, string, string]
  awards: string,
  nationality: "American" | "British" | "Australian" | "Israeli-American" | "South African" | "French" | "Indian" | "Israeli" | "Spanish" | "South Korean" | "Chinese",
}

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

const apiUrl: string = "http://localhost:3333/actresses"

// Array di nationalità

const allowedNationalities = [
  "American", "British", "Australian", "Israeli-American",
  "South African", "French", "Indian", "Israeli",
  "Spanish", "South Korean", "Chinese"
] as const;

// typeGuard personalizzato

function isActress(dati: unknown): dati is Actress {
  if (dati &&
    typeof dati === "object" &&
    "id" in dati &&
    typeof dati.id === "number" &&
    "name" in dati &&
    typeof dati.name === "string" &&
    "birth_year" in dati &&
    typeof dati.birth_year === "number" &&
    (!("death_year" in dati) || typeof dati.death_year === "number") &&
    "biography" in dati &&
    typeof dati.biography === "string" &&
    "image" in dati &&
    typeof dati.image === "string" &&
    "most_famous_movies" in dati &&
    Array.isArray(dati.most_famous_movies) &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every((item) => typeof item === "string") &&
    "awards" in dati &&
    typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof dati.nationality === "string" &&
    allowedNationalities.includes(dati.nationality as string)
  ) {
    return true
  }
  return false
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`${apiUrl}/${id}`)

    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status} : ${response.statusText}`)
    }
    const data: unknown = await response.json()

    if (isActress(data)) {
      return data
    }
    throw new Error("Formato dei dati non valido")
  }
  catch (error) {
    if(error instanceof Error){
      console.error(`Errore durante il recupero dei dati:`, error.message)
    }
    return null
  }

}

const attrice = getActress(1).then(data => console.log(data))


// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET /actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.

type Actresses = Actress[]

function isActressesArray (dati: unknown): dati is Actresses{
  if(Array.isArray(dati) && 
    dati.every(isActress)
  ){
    return true
  }
  return false
}

async function getAllActresses(): Promise<Actresses | null> {

  try{
    const response = await fetch(apiUrl)

    if(!response.ok){
      throw new Error(`Errore HTML ${response.status}: ${response.statusText}`)
    }
    const data: unknown = await response.json()
    if(isActressesArray(data)){
      return data
    }
    throw new Error("Formato dei dati sbagliato")
  }
  catch(error){
    if(error instanceof Error){
      console.error("Errore nel recupero dei dati", error.message)
    }

    return null
  }
}

getAllActresses().then((data) => console.log(data))


// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(array : number[]): Promise <(Actress | null)[]> {
  const promises : Promise<Actress | null>[] = array.map((num) => getActress(num))

  try{
    const result = await Promise.all(promises)
      return result
  }
  catch(error){
    if(error instanceof Error){
      console.error("Errore nel recupero dei dati", error.message)
    }
    return []
  }
}

getActresses([1,2,3]).then((data) => console.log(data))


