const cheerio = require("cheerio");
const axios = require("axios");
const urls = new Array("https://es.m.wikipedia.org/wiki/Affenpinscher",
                       "https://es.m.wikipedia.org/wiki/D%C3%B3berman",
                       "https://es.m.wikipedia.org/wiki/B%C3%B3xer",
                       "https://es.m.wikipedia.org/wiki/Saluki",
                       "https://es.m.wikipedia.org/wiki/Pit_bull_terrier_americano");

const data = new Array(); // [String, [Array]] - [Titulo, [Textos]]

const delay = ms => new Promise(res => setTimeout(res, ms));

    async function main () {
        getData();
        await delay(1500);
        console.log(data);
    }

    function getData() {
        try {
            urls.forEach(async url => {
                const response = await axios.get(url);
                const document = cheerio.load(response.data);

                const texts = new Array();
                let title = document("#section_0").text();

                for (let i = 0; i < 11; i++) {
                    let text = document(`#mf-section-0 > p:nth-child(${i})`).text();
                    if (!(text == "" || text == " ")){
                        texts.push(text);
                        //console.log(text +"");
                    } else {
                        //Nothing
                    }
                }
                await delay(100);
                data.push({'title':title, 'texts':texts});
            });
        } catch (error) {
            console.error(error);
        }
    }

    main();