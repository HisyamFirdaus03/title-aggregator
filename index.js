import { scrapeTheVerge } from "./scraper.js";
import express from "express";
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async (req, res) => {
    try {
        console.log("Fetching articles...");
        const articles = await scrapeTheVerge();
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedArticles = articles.slice(startIndex, endIndex);
        const totalPages = Math.ceil(articles.length / limit);
        
        console.log(`Rendering ${paginatedArticles.length} articles (page ${page} of ${totalPages})`);
        res.render("index", { 
            articles: paginatedArticles,
            totalArticles: articles.length,
            currentPage: page,
            totalPages: totalPages,
            limit: limit
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error fetching articles");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit your app at the provided URL`);
});
