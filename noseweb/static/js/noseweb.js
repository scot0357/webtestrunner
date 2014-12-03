$(document).ready(function() {

    $('#update').click(get_data);

    function get_data() {
        var data = {
            'path': $('#path').val(),
            'module': $('#module').val()
        };

        $.get('/api', data, function(data) {
            update_page(data);
        })

        return false;
    }

    function update_page(data) {
        $('#tests').text(data.status.tests);
        $('#failures').text(data.status.failures);
        $('#errors').text(data.status.errors);
        $('#skipped').text(data.status.skipped);

        $.each(data.test_cases, function(i, o) {
            create_or_update_test(o);
        });
    }

    function create_or_update_test(test_case) {
        var tbody = $('tbody');

        if ($('#' + test_case.test_name).length == 0) {
            var tr = $('<tr>');
            var td = $('<td>', {colspan: 999, id: test_case.test_name,
                                class: 'alert alert-success'});
            var test_status = $('<div>', {class: 'test-info pull-left'});
            var test_controls = $('<div>', {class: 'test-controls pull-right'});
            var clear = $('<div>', {style: 'clear: both;'});
            var stdout = $('<div>', {class: 'stdout', style: 'display: none'});
            var stdout_pre = $('<pre>', {class: 'stdout-pre'});
            var failure = $('<div>', {class: 'failure', style: 'display: none'});
            var failure_pre = $('<pre>', {class: 'failure-pre'});
            var error = $('<div>', {class: 'error', style: 'display: none'});
            var error_pre = $('<pre>', {class: 'error-pre'});

            var toggle_stdout = $('<a>', {text: 'Output', class: 'spaced'});
            toggle_stdout.click(function() {stdout.toggle();});

            var toggle_failure = $('<a>', {text: 'Failure', class: 'spaced'});
            toggle_failure.click(function() {failure.toggle();});

            var toggle_error = $('<a>', {text: 'Error', class: 'spaced'});
            toggle_error.click(function() {error.toggle();});

            test_controls.append(toggle_stdout);
            test_controls.append(toggle_failure);
            test_controls.append(toggle_error);

            td.append(test_status);
            td.append(test_controls);
            td.append(clear);
            td.append(stdout);
            stdout.append(stdout_pre);
            td.append(error);
            error.append(error_pre);
            tr.append(td);
            tbody.append(tr);
        }

        var test_td = $('#' + test_case.test_name);
        test_td.find('.test-info').text(test_case.test_name + ' - ' +
                                        test_case.test_time);
        test_td.find('.stdout-pre').text(test_case.stdout);
        test_td.find('.error-pre').text(test_case.error_info);
        test_td.find('.failure-pre').text(test_case.failure_info);
    }
});
