const input = document.getElementById("itemInput");
const priceInput = document.getElementById("priceInput");
const categoryInput = document.getElementById("categoryInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("groceryList");
const clearBtn = document.getElementById("clearBtn");
const shareBtn = document.getElementById("shareBtn");
const totalCostText = document.getElementById("totalCost");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const themeToggle = document.getElementById("themeToggle");

let items = JSON.parse(localStorage.getItem("groceryListPro") || "[]");

// Enable drag-to-reorder using SortableJS
Sortable.create(list, {
    animation: 150,
    onEnd: () => save()
});

render();

// Add item
addBtn.onclick = () => {
    if (!input.value.trim()) return;

    items.push({
        text: input.value.trim(),
        price: parseFloat(priceInput.value) || 0,
        category: categoryInput.value,
        checked: false
    });

    input.value = "";
    priceInput.value = "";

    save();
    render();
};

// Render list
function render() {
    list.innerHTML = "";

    items.forEach((item, index) => {
        const li = document.createElement("li");
        if (item.checked) li.classList.add("checked");

        const box = document.createElement("div");
        box.className = item.checked ? "checkbox checked" : "checkbox";
        box.onclick = () => {
            item.checked = !item.checked;
            save();
            render();
        };

        const text = document.createElement("span");
        text.innerText = item.text;

        const cat = document.createElement("span");
        cat.className = "category";
        cat.innerText = `(${item.category})`;

        const price = document.createElement("span");
        price.className = "price";
        price.innerText = `$${item.price.toFixed(2)}`;

        const del = document.createElement("button");
        del.className = "delete";
        del.innerText = "X";
        del.onclick = () => {
            items.splice(index, 1);
            save();
            render();
        };

        li.appendChild(box);
        li.appendChild(text);
        li.appendChild(cat);
        li.appendChild(price);
        li.appendChild(del);
        list.appendChild(li);
    });

    updateProgress();
    updateTotal();
}

// Update progress bar
function updateProgress() {
    const total = items.length;
    const done = items.filter(i => i.checked).length;

    progressBar.style.width = total ? (done / total) * 100 + "%" : "0%";
    progressText.innerText = `${done}/${total} completed`;
}

// Update total cost
function updateTotal() {
    const total = items.reduce((sum, i) => sum + i.price, 0);
    totalCostText.innerText = total.toFixed(2);
}

// Clear list
clearBtn.onclick = () => {
    if (confirm("Clear list?")) {
        items = [];
        save();
        render();
    }
};

// Share link
shareBtn.onclick = () => {
    const encoded = encodeURIComponent(JSON.stringify(items));
    const url = `${location.origin}${location.pathname}?list=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied!");
};

// Load shared list
const params = new URLSearchParams(location.search);
if (params.get("list")) {
    items = JSON.parse(decodeURIComponent(params.get("list")));
    save();
    render();
}

// Save
function save() {
    localStorage.setItem("groceryListPro", JSON.stringify(items));
}

// Theme toggle
themeToggle.onclick = () => {
    document.body.classList.toggle("light");
    themeToggle.innerText = document.body.classList.contains("light") ? "☀️" : "🌙";
    localStorage.setItem("theme", document.body.className);
};

// Load theme
document.body.className = localStorage.getItem("theme") || "";
themeToggle.innerText = document.body.classList.contains("light") ? "☀️" : "🌙";
