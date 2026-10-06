
// ===============================
// Load Products
// ===============================

const products = JSON.parse(localStorage.getItem("products")) || [];


// ===============================
// Monthly Expiry Report
// ===============================

const expiryReport = {};

products.forEach(product => {

    const date = product.expiryDate;

    if (expiryReport[date]) {
        expiryReport[date]++;
    } else {
        expiryReport[date] = 1;
    }

});


// ===============================
// Create Line Graph
// ===============================

new Chart(document.getElementById("monthlyChart"), {

    type: "line",

    data: {

        labels: Object.keys(expiryReport),

        datasets: [{

            label: "Products Expiring",

            data: Object.values(expiryReport),

            borderColor: "green",
            backgroundColor: "rgba(0,128,0,0.2)",

            fill: true,
            tension: 0.4,

            pointRadius: 5,
            pointBackgroundColor: "green"

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {
                display: true
            }

        },

        scales: {

            y: {

                beginAtZero: true,

                title: {
                    display: true,
                    text: "Number of Products"
                }

            },

            x: {

                title: {
                    display: true,
                    text: "Expiry Date"
                }

            }

        }

    }

});


// ===============================
// Category Report
// ===============================

const category = {};

products.forEach(product => {

    category[product.category] =
        (category[product.category] || 0) + 1;

});


new Chart(document.getElementById("categoryChart"), {

    type: "pie",

    data: {

        labels: Object.keys(category),

        datasets: [{

            data: Object.values(category),

            backgroundColor: [
                "#4CAF50",
                "#FF9800",
                "#2196F3",
                "#F44336",
                "#9C27B0",
                "#009688"
            ]

        }]

    }

});


// ==================================================
// PREVIOUS MONTHS HISTORY
// ==================================================


// Load saved monthly history

const history =
    JSON.parse(localStorage.getItem("productHistory")) || [];


// Month dropdown

const monthSelect =
    document.getElementById("monthSelect");


// History table

const historyTableBody =
    document.getElementById("historyTableBody");


// Export button

const exportButton =
    document.getElementById("exportExcel");


// ===============================
// Add Months to Dropdown
// ===============================

history.forEach(monthData => {

    const option = document.createElement("option");

    option.value = monthData.month;

    const date = new Date(monthData.month + "-01");

    option.textContent = date.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

    monthSelect.appendChild(option);

});


// ===============================
// Display Selected Month
// ===============================

monthSelect.addEventListener("change", function () {

    const selectedMonth = this.value;

    if (!selectedMonth) {

        historyTableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Select a month to view records.
            </td>
        </tr>
        `;

        return;
    }


    const monthData =
        history.find(item => item.month === selectedMonth);


    if (!monthData || monthData.products.length === 0) {

        historyTableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                No records available for this month.
            </td>
        </tr>
        `;

        return;
    }


    historyTableBody.innerHTML = "";


    const today = new Date();


    monthData.products.forEach(product => {

        const expiry = new Date(product.expiryDate);

        const diff = Math.ceil(
            (expiry - today) /
            (1000 * 60 * 60 * 24)
        );


        let status;


        if (diff < 0) {

            status = "Expired";

        }
        else if (diff <= 7) {

            status = "Expiring Soon";

        }
        else {

            status = "Fresh";

        }


        historyTableBody.innerHTML += `

        <tr>

            <td>${product.productName}</td>

            <td>${product.category}</td>

            <td>${product.quantity}</td>

            <td>${product.manufacturingDate}</td>

            <td>${product.expiryDate}</td>

            <td>${status}</td>

        </tr>

        `;

    });

});


// ==================================================
// EXPORT SELECTED MONTH TO EXCEL
// ==================================================


exportButton.addEventListener("click", function () {

    const selectedMonth = monthSelect.value;


    if (!selectedMonth) {

        alert("⚠️ Please select a month first.");

        return;

    }


    const monthData =
        history.find(item => item.month === selectedMonth);


    if (!monthData || monthData.products.length === 0) {

        alert("❌ No records available for this month.");

        return;

    }


    let csv = "";

    csv +=
        "Product,Category,Quantity,Manufacturing Date,Expiry Date,Status\n";


    const today = new Date();


    monthData.products.forEach(product => {

        const expiry = new Date(product.expiryDate);

        const diff = Math.ceil(
            (expiry - today) /
            (1000 * 60 * 60 * 24)
        );


        let status;


        if (diff < 0) {

            status = "Expired";

        }
        else if (diff <= 7) {

            status = "Expiring Soon";

        }
        else {

            status = "Fresh";

        }


        csv +=
            `"${product.productName}",` +
            `"${product.category}",` +
            `"${product.quantity}",` +
            `"${product.manufacturingDate}",` +
            `"${product.expiryDate}",` +
            `"${status}"\n`;

    });


    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        `${selectedMonth}-Food-Expiry-Report.csv`;


    link.click();


    URL.revokeObjectURL(url);

});

