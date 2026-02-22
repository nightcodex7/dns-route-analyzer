const express = require("express");
const { exec } = require("child_process");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./data.db");

db.run(`CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT,
  dns TEXT,
  traceroute TEXT,
  analysis TEXT
)`);

// DNS check
app.post("/dns", (req, res) => {
    const { domain, resolver } = req.body;

    exec(`dig @${resolver} ${domain} +stats`, (err, stdout) => {
        if (err) return res.status(500).send("DNS Error");

        res.json({ output: stdout });
    });
});

// Traceroute
app.post("/trace", (req, res) => {
    const { domain } = req.body;

    exec(`traceroute ${domain}`, (err, stdout) => {
        if (err) return res.status(500).send("Trace Error");

        res.json({ output: stdout });
    });
});

// Full check
app.post("/check", async (req, res) => {
    const { domain, resolver } = req.body;

    exec(`dig @${resolver} ${domain} +stats`, async (err1, dnsOut) => {
        exec(`traceroute ${domain}`, async (err2, traceOut) => {

            const ai = await axios.post("http://ai-agent:5001/analyze", {
                dns: dnsOut,
                trace: traceOut
            });

            db.run(
                `INSERT INTO results (domain, dns, traceroute, analysis) VALUES (?, ?, ?, ?)`,
                [domain, dnsOut, traceOut, ai.data.analysis]
            );

            res.json({
                dns: dnsOut,
                trace: traceOut,
                analysis: ai.data.analysis
            });
        });
    });
});

// History
app.get("/history", (req, res) => {
    db.all("SELECT * FROM results", (err, rows) => {
        res.json(rows);
    });
});

app.listen(5000, () => console.log("Backend running"));