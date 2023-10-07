// fill select option
const type = document.getElementById("type");
const result = document.getElementById("result");
const url = "http://localhost:3000/data";
const xhr = new XMLHttpRequest();

function fetchData() {
    xhr.onerror = function () {
        alert("error")
    }

    xhr.onloadstart = function () {
        result.innerHTML = "Start";
    }

    xhr.onloadend = function () {
        result.innerHTML = "";
        const data = JSON.parse(this.response);
        for (let i = 0; i < data.length; i++) {
            const node = document.createElement("div");
            node.innerHTML = `
                <div class="card mb-3 text-bg-white" style="width: 18rem;">
                    <img src="${data[i].img}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].name}</h5>
                        <h5 class="card-text">${data[i].price}</h5>
                        <a href="javascript:void(0)" class="btn btn-success" onclick="viewData(${data[i].id})"><i class="fa-solid fa-eye"></i></a>
                        <a href="#" class="btn btn-primary" onclick="editData(${data[i].id})"><i class="fa-solid fa-pencil"></i></a>
                        <a href="#" class="btn btn-danger" onclick="deleteData(${data[i].id})"><i class="fa-solid fa-trash-can"></i></a>
                    </div>
                </div>
            `
            result.appendChild(node);
        }
    }

    xhr.onprogress = function () {
        result.innerHTML = "Loading";
    }

    xhr.open("GET", url);
    xhr.send();
}

function postData(event) {
    event.preventDefault();
    const data = JSON.stringify({
        name: document.getElementById("name").value,
        desc: document.getElementById("desc").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
    });

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        console.log(this.responseText);
        fetchData(); // Load data again after adding new item
    };

    xhr.send(data);
}

function deleteData(id) {
    xhr.open("DELETE", url + `/${id}`);
    xhr.onload = function () {
        fetchData(); // Load data again after deleting item
    };
    xhr.send();
}

function editData(id) {
    const editData = confirm("Are you sure you want to edit this item?");
    if (editData) {
        // Membuat objek XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.onerror = function () {
            alert("Error fetching item data");
        }
        xhr.onload = function () {
            if (xhr.status === 200) {
                const itemData = JSON.parse(xhr.responseText);
                // Memanggil function untuk mengisi modal edit
                populateEditModal(itemData, id);
            } else {
                alert("Failed to fetch item data");
            }
        }
        xhr.open("GET", url + `/${id}`);
        xhr.send();
    }
}

// Mengisi modal edit dengan data yang sesuai
function populateEditModal(itemData, id) {
    document.getElementById("editName").value = itemData.name;
    document.getElementById("editDesc").value = itemData.desc;
    document.getElementById("editPrice").value = itemData.price;
    document.getElementById("editImg").value = itemData.img;

    // Memasukkan ID ke dalam atribut data pada tombol "Simpan"
    document.getElementById('btn-save').dataset.id = id;

    // Menampilkan modal edit
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

// Event handler untuk tombol "Simpan" dalam modal edit
document.getElementById('btn-save').onclick = function() {
    const id = this.dataset.id;
    updateData(id);
};

function updateData(id) {
    // Mengambil nilai-nilai dari form edit sesuai dengan kebutuhan Anda
    const editedName = document.getElementById("editName").value;
    const editedDesc = document.getElementById("editDesc").value;
    const editedPrice = document.getElementById("editPrice").value;
    const editedImg = document.getElementById("editImg").value;

    // Membuat objek untuk data yang akan dikirim dalam permintaan PUT
    const data = {
        name: editedName,
        desc: editedDesc,
        price: editedPrice,
        img: editedImg,
    };

    // Mengonversi objek data ke format JSON
    const jsonData = JSON.stringify(data);

    // Membuat objek XMLHttpRequest untuk melakukan permintaan PUT
    const xhr = new XMLHttpRequest();
    xhr.onerror = function () {
        alert("Error updating item data");
    }
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Item updated successfully");
        } else {
            alert("Failed to update item");
        }
    }
    xhr.open("PUT", url + `/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(jsonData); // Mengirim data JSON, bukan objek data langsung
}



function viewData(id) {
    console.log("coba");
    const xhr = new XMLHttpRequest();
    xhr.onerror = function () {
        console.error("Kesalahan mengambil detail produk");
    }
    xhr.onload = function () {
        if (xhr.status === 200) {
            const detailProduk = JSON.parse(xhr.responseText);
            console.log(detailProduk); 
            populateProductDetailsModal(detailProduk);
        } else {
            console.error("Gagal mengambil detail produk");
        }
    }
    xhr.open("GET", url + `/${id}`);
    xhr.send();
}

function populateProductDetailsModal(productDetails) {
    console.log(productDetails, "test");
    document.getElementById("productDetailsImage").src = productDetails.img;
    document.getElementById("productDetailsName").textContent = "" + productDetails.name;
    document.getElementById("productDetailsPrice").textContent = "Rp." + productDetails.price;
    document.getElementById("productDetailsDescription").textContent = "" + productDetails.desc;
    const modalDetailProduk = new bootstrap.Modal(document.getElementById('productDetailsModal'));
           console.log(modalDetailProduk);
            modalDetailProduk.show();
}



