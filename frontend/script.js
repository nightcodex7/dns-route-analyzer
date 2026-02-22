function toggleCustomDNS() {  // added
    const resolver = document.getElementById("resolver").value;  // added
    const customField = document.getElementById("customDNS");  // added

    if (resolver === "custom") {  // added
        customField.style.display = "inline";  // added
    } else {
        customField.style.display = "none";  // added
    }
}

async function runCheck() {
    const domain = document.getElementById("domain").value;
    let resolver = document.getElementById("resolver").value;

    if (resolver === "custom") {  // added
        resolver = document.getElementById("customDNS").value;  // added
    }

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