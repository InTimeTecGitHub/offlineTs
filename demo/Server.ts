import app from "./App";

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Express server listening on port : ", PORT);
    console.log("open http://localhost:3000 to view.");
});
