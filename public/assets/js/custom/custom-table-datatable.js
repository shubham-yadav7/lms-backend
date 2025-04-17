/*
---------------------------------------
    : Custom - Table Datatable js :
---------------------------------------
*/
"use strict";
$(document).ready(function() {
    /* -- Table - Datatable -- */
    $('#datatable').DataTable({
        responsive: true,
        ordering: false
    });
    $('#default-datatable').DataTable( {
        "order": [[ 3, "desc" ]],
        responsive: true
    } );    
    var table = $('#datatable-buttons').DataTable({
        lengthChange: false,
        responsive: false,
        ordering: false,
        buttons: ['copy', 'csv', 'excel',]
    });
    // table.buttons().container().appendTo('#datatable-buttons_wrapper .col-md-6:eq(0)');
    var table2 = $('#datatable-buttons2').DataTable({
        lengthChange: false,
        responsive: false,
        ordering: false,
        buttons: ['copy', 'csv', 'excel',]
    });
    // table2.buttons().container().appendTo('#datatable-buttons_wrapper .col-md-6:eq(0)');
});