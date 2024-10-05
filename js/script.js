$(document).ready(function() {
    // Fungsi untuk mengambil semua data
    function fetchWebData() {
        showLoading();
        $.ajax({
            url: 'https://127.0.0.1:3000/web-data',
            type: 'GET',
            success: function(data) {
                $('#webDataList').empty();
                data.forEach(function(item) {
                    $('#webDataList').append(`
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.value}</td>
                            <td>${item.url}</td>
                            <td>${item.domain}</td>
                            <td>
                                <button class="btn btn-sm btn-info edit" data-id="${item.id}">Edit</button>
                                <button class="btn btn-sm btn-danger delete" data-id="${item.id}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
                hideLoading();
            },
            error: function() {
                hideLoading();
                swal('Error', 'Failed to fetch data', 'error');
            }
        });
    }

    // Inisialisasi data
    fetchWebData();

    // Fungsi untuk menambah atau mengedit data
    $('#webDataForm').submit(function(e) {
        e.preventDefault();
        showLoading();
        const id = $('#webDataId').val();
        const name = $('#name').val();
        const value = $('#value').val();
        const url = $('#url').val();
        const domain = $('#domain').val();

        const data = {
            name: name,
            value: value,
            url: url,
            domain: domain
        };

        const requestType = id ? 'PUT' : 'POST';
        const urlEndpoint = id ? `https://127.0.0.1:3000/web-data/${id}` : 'https://127.0.0.1:3000/web-data';

        $.ajax({
            url: urlEndpoint,
            type: requestType,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                swal('Success', response.message, 'success');
                resetForm();
                fetchWebData();
                hideLoading();
            },
            error: function(error) {
                hideLoading();
                swal('Error', error.responseJSON.error, 'error');
            }
        });
    });

    // Fungsi untuk menghapus data
    $('#webDataList').on('click', '.delete', function() {
        const id = $(this).data('id');
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this item!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                showLoading();
                $.ajax({
                    url: `https://127.0.0.1:3000/web-data/${id}`,
                    type: 'DELETE',
                    success: function(response) {
                        swal('Success', response.message, 'success');
                        fetchWebData();
                        hideLoading();
                    },
                    error: function() {
                        hideLoading();
                        swal('Error', 'Failed to delete data', 'error');
                    }
                });
            }
        });
    });

    // Fungsi untuk mengedit data
    $('#webDataList').on('click', '.edit', function() {
        const id = $(this).data('id');
        showLoading();
        $.ajax({
            url: `https://127.0.0.1:3000/web-data/${id}`,
            type: 'GET',
            success: function(data) {
                $('#webDataId').val(data[0].id);
                $('#name').val(data[0].name);
                $('#value').val(data[0].value);
                $('#url').val(data[0].url);
                $('#domain').val(data[0].domain);
                hideLoading();
            },
            error: function() {
                hideLoading();
                swal('Error', 'Failed to fetch data for editing', 'error');
            }
        });
    });

    // Fungsi untuk mereset form
    function resetForm() {
        $('#webDataId').val('');
        $('#name').val('');
        $('#value').val('');
        $('#url').val('');
        $('#domain').val('');
    }

    $('#resetForm').click(function() {
        resetForm();
    });

    // Fungsi untuk menampilkan loading spinner
    function showLoading() {
        $('#loading').css('display', 'flex');
    }

    // Fungsi untuk menyembunyikan loading spinner
    function hideLoading() {
        $('#loading').css('display', 'none');
    }
});