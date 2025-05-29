import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeTheVerge() {
    const articles = [];
    const seenArticles = new Set();
    let page = 1;
    let hasOlderArticles = true;
    const referenceDate = new Date("2022-01-01");

    while (hasOlderArticles) {
        const url = `https://www.theverge.com/archives/${page}`;
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            $("._1ufh7nri").each((index, element) => {
                const title = $(element).find("._1lkmsmo1").text().trim();
                const link = $(element).find("._1lkmsmo1").attr("href");
                const dateString = $(element)
                    .find(".duet--article--timestamp time")
                    .attr("datetime");
                const date = new Date(dateString);
                const uniqueKey = `${title}|||${link}`;

                if (seenArticles.has(uniqueKey)) {
                    return;
                }

                if (date < referenceDate) {
                    console.log("Stop at: ");
                    console.log(title);
                    console.log(date);
                    hasOlderArticles = false;
                } else {
                    seenArticles.add(uniqueKey);
                    articles.push({
                        title,
                        link,
                        date,
                    });
                }
            });
            page++;
        } catch (error) {
            console.error(`Error scraping page: `, error);
            hasOlderArticles = false;
        }
    }

    console.log(articles);
    console.log(`Total unique articles found: ${articles.length}`);
    return articles.sort((a, b) => b.date - a.date);
}
