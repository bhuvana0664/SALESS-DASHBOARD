// =========================================
// SMARTMART ANALYTICS
// Complete script.js - Step 25
// =========================================


// =========================================
// GLOBAL VARIABLES
// =========================================

let salesData = [];

let salesChart = null;
let categoryChart = null;
let salesDoughnutChart = null;
let monthlyRevenueChart = null;
let salesChannelChart = null;
let productPerformanceChart = null;
let inventoryAnalyticsChart = null;

let customerSpendingChart = null;
let customerOrdersChart = null;
let customerQuantityChart = null;


// =========================================
// PAGINATION VARIABLES
// =========================================

let currentPage = 1;
const rowsPerPage = 5;
let currentProductData = [];


// =========================================
// INVENTORY DATA
// =========================================

const inventoryData = [
    {
        product: "Rice",
        category: "Grocery",
        stock: 5
    },
    {
        product: "Milk",
        category: "Dairy",
        stock: 12
    },
    {
        product: "Cooking Oil",
        category: "Grocery",
        stock: 4
    },
    {
        product: "Biscuit",
        category: "Snacks",
        stock: 20
    },
    {
        product: "Soft Drink",
        category: "Beverages",
        stock: 15
    },
    {
        product: "Wheat Flour",
        category: "Grocery",
        stock: 8
    },
    {
        product: "Curd",
        category: "Dairy",
        stock: 3
    },
    {
        product: "Chips",
        category: "Snacks",
        stock: 25
    },
    {
        product: "Orange Juice",
        category: "Beverages",
        stock: 7
    },
    {
        product: "Sugar",
        category: "Grocery",
        stock: 6
    }
];


// =========================================
// LOAD SALES DATA
// =========================================

fetch("data/sales.json")
    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load sales.json");
        }

        return response.json();

    })
    .then(data => {

        salesData = data;

        initializeDashboard(salesData);

    })
    .catch(error => {

        console.error("Error loading data:", error);

        alert(
            "Unable to load sales data. Please run the project using Live Server."
        );

    });


// =========================================
// INITIALIZE DASHBOARD
// =========================================

function initializeDashboard(data) {

    calculateSummary(data);

    renderSalesChart(data);

    renderCategoryChart(data);

    renderSalesDistribution(data);

    renderMonthlyRevenue(data);

    renderSalesChannel(data);

    renderProductPerformance(data);

    renderInventoryAnalytics(data);

    renderCustomerAnalytics(data);

    renderProductTable(data);

    renderInventoryTable();

    renderLowStockAlert();

    renderTopProducts(data);

    renderPerformanceMetrics(data);

    renderCustomerSummary(data);

    renderReports(data);

    setupSearchAndFilter();

    setupPagination();

    setupDownloadReport();

    setupProductModal();

}


// =========================================
// SUMMARY CALCULATION
// =========================================

function calculateSummary(data) {

    const totalRevenue = data.reduce(
        (total, sale) =>
            total + sale.quantity * sale.price,
        0
    );

    const totalProducts = data.reduce(
        (total, sale) =>
            total + sale.quantity,
        0
    );

    const totalSales = data.length;

    const totalCustomers =
        new Set(
            data.map(sale => sale.customer)
        ).size;


    document.getElementById("totalRevenue").textContent =
        `₹${totalRevenue.toLocaleString("en-IN")}`;

    document.getElementById("totalProducts").textContent =
        totalProducts;

    document.getElementById("totalSales").textContent =
        totalSales;

    document.getElementById("totalCustomers").textContent =
        totalCustomers;
}


// =========================================
// DAILY SALES CHART
// =========================================

function renderSalesChart(data) {

    const dailyRevenue = {};

    data.forEach(sale => {

        const revenue =
            sale.quantity * sale.price;

        if (!dailyRevenue[sale.date]) {
            dailyRevenue[sale.date] = 0;
        }

        dailyRevenue[sale.date] += revenue;

    });


    const dates =
        Object.keys(dailyRevenue).sort();

    const revenues =
        dates.map(date => dailyRevenue[date]);


    const ctx =
        document.getElementById("salesChart");

    if (!ctx) return;


    if (salesChart) {
        salesChart.destroy();
    }


    salesChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: dates,

            datasets: [

                {
                    label: "Daily Revenue",

                    data: revenues,

                    borderWidth: 3,

                    tension: 0.4,

                    fill: false,

                    pointRadius: 5,

                    pointHoverRadius: 7
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: true
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return "₹" +
                                value.toLocaleString("en-IN");

                        }

                    }

                }

            }

        }

    });

}


// =========================================
// CATEGORY SALES CHART
// =========================================

function renderCategoryChart(data) {

    const categoryRevenue = {};

    data.forEach(sale => {

        const revenue =
            sale.quantity * sale.price;

        if (!categoryRevenue[sale.category]) {
            categoryRevenue[sale.category] = 0;
        }

        categoryRevenue[sale.category] += revenue;

    });


    const categories =
        Object.keys(categoryRevenue);

    const revenues =
        categories.map(
            category =>
                categoryRevenue[category]
        );


    const ctx =
        document.getElementById("categoryChart");

    if (!ctx) return;


    if (categoryChart) {
        categoryChart.destroy();
    }


    categoryChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: categories,

            datasets: [

                {
                    label: "Revenue",

                    data: revenues,

                    borderWidth: 1
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function(value) {

                            return "₹" +
                                value.toLocaleString("en-IN");

                        }

                    }

                }

            }

        }

    });

}


// =========================================
// SALES DISTRIBUTION DOUGHNUT
// =========================================

function renderSalesDistribution(data) {

    const categoryRevenue = {};

    data.forEach(sale => {

        const revenue =
            sale.quantity * sale.price;

        if (!categoryRevenue[sale.category]) {
            categoryRevenue[sale.category] = 0;
        }

        categoryRevenue[sale.category] += revenue;

    });


    const categories =
        Object.keys(categoryRevenue);

    const revenues =
        categories.map(
            category =>
                categoryRevenue[category]
        );


    const ctx =
        document.getElementById(
            "salesDoughnutChart"
        );

    if (!ctx) return;


    if (salesDoughnutChart) {
        salesDoughnutChart.destroy();
    }


    salesDoughnutChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: categories,

            datasets: [

                {
                    data: revenues,

                    borderWidth: 2
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// =========================================
// MONTHLY REVENUE
// =========================================

function renderMonthlyRevenue(data) {

    const monthlyRevenue = {};

    data.forEach(sale => {

        const month =
            sale.date.substring(0, 7);

        const revenue =
            sale.quantity * sale.price;

        if (!monthlyRevenue[month]) {
            monthlyRevenue[month] = 0;
        }

        monthlyRevenue[month] += revenue;

    });


    const months =
        Object.keys(monthlyRevenue).sort();

    const revenues =
        months.map(
            month =>
                monthlyRevenue[month]
        );


    const ctx =
        document.getElementById(
            "monthlyRevenueChart"
        );

    if (!ctx) return;


    if (monthlyRevenueChart) {
        monthlyRevenueChart.destroy();
    }


    monthlyRevenueChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: months,

            datasets: [

                {
                    label: "Monthly Revenue",

                    data: revenues,

                    borderWidth: 1
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}


// =========================================
// SALES CHANNEL ANALYSIS
// =========================================

function renderSalesChannel(data) {

    const channels = {

        "In-Store": 0,

        "Online": 0

    };


    data.forEach((sale, index) => {

        const revenue =
            sale.quantity * sale.price;

        if (index % 2 === 0) {

            channels["In-Store"] += revenue;

        } else {

            channels["Online"] += revenue;

        }

    });


    const ctx =
        document.getElementById(
            "salesChannelChart"
        );

    if (!ctx) return;


    if (salesChannelChart) {
        salesChannelChart.destroy();
    }


    salesChannelChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: Object.keys(channels),

            datasets: [

                {
                    data: Object.values(channels),

                    borderWidth: 2
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// =========================================
// PRODUCT PERFORMANCE
// =========================================

function renderProductPerformance(data) {

    const productQuantity = {};

    data.forEach(sale => {

        if (!productQuantity[sale.product]) {
            productQuantity[sale.product] = 0;
        }

        productQuantity[sale.product] +=
            sale.quantity;

    });


    const sortedProducts =
        Object.entries(productQuantity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);


    const labels =
        sortedProducts.map(item => item[0]);

    const quantities =
        sortedProducts.map(item => item[1]);


    const ctx =
        document.getElementById(
            "productPerformanceChart"
        );

    if (!ctx) return;


    if (productPerformanceChart) {
        productPerformanceChart.destroy();
    }


    productPerformanceChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {
                    label: "Quantity Sold",

                    data: quantities,

                    borderWidth: 1
                }

            ]

        },

        options: {

            indexAxis: "y",

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                x: {

                    beginAtZero: true

                }

            }

        }

    });

}


// =========================================
// INVENTORY ANALYTICS
// =========================================

function renderInventoryAnalytics() {

    let lowStock = 0;
    let mediumStock = 0;
    let highStock = 0;


    inventoryData.forEach(item => {

        if (item.stock <= 5) {

            lowStock++;

        } else if (item.stock <= 10) {

            mediumStock++;

        } else {

            highStock++;

        }

    });


    const ctx =
        document.getElementById(
            "inventoryAnalyticsChart"
        );

    if (!ctx) return;


    if (inventoryAnalyticsChart) {
        inventoryAnalyticsChart.destroy();
    }


    inventoryAnalyticsChart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Low Stock",
                "Medium Stock",
                "High Stock"
            ],

            datasets: [

                {
                    data: [
                        lowStock,
                        mediumStock,
                        highStock
                    ],

                    borderWidth: 2
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}


// =========================================
// CUSTOMER ANALYTICS
// =========================================

function renderCustomerAnalytics(data) {

    const customerData = {};


    data.forEach(sale => {

        const revenue =
            sale.quantity * sale.price;

        if (!customerData[sale.customer]) {

            customerData[sale.customer] = {

                spending: 0,

                orders: 0,

                quantity: 0

            };

        }

        customerData[sale.customer].spending +=
            revenue;

        customerData[sale.customer].orders +=
            1;

        customerData[sale.customer].quantity +=
            sale.quantity;

    });


    const customers =
        Object.keys(customerData);


    const spending =
        customers.map(
            customer =>
                customerData[customer].spending
        );


    const orders =
        customers.map(
            customer =>
                customerData[customer].orders
        );


    const quantity =
        customers.map(
            customer =>
                customerData[customer].quantity
        );


    const spendingCanvas =
        document.getElementById(
            "customerSpendingChart"
        );

    if (spendingCanvas) {

        if (customerSpendingChart) {
            customerSpendingChart.destroy();
        }

        customerSpendingChart = new Chart(
            spendingCanvas,
            {

                type: "bar",

                data: {

                    labels: customers,

                    datasets: [

                        {
                            label: "Total Spending",

                            data: spending,

                            borderWidth: 1
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

    }


    const ordersCanvas =
        document.getElementById(
            "customerOrdersChart"
        );

    if (ordersCanvas) {

        if (customerOrdersChart) {
            customerOrdersChart.destroy();
        }

        customerOrdersChart = new Chart(
            ordersCanvas,
            {

                type: "bar",

                data: {

                    labels: customers,

                    datasets: [

                        {
                            label: "Total Orders",

                            data: orders,

                            borderWidth: 1
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

    }


    const quantityCanvas =
        document.getElementById(
            "customerQuantityChart"
        );

    if (quantityCanvas) {

        if (customerQuantityChart) {
            customerQuantityChart.destroy();
        }

        customerQuantityChart = new Chart(
            quantityCanvas,
            {

                type: "bar",

                data: {

                    labels: customers,

                    datasets: [

                        {
                            label: "Total Quantity",

                            data: quantity,

                            borderWidth: 1
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false

                }

            }
        );

    }

}


// =========================================
// PRODUCT TABLE
// =========================================

function renderProductTable(data) {

    currentProductData = data;

    const tableBody =
        document.getElementById(
            "productTableBody"
        );

    if (!tableBody) return;


    tableBody.innerHTML = "";


    const totalPages =
        Math.ceil(
            data.length / rowsPerPage
        );


    if (
        currentPage > totalPages &&
        totalPages > 0
    ) {

        currentPage = totalPages;

    }


    if (data.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No products found
                </td>

            </tr>

        `;

        updatePagination(0);

        return;
    }


    const startIndex =
        (currentPage - 1) *
        rowsPerPage;


    const endIndex =
        startIndex + rowsPerPage;


    const pageData =
        data.slice(
            startIndex,
            endIndex
        );


    pageData.forEach(sale => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${sale.product}</td>

            <td>${sale.category}</td>

            <td>${sale.quantity}</td>

            <td>₹${sale.price}</td>

            <td>${sale.customer}</td>

            <td>${sale.date}</td>

        `;


        row.style.cursor = "pointer";


        row.addEventListener(
            "click",
            function() {

                openProductModal(sale);

            }
        );


        tableBody.appendChild(row);

    });


    updatePagination(data.length);

}


// =========================================
// ADVANCED SEARCH + FILTER + SORT
// =========================================

function setupSearchAndFilter() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const dateFilter =
        document.getElementById(
            "dateFilter"
        );

    const sortFilter =
        document.getElementById(
            "sortFilter"
        );


    function applyFilters() {

        let filteredData =
            [...salesData];


        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        const categoryValue =
            categoryFilter.value;


        const dateValue =
            dateFilter.value;


        const sortValue =
            sortFilter.value;


        // Search
        if (searchValue) {

            filteredData =
                filteredData.filter(
                    sale =>

                        sale.product
                            .toLowerCase()
                            .includes(searchValue)

                        ||

                        sale.customer
                            .toLowerCase()
                            .includes(searchValue)
                );

        }


        // Category
        if (categoryValue !== "All") {

            filteredData =
                filteredData.filter(
                    sale =>
                        sale.category ===
                        categoryValue
                );

        }


        // Date
        if (dateValue) {

            filteredData =
                filteredData.filter(
                    sale =>
                        sale.date ===
                        dateValue
                );

        }


        // Sorting
        switch (sortValue) {

            case "nameAsc":

                filteredData.sort(
                    (a, b) =>
                        a.product.localeCompare(
                            b.product
                        )
                );

                break;


            case "nameDesc":

                filteredData.sort(
                    (a, b) =>
                        b.product.localeCompare(
                            a.product
                        )
                );

                break;


            case "quantityHigh":

                filteredData.sort(
                    (a, b) =>
                        b.quantity -
                        a.quantity
                );

                break;


            case "quantityLow":

                filteredData.sort(
                    (a, b) =>
                        a.quantity -
                        b.quantity
                );

                break;


            case "priceHigh":

                filteredData.sort(
                    (a, b) =>
                        b.price -
                        a.price
                );

                break;


            case "priceLow":

                filteredData.sort(
                    (a, b) =>
                        a.price -
                        b.price
                );

                break;


            case "dateNew":

                filteredData.sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                );

                break;


            case "dateOld":

                filteredData.sort(
                    (a, b) =>
                        new Date(a.date) -
                        new Date(b.date)
                );

                break;

        }


        // Reset to first page
        currentPage = 1;


        renderProductTable(
            filteredData
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            applyFilters
        );

    }


    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            applyFilters
        );

    }

}


// =========================================
// PAGINATION
// =========================================

function setupPagination() {

    const prevButton =
        document.getElementById(
            "prevPageBtn"
        );

    const nextButton =
        document.getElementById(
            "nextPageBtn"
        );


    if (!prevButton || !nextButton) {
        return;
    }


    prevButton.addEventListener(
        "click",
        function() {

            if (currentPage > 1) {

                currentPage--;

                renderProductTable(
                    currentProductData
                );

            }

        }
    );


    nextButton.addEventListener(
        "click",
        function() {

            const totalPages =
                Math.ceil(
                    currentProductData.length /
                    rowsPerPage
                );


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderProductTable(
                    currentProductData
                );

            }

        }
    );

}


// =========================================
// UPDATE PAGINATION UI
// =========================================

function updatePagination(totalItems) {

    const paginationInfo =
        document.getElementById(
            "paginationInfo"
        );

    const pageNumber =
        document.getElementById(
            "pageNumber"
        );

    const prevButton =
        document.getElementById(
            "prevPageBtn"
        );

    const nextButton =
        document.getElementById(
            "nextPageBtn"
        );


    if (
        !paginationInfo ||
        !pageNumber ||
        !prevButton ||
        !nextButton
    ) {
        return;
    }


    if (totalItems === 0) {

        paginationInfo.textContent =
            "Showing 0 of 0";

        pageNumber.textContent =
            "Page 0";

        prevButton.disabled = true;

        nextButton.disabled = true;

        return;
    }


    const totalPages =
        Math.ceil(
            totalItems / rowsPerPage
        );


    const start =
        (currentPage - 1) *
        rowsPerPage + 1;


    const end =
        Math.min(
            currentPage * rowsPerPage,
            totalItems
        );


    paginationInfo.textContent =
        `Showing ${start}–${end} of ${totalItems}`;


    pageNumber.textContent =
        `Page ${currentPage} of ${totalPages}`;


    prevButton.disabled =
        currentPage === 1;


    nextButton.disabled =
        currentPage === totalPages;

}


// =========================================
// INVENTORY TABLE
// =========================================

function renderInventoryTable() {

    const tableBody =
        document.getElementById(
            "inventoryTableBody"
        );

    if (!tableBody) return;


    tableBody.innerHTML = "";


    inventoryData.forEach(item => {

        const row =
            document.createElement("tr");


        let status = "";


        if (item.stock <= 5) {

            status =
                `<span style="
                    color:#d4380d;
                    font-weight:700;
                ">
                    🔴 Low Stock
                </span>`;

        } else if (item.stock <= 10) {

            status =
                `<span style="
                    color:#d48806;
                    font-weight:700;
                ">
                    🟡 Medium
                </span>`;

        } else {

            status =
                `<span style="
                    color:#389e0d;
                    font-weight:700;
                ">
                    🟢 Good
                </span>`;

        }


        row.innerHTML = `

            <td>${item.product}</td>

            <td>${item.category}</td>

            <td>${item.stock}</td>

            <td>${status}</td>

        `;


        tableBody.appendChild(row);

    });

}


// =========================================
// LOW STOCK ALERT
// =========================================

function renderLowStockAlert() {

    const alertBox =
        document.getElementById(
            "lowStockAlert"
        );

    if (!alertBox) return;


    const lowStockProducts =
        inventoryData.filter(
            item =>
                item.stock <= 5
        );


    if (lowStockProducts.length === 0) {

        alertBox.innerHTML =
            "✅ All products have sufficient stock.";

        return;
    }


    const productNames =
        lowStockProducts
            .map(item => item.product)
            .join(", ");


    alertBox.innerHTML = `

        ⚠️ Low Stock Alert:
        ${productNames}

    `;

}


// =========================================
// TOP SELLING PRODUCTS
// =========================================

function renderTopProducts(data) {

    const tableBody =
        document.getElementById(
            "topProductsBody"
        );

    if (!tableBody) return;


    const productData = {};


    data.forEach(sale => {

        if (!productData[sale.product]) {

            productData[sale.product] = {

                category: sale.category,

                quantity: 0

            };

        }

        productData[sale.product].quantity +=
            sale.quantity;

    });


    const sortedProducts =
        Object.entries(productData)
            .sort(
                (a, b) =>
                    b[1].quantity -
                    a[1].quantity
            )
            .slice(0, 5);


    tableBody.innerHTML = "";


    sortedProducts.forEach(
        (item, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${index + 1}</td>

                <td>${item[0]}</td>

                <td>${item[1].category}</td>

                <td>${item[1].quantity}</td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// =========================================
// PERFORMANCE METRICS
// =========================================

function renderPerformanceMetrics(data) {

    const totalRevenue =
        data.reduce(
            (total, sale) =>
                total +
                sale.quantity *
                sale.price,
            0
        );


    const averageSale =
        data.length > 0
            ? totalRevenue / data.length
            : 0;


    const productQuantity = {};


    data.forEach(sale => {

        if (!productQuantity[sale.product]) {

            productQuantity[sale.product] = 0;

        }

        productQuantity[sale.product] +=
            sale.quantity;

    });


    let bestProduct = "-";


    if (
        Object.keys(productQuantity).length
    ) {

        bestProduct =
            Object.entries(productQuantity)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                )[0][0];

    }


    const lowStockCount =
        inventoryData.filter(
            item =>
                item.stock <= 5
        ).length;


    const averageElement =
        document.getElementById(
            "averageSale"
        );

    const bestElement =
        document.getElementById(
            "bestProduct"
        );

    const lowStockElement =
        document.getElementById(
            "lowStockCount"
        );


    if (averageElement) {

        averageElement.textContent =
            `₹${Math.round(
                averageSale
            ).toLocaleString("en-IN")}`;

    }


    if (bestElement) {

        bestElement.textContent =
            bestProduct;

    }


    if (lowStockElement) {

        lowStockElement.textContent =
            lowStockCount;

    }

}


// =========================================
// CUSTOMER SUMMARY
// =========================================

function renderCustomerSummary(data) {

    const tableBody =
        document.getElementById(
            "customerTableBody"
        );

    if (!tableBody) return;


    const customers = {};


    data.forEach(sale => {

        if (!customers[sale.customer]) {

            customers[sale.customer] = {

                orders: 0,

                quantity: 0,

                spent: 0

            };

        }


        customers[sale.customer].orders++;

        customers[sale.customer].quantity +=
            sale.quantity;

        customers[sale.customer].spent +=
            sale.quantity *
            sale.price;

    });


    tableBody.innerHTML = "";


    Object.entries(customers).forEach(
        ([customer, info]) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${customer}</td>

                <td>${info.orders}</td>

                <td>${info.quantity}</td>

                <td>
                    ₹${info.spent.toLocaleString("en-IN")}
                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// =========================================
// SALES REPORTS
// =========================================

function renderReports(data) {

    const tableBody =
        document.getElementById(
            "reportsTableBody"
        );

    if (!tableBody) return;


    const totalRevenue =
        data.reduce(
            (total, sale) =>
                total +
                sale.quantity *
                sale.price,
            0
        );


    const totalQuantity =
        data.reduce(
            (total, sale) =>
                total +
                sale.quantity,
            0
        );


    const totalOrders =
        data.length;


    const totalCustomers =
        new Set(
            data.map(
                sale =>
                    sale.customer
            )
        ).size;


    const averageSale =
        totalOrders > 0
            ? totalRevenue /
              totalOrders
            : 0;


    const reportData = [

        [
            "Total Revenue",
            `₹${totalRevenue.toLocaleString("en-IN")}`
        ],

        [
            "Products Sold",
            totalQuantity
        ],

        [
            "Total Sales",
            totalOrders
        ],

        [
            "Total Customers",
            totalCustomers
        ],

        [
            "Average Sale",
            `₹${Math.round(
                averageSale
            ).toLocaleString("en-IN")}`
        ]

    ];


    tableBody.innerHTML = "";


    reportData.forEach(
        ([name, value]) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${name}</td>

                <td>${value}</td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// =========================================
// PRINT REPORT
// =========================================

function setupPrintReport() {

    const button =
        document.getElementById(
            "printReportBtn"
        );

    if (!button) return;

    button.addEventListener(
        "click",
        function() {

            window.print();

        }
    );

}


// =========================================
// CSV DOWNLOAD FUNCTION
// =========================================

function downloadCSV() {

    if (!salesData.length) {

        alert("No sales data available.");

        return;

    }


    const headers = [

        "ID",

        "Product",

        "Category",

        "Quantity",

        "Price",

        "Customer",

        "Date",

        "Revenue"

    ];


    const rows =
        salesData.map(sale => [

            sale.id,

            sale.product,

            sale.category,

            sale.quantity,

            sale.price,

            sale.customer,

            sale.date,

            sale.quantity *
                sale.price

        ]);


    const csvContent = [

        headers,

        ...rows

    ]

        .map(row =>
            row.join(",")
        )

        .join("\n");


    const blob =
        new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "SmartMart-Sales-Report.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// =========================================
// PRODUCT DETAILS MODAL
// =========================================

function setupProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );

    const closeButton =
        document.getElementById(
            "closeProductModal"
        );


    if (!modal || !closeButton) {
        return;
    }


    // Close using X
    closeButton.addEventListener(
        "click",
        function() {

            closeProductModal();

        }
    );


    // Close by clicking outside
    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                closeProductModal();

            }

        }
    );


    // Close using Escape
    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape"
            ) {

                closeProductModal();

            }

        }
    );

}


// =========================================
// OPEN PRODUCT MODAL
// =========================================

function openProductModal(sale) {

    const modal =
        document.getElementById(
            "productModal"
        );

    if (!modal) return;


    document.getElementById(
        "modalProductName"
    ).textContent =
        sale.product;


    document.getElementById(
        "modalCategory"
    ).textContent =
        sale.category;


    document.getElementById(
        "modalQuantity"
    ).textContent =
        sale.quantity;


    document.getElementById(
        "modalPrice"
    ).textContent =
        `₹${sale.price.toLocaleString("en-IN")}`;


    document.getElementById(
        "modalRevenue"
    ).textContent =
        `₹${(
            sale.quantity *
            sale.price
        ).toLocaleString("en-IN")}`;


    document.getElementById(
        "modalCustomer"
    ).textContent =
        sale.customer;


    document.getElementById(
        "modalDate"
    ).textContent =
        sale.date;


    modal.style.display =
        "flex";

}


// =========================================
// CLOSE PRODUCT MODAL
// =========================================

function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );

    if (!modal) return;


    modal.style.display =
        "none";

}