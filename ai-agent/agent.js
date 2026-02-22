const express = require("express");
const app = express();
app.use(express.json());

app.post("/analyze", (req, res) => {
    const { dns, trace } = req.body;

    let analysis = "DNS and route look normal.";

    if (dns.includes("Query time:")) {
        const match = dns.match(/Query time: (\d+)/);
        if (match && parseInt(match[1]) > 200) {
            analysis = "High DNS latency detected.";
        }
    }

    if (trace.split("\n").length > 20) {
        analysis += " Route has many hops.";
    }

    res.json({ analysis });
});

app.listen(5001, () => console.log("AI agent running"));