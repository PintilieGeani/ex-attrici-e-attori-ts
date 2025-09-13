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
  most_famous_movie: [string, string, string]
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