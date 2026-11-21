
const certificateForm = document.querySelector("#certificate-form");
const preview = document.querySelector("#certificate-preview");
const verifyForm = document.querySelector("#verify-form");
const verificationResult = document.querySelector("#verification-result");

function createElement(tag, className, text = "") {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function buildCertificate(data) {
    const certificate = createElement("article", "certificate");

    const top = createElement("div", "certificate-top");
    top.append(
        createElement("div", "certificate-brand", "HACKINDIA"),
        createElement("div", "certificate-medal", "★")
    );

    const content = createElement("div", "certificate-content");

    content.append(
        createElement("p", "certificate-kicker", "OFFICIAL RECOGNITION"),
        createElement("h2", "certificate-title", "Certificate of Achievement"),
        createElement("p", "certificate-subtitle",
            "This certificate is proudly presented to"),
        createElement("h1", "certificate-name", data.studentName),
        createElement("p", "certificate-description",
            "For successfully completing " + data.courseName),
        createElement("div", "certificate-tier",
            "★ " + data.achievementTier + " ★"),
        createElement("h3", "certificate-organization",
            data.organization)
    );

    const footer = createElement("div", "certificate-footer");

    const date = createElement(
        "p",
        "certificate-date",
        "ISSUED ON  " + data.issueDate
    );

    const qrSection = createElement("div", "certificate-qr-section");
    const qr = createElement("div", "certificate-qr");
    const qrLabel = createElement(
        "span",
        "certificate-qr-label",
        "VERIFICATION ID"
    );
    const qrId = createElement(
        "span",
        "certificate-id",
        data.certificateID
    );

    qrSection.append(qr, qrLabel, qrId);

    const signature = createElement(
        "div",
        "certificate-signature",
        "AUTHORISED SIGNATORY"
    );

    signature.append(
        createElement("span", "signature-line", ""),
        createElement("small", "signature-event", "HACKINDIA 2026")
    );

    footer.append(date, qrSection, signature);

    certificate.append(top, content, footer);

    return certificate;
}

function createQR(qrElement, certificateID) {
    if (typeof QRCode === "undefined") {
        qrElement.textContent = certificateID;
        return;
    }

    qrElement.innerHTML = "";

    new QRCode(qrElement, {
        text: certificateID,
        width: 100,
        height: 100,
        colorDark: "#17130d",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Generate Certificate
certificateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentName =
        document.querySelector("#student-name").value.trim();

    const courseName =
        document.querySelector("#course-name").value.trim();

    const achievementTier =
        document.querySelector("#achievement-tier").value;

    const organization =
        document.querySelector("#organization").value.trim();

    const issueDate =
        document.querySelector("#issue-date").value;

    if (!studentName || !courseName || !organization || !issueDate) {
        alert("Please fill in all certificate details.");
        return;
    }

    const certificateID =
        "CA-" + Date.now().toString().slice(-8);

    const formattedDate = new Date(issueDate + "T00:00:00")
        .toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const data = {
        studentName,
        courseName,
        achievementTier,
        organization,
        issueDate: formattedDate,
        certificateID
    };

    const records = JSON.parse(
        localStorage.getItem("certificateAgentRecords") || "{}"
    );

    records[certificateID] = data;

    localStorage.setItem(
        "certificateAgentRecords",
        JSON.stringify(records)
    );

    const certificate = buildCertificate(data);

    preview.replaceChildren(certificate);

    createQR(
        certificate.querySelector(".certificate-qr"),
        certificateID
    );

    const downloadButton = createElement(
        "button",
        "certificate-download",
        "↓  Download Certificate"
    );

    downloadButton.type = "button";

    downloadButton.addEventListener("click", async function() {
        if (typeof html2pdf === "undefined") {
            alert("PDF library did not load. Please refresh the page.");
            return;
        }

        const pdfCertificate = certificate.cloneNode(true);

        const host = createElement("div", "pdf-export-host");
        host.appendChild(pdfCertificate);
        document.body.appendChild(host);

        try {
            createQR(
                pdfCertificate.querySelector(".certificate-qr"),
                certificateID
            );

            await html2pdf().set({
                margin: 0,
                filename: "HackIndia-" + certificateID + ".pdf",
                image: {
                    type: "jpeg",
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#10100e"
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "landscape"
                }
            }).from(pdfCertificate).save();

        } catch (error) {
            console.error("Certificate PDF error:", error);
            alert("PDF generation failed. Please try again.");
        } finally {
            host.remove();
        }
    });

    preview.appendChild(downloadButton);

    preview.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// Verify Certificate
verifyForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const enteredID = document.querySelector("#certificate-id")
        .value.trim().toUpperCase();

    const records = JSON.parse(
        localStorage.getItem("certificateAgentRecords") || "{}"
    );

    const record = records[enteredID];

    if (record) {
        verificationResult.textContent =
            "Certificate verified! Awarded to " +
            record.studentName + " for " +
            record.courseName + " by " +
            record.organization + " on " +
            record.issueDate + ".";

        verificationResult.className = "verification-success";
    } else {
        verificationResult.textContent =
            "No matching certificate found. Please check the Certificate ID.";

        verificationResult.className = "verification-error";
    }
});
