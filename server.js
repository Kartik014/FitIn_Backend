import app from "./app.js";
import pool from "./database/db.js";

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})