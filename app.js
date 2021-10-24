/**
 * Application port: 8080
 * @author dariomr
 */
const cheerio = require("cheerio");
const axios = require("axios");

const express = require ("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine','ejs');
app.use(express.static('./public'));

// Application adapted to get data from dogs breeds from Wikipedia Mobile in Spanish
const urls = new Array("https://es.m.wikipedia.org/wiki/Affenpinscher",
                       "https://es.m.wikipedia.org/wiki/D%C3%B3berman",
                       "https://es.m.wikipedia.org/wiki/B%C3%B3xer",
                       "https://es.m.wikipedia.org/wiki/Saluki",
                       "https://es.m.wikipedia.org/wiki/Pit_bull_terrier_americano",
                       "https://es.m.wikipedia.org/wiki/Beagle",
                       "https://es.m.wikipedia.org/wiki/Labrador_retriever",
                       "https://es.m.wikipedia.org/wiki/Golden_retriever",
                       "https://es.m.wikipedia.org/wiki/Pastor_alem%C3%A1n");
                       
let data = new Array(); // [String, [Array]] - [title, [texts]]
const delay = ms => new Promise(res => setTimeout(res, ms));

app.listen(8080,()=>{
    console.log('Server started');
})

app.get('/',async (req,res) => {
    main();
    await delay(2000);
    res.render('index', {datos: data});
})

async function main() {
    getData();
    await delay(1500);
    //console.log(data);
}

function getData() {
    try {
        data = [];
        urls.forEach(async url => {
            const response = await axios.get(url);
            const document = cheerio.load(response.data);
            const texts = new Array();
            let title = document("#section_0").text();
            let image = document("#mf-section-0 > table > tbody > tr:nth-child(2) > td > a > img").attr("src");
            await delay(100);
            for (let i = 0; i < 11; i++) {
                let text = document(`#mf-section-0 > p:nth-child(${i})`).text();
                if (!(text == "" || text == " ")) {
                    texts.push(text);
                    //console.log(text +"");
                } else {
                    //Nothing
                }
            }
            await delay(200);
            data.push({ 'title':title, 'texts':texts, 'image':image});
        });
    } catch (error) {
        console.error(error);
    }
}