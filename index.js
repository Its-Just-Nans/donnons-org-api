const axios = require('axios');
const moment = require("moment");

const work = async () => {
    const res = await axios("https://donnons.org/Multimedia-High-tech/Provence-Alpes-Cote-d-Azur")
    //const res = await axios("https://donnons.org/Alimentaire/Provence-Alpes-Cote-d-Azur")
    const a = res.data.match(/<div id="search">(.|\n)*/gm);
    if (a && a[0]) {
        const article = a[0].match(/<a.+class="lst-anno[^]+?<\/a>/g)
        for (const oneArticle of article) {
            let detail = null;
            try {
                detail = parseOneArticle(oneArticle);
            } catch (e) {
                e;
            }
            console.log(JSON.stringify(detail, null, 4));
            break;
        }
    }
}


const parseOneArticle = (oneArticle) => {
    const date = oneArticle.match(/f-grow-1 text-grey text-right.*>([^]*?)<\/span>/g)[0].replace(/.*>([^]+)<\/span>/, "$1").trim();
    let unit;
    const numberInString = date.replace(/[^\d]*(\d+)[^\d]*/, "$1");
    if (numberInString.length > 5) {
        throw "SUSPICOUS_DATE";
    }
    let number = parseInt(numberInString);
    if (/minute/.test(date)) {
        unit = "minutes";
    } else if (/jour/.test(date)) {
        unit = "days";
    } else if (/mois/.test(date)) {
        unit = "months";
    }
    const dateArticle = moment().subtract(number, unit).set({ second: 0, millisecond: 0 }).toISOString();
    const context = oneArticle.match(/<script type="application\/ld\+json">[^<]*<\/script>/gm)[0];
    const cleanedContext = context.replace(`<script type="application/ld+json">`, "").replace("</script>", "");
    const detail = JSON.parse(cleanedContext);
    detail.date = dateArticle;
    return detail;
}

work()