
import axios from "axios";
import useSWR from "swr";

const DATATYPE = {
    ships: 0,
    levels: 1,
    scores: 2
}

const CMS_SERVER = "https://dev-mouse-cs55-final.pantheonsite.io/wp-json/mouse/v1/"

const ENDPOINTS = [
    "players",
    "levels",
    "scores"
]

function getEndpoint (datatype, id) {
    let endpoint = CMS_SERVER;

    if (datatype < ENDPOINTS.length) {
        endpoint += ENDPOINTS[datatype];

        if (id != undefined) {
            endpoint += "/";
            endpoint += id;
        }
    }

    return endpoint;
}

function parseAcfFields( post_obj ) {
    let tmp = post_obj.acf_fields;
    let acfobj = tmp.split(/(?<!\\),/)                                      // separate the rows into an array
                    .map( (row) => row.split(/(?<!\\):/)                    // within each row, separate name/value, making a 2d array
                                      .map( (val) => val.replace("\\", "")) // Remove the escape characters
                        ) 
                    .reduce( (obj, row) => { return { ...obj,               // merge all rows into a single object
                                                      [row[0]]: row[1],     // map columns into name:value pairs
                                                    };
                                           },
                              {}
                           );

    // Merge the result with the original object, overwriting the acf_fields property
    return { ...post_obj, 
             "acf_fields":acfobj
           }
}

async function fetcher (url) {
    let data = await axios.get(url)
      .then((res) => res.data)
      .then((datalist) => datalist.map( (item) => parseAcfFields(item)))
      .then((datalist) => datalist.map( (item) => { return { ...item, ...item.acf_fields}}))

    console.log(data);
    return data;
}

function getData (datatype, id) {
    const address = getEndpoint(datatype, id);
    const { data, error } = useSWR(address, fetcher);

    return data;
}

export function getShips (tmp) {
    let ships = getData(DATATYPE.ships);
    return ships;
}

export async function getShip (id) {
    const address = getEndpoint(DATATYPE.ships, id);
    let ship = await fetcher(address);
    return ship;
}

export function getLevels (tmp) {
    let ships = getData(DATATYPE.levels);
    return ships;
}

export async function getLevel (id) {
    const address = getEndpoint(DATATYPE.levels, id);
    let ship = await fetcher(address);
    return ship;
}

export function getScores (tmp) {
    let ships = getData(DATATYPE.scores);
    return ships;
}

export async function getScore (id) {
    const address = getEndpoint(DATATYPE.scores, id);
    let ship = await fetcher(address);
    return ship;
}