import { scrapeTheVerge } from "./scraper.js";
import express from "express";
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async (req, res) => {
    try {
        const articles = await scrapeTheVerge();
        res.render("index", { articles });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error fetching articles");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
