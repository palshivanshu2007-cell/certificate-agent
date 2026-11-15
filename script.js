
const certificateForm = document.querySelector("#certificate-form");
const preview = document.querySelector("#certificate-preview");
const verifyForm = document.querySelector("#verify-form");
const verificationResult = document.querySelector("#verification-result");

// Generate Certificate
certificateForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const studentName = document.querySelector("#student-name").value.trim();
    const courseName = document.querySelector("#course-name").value.trim();
    const organization = document.querySelector("#organization").value.trim();
    const issueDate = document.querySelector("#issue-date").value;

    const certificateID = "CA-" + Date.now().toString().slice(-8);

    const formattedDate = new Date(issueDate + "T00:00:00")
        .toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const records = JSON.parse(
        localStorage.getItem("certificateAgentRecords") || "{}"
    );

    records[certificateID] = {
        studentName,
        courseName,
        organization,
        issueDate: formattedDate
    };

    localStorage.setItem(
        "certificateAgentRecords",
        JSON.stringify(records)
    );

    const certificate = document.createElement("div");
    certificate.className = "certificate";

    const heading = document.createElement("h2");
    heading.textContent = "CERTIFICATE OF ACHIEVEMENT";

    const subtitle = document.createElement("p");
    subtitle.textContent = "This certificate is proudly presented to";

    const name = document.createElement("h1");
    name.textContent = studentName;

    const description = document.createElement("p");
    description.textContent = "For successfully completing " + courseName;

    const organizationName = document.createElement("h3");
    organizationName.textContent = organization;

    const date = document.createElement("p");
    date.textContent = "Issue Date: " + formattedDate;

    const id = document.createElement("small");
    id.textContent = "Certificate ID: " + certificateID;

    certificate.append(
        heading, subtitle, name, description,
        organizationName, date, id
    );

    preview.replaceChildren(certificate);

    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = `
    <span style="font-size:20px;">⬇</span>
    <span>Download Certificate</span>
`;

Object.assign(downloadButton.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    margin: "25px auto",
    padding: "15px 32px",
    background: "linear-gradient(135deg, #f5c76b, #d49a32)",
    color: "#061b17",
    border: "1px solid #f5c76b",
    borderRadius: "8px",
    fontSize: "17px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    fontFamily: "Georgia, serif",
    boxShadow: "0 5px 18px rgba(0,0,0,0.25)",
    cursor: "pointer"
});
    downloadButton.style.transition =
    "all 0.3s ease";

downloadButton.addEventListener("mouseenter", function() {
    downloadButton.style.transform = "translateY(-3px)";
    downloadButton.style.boxShadow =
        "0 9px 24px rgba(245,166,35,0.35)";
});

downloadButton.addEventListener("mouseleave", function() {
    downloadButton.style.transform = "translateY(0)";
    downloadButton.style.boxShadow =
        "0 5px 18px rgba(0,0,0,0.25)";
});
    // BUTTON PRESS ANIMATION
downloadButton.addEventListener("pointerdown", function() {
    downloadButton.style.transform = "scale(0.97)";
});

downloadButton.addEventListener("pointerup", function() {
    downloadButton.style.transform = "translateY(-3px)";
});

downloadButton.addEventListener("pointercancel", function() {
    downloadButton.style.transform = "translateY(0)";
});
    preview.appendChild(downloadButton);

    downloadButton.addEventListener("click", async function() {
        
        const exportCertificate = certificate.cloneNode(true);

        const wrapper = document.createElement("div");
        wrapper.id = "certificate-preview";

        Object.assign(wrapper.style, {
            position: "absolute",
            left: "0",
            top: "0",
            width: "1100px",
            background: "#ffffff",
            zIndex: "99999",
            padding: "30px"
        });

        Object.assign(exportCertificate.style, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "1000px",
  height: "700px",
  minHeight: "700px",
  padding: "30px",
  boxSizing: "border-box",
  background: "linear-gradient(135deg, #061b17, #0d2922)",
  border: "8px double #f5a623",
  boxShadow: "0 0 0 3px #f5a623",
  color: "#ffffff",
  borderRadius: "0",
  textAlign: "center",
  overflow: "visible",
position: "relative"
});

// PREMIUM INNER GOLD FRAME
const innerFrame = document.createElement("div");

Object.assign(innerFrame.style, {
    position: "absolute",
    inset: "16px",
    border: "1px solid rgba(245,198,107,0.75)",
    pointerEvents: "none",
    boxSizing: "border-box"
});

exportCertificate.appendChild(innerFrame);

// FOUR DECORATIVE GOLD CORNERS
[
    { top: "12px", left: "18px" },
    { top: "12px", right: "18px" },
    { bottom: "12px", left: "18px" },
    { bottom: "12px", right: "18px" }
].forEach(function(position) {
    const corner = document.createElement("div");
    corner.textContent = "❧";

    Object.assign(corner.style, {
        position: "absolute",
        ...position,
        color: "#f5c76b",
        fontSize: "34px",
        lineHeight: "1",
        pointerEvents: "none"
    });

    exportCertificate.appendChild(corner);
});

        // PREMIUM CERTIFICATE TEXT DESIGN

const brand = document.createElement("div");
brand.textContent = "✦  H A C K I N D I A  ✦";

Object.assign(brand.style, {
    color: "#f5a623",
    fontSize: "30px",
    fontWeight: "bold",
    letterSpacing: "4px",
    fontFamily: "Georgia, serif",
    marginBottom: "12px"
});

exportCertificate.insertBefore(
    brand,
    exportCertificate.firstChild
);

Array.from(exportCertificate.children).forEach(function(element) {
    Object.assign(element.style, {
        display: "block",
        visibility: "visible",
        opacity: "1",
        fontFamily: "Georgia, serif",
        textAlign: "center"
    });

    if (element.tagName === "H2") {
        Object.assign(element.style, {
    color: "#f5c76b",
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "3px",
    margin: "10px 0",
    textShadow: "0 2px 12px rgba(245,198,107,0.4)"
});
    }

    if (element.tagName === "H1") {
        Object.assign(element.style, {
    color: "#fff8e7",
    fontSize: "58px",
    fontWeight: "bold",
    letterSpacing: "2px",
    margin: "14px 0",
    borderBottom: "2px solid #f5c76b",
    paddingBottom: "16px",
    textShadow: "0 3px 15px rgba(245,166,35,0.3)"
});
    }

    if (element.tagName === "H3") {
        Object.assign(element.style, {
    color: "#f5c76b",
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: "2px",
    margin: "12px 0",
    textShadow: "0 2px 8px rgba(245,166,35,0.25)"
});
    }

    if (element.tagName === "P") {
        Object.assign(element.style, {
    color: "#e8e1cf",
    fontSize: "21px",
    lineHeight: "1.5",
    letterSpacing: "0.5px",
    margin: "9px 0",
    fontFamily: "Georgia, serif"
});
    } 

if (element.tagName === "SMALL") {
    Object.assign(element.style, {
        color: "#d5c18e",
        fontSize: "15px",
        letterSpacing: "1.5px",
        marginTop: "6px",
        paddingBottom: "5px",
        transform: "translateY(-12px)"
    });
}
});

        // PREMIUM ISSUE DATE
Object.assign(date.style, {
    color: "#f5c76b",
    fontSize: "17px",
    letterSpacing: "1px",
    marginTop: "16px",
    fontFamily: "Georgia, serif"
});

// PREMIUM CERTIFICATE ID
Object.assign(id.style, {
    color: "#e8d6a8",
    fontSize: "14px",
    letterSpacing: "1.5px",
    border: "1px solid rgba(245,198,107,0.5)",
    padding: "7px 16px",
    marginTop: "8px",
    display: "inline-block"
});
        
// PREMIUM GOLD AWARD EMBLEM
const emblem = document.createElement("div");

emblem.innerHTML = `
    <div style="
        font-size: 20px;
        color: #f5c76b;
        letter-spacing: 5px;
    ">❧ ✦ ❧</div>
    <div style="
        width: 65px;
        height: 65px;
        border: 3px solid #f5a623;
        border-radius: 50%;
        background: radial-gradient(circle, #f5c76b, #b87913);
        color: #061b17;
        font-size: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 4px auto;
        box-shadow: 0 0 15px rgba(245,166,35,0.35);
    ">★</div>
    <div style="
        font-size: 20px;
        color: #f5c76b;
        letter-spacing: 5px;
    ">❧ ✦ ❧</div>
`;

Object.assign(emblem.style, {
    textAlign: "center",
    margin: "0 auto 8px",
    fontFamily: "Georgia, serif"
});

exportCertificate.insertBefore(
    emblem,
    exportCertificate.children[1]
);
        // PREMIUM DECORATIVE DIVIDER
const divider = document.createElement("div");

divider.textContent = "✦ ━━━━━━━━━━━━━ ✦";

Object.assign(divider.style, {
    color: "#f5c76b",
    fontSize: "19px",
    letterSpacing: "3px",
    margin: "5px auto 12px",
    fontFamily: "Georgia, serif"
});

exportCertificate.insertBefore(
    divider,
    exportCertificate.children[7]
);


// PREMIUM CERTIFICATE FOOTER
const footer = document.createElement("div");

Object.assign(footer.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    marginTop: "auto",
    paddingTop: "20px",
    fontFamily: "Georgia, serif",
    transform: "translateY(-22px)"
});

// QR CODE SECTION - LEFT
const qrSection = document.createElement("div");

Object.assign(qrSection.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px"
});

const qrBox = document.createElement("div");

Object.assign(qrBox.style, {
    width: "96px",
    height: "96px",
    background: "#ffffff",
    padding: "5px",
    boxSizing: "border-box"
});

const qrLabel = document.createElement("div");
qrLabel.textContent = "CERTIFICATE ID";

Object.assign(qrLabel.style, {
    color: "#f5c76b",
    fontSize: "12px",
    letterSpacing: "1px"
});

qrSection.append(qrBox, qrLabel);

// AUTHORISED SIGNATURE - RIGHT
const signature = document.createElement("div");

signature.innerHTML = `
    <div style="
        width: 220px;
        border-top: 2px solid #f5a623;
        margin-bottom: 8px;
    "></div>
    <div style="
        color: #f5c76b;
        font-size: 19px;
        font-weight: bold;
    ">Authorised Signatory</div>
    <div style="
        color: #d5c18e;
        font-size: 13px;
        margin-top: 4px;
    ">HACKINDIA 2026</div>
`;

Object.assign(signature.style, {
    textAlign: "center",
    marginBottom: "8px",
    padding: "12px 18px",
    border: "1px solid rgba(245,198,107,0.45)",
    borderRadius: "4px",
    background: "rgba(245,198,107,0.04)",
    minWidth: "240px"
});

footer.append(qrSection, signature);
exportCertificate.appendChild(footer);

// GENERATE QR CODE
new QRCode(qrBox, {
    text: certificateID,
    width: 86,
    height: 86,
    colorDark: "#061b17",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

        
        wrapper.appendChild(exportCertificate);
        document.body.appendChild(wrapper);

        try {
            await html2pdf().set({
                margin: 0.2,
                filename: "My-Certificate-Test.pdf",
                image: {
                    type: "jpeg",
                    quality: 1
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: {
                    unit: "in",
                    format: "a4",
                    orientation: "landscape"
                }
            }).from(exportCertificate).save();

        } catch (error) {
            console.error(error);
            alert("PDF download failed. Please try again.");
        } finally {
            wrapper.remove();
        }
    });

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
