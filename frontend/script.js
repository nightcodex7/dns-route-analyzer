async function runCheck() {
    const domain = document.getElementById("domain").value;
    const resolver = document.getElementById("resolver").value;

    const res = await fetch("http://localhost:5000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, resolver })
    });

    const data = await res.json();

    document.getElementById("output").textContent =
        "DNS:\n" + data.dns +
        "\n\nTRACE:\n" + data.trace +
        "\n\nAI:\n" + data.analysis;
}