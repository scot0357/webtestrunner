$(document).ready(function() {

    $('#update').click(get_data);

    function get_data() {
        var data = {
            'path': $('#path').val(),
            'module': $('#module').val()
        };

        $.getJSON('/api', data, function(data) {
            update_page(data);
        })
        .done(function() {
            setTimeout(get_data, 1000);
        });

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

        if ($('#' + test_case.test_name).length == 0) {
            create_test_td(test_case);
        }

        var test_td = $('#' + test_case.test_name);
        set_td_class(test_case, test_td);
        fill_test_text(test_case, test_td);
    }

    function set_td_class(test, td) {
        td.removeClass("alert-success alert-info alert-warning alert-danger");
        if (test.failure) {
            td.addClass("alert-danger");
        } else if (test.error) {
            td.addClass("alert-warning");
        } else {
            td.addClass("alert-success");
        }
    }

    function fill_test_text(test, td) {
        td.find('.test-info').text(test.test_name + ' - ' + test.test_time);
        td.find('.stdout-pre').text(test.stdout);
        td.find('.error-pre').text(test.error_info);
        td.find('.failure-pre').text(test.failure_info);
    }

    function create_test_td(test) {
        var tbody = $('tbody');
        var tr = $('<tr>');
        var td = $('<td>', {colspan: 999, id: test.test_name,
                            class: 'alert'});
        var test_stctr = $('<div>');
        var test_status = $('<div>', {class: 'test-info pull-left'});
        var test_controls = $('<div>', {class: 'test-controls pull-right'});
        var clear = $('<div>', {style: 'clear: both;'});
        var stdout = $('<div>', {class: 'stdout details', style: 'display: none',
                                 text: 'System Output'});
        var stdout_pre = $('<pre>', {class: 'stdout-pre'});
        var failure = $('<div>', {class: 'failure details', style: 'display: none',
                                  text: 'Failure Details'});
        var failure_pre = $('<pre>', {class: 'failure-pre'});
        var error = $('<div>', {class: 'error details', style: 'display: none',
                                text: 'Error Details'});
        var error_pre = $('<pre>', {class: 'error-pre'});

        var toggle_stdout = $('<a>', {text: 'Output', class: 'btn btn-default spacer',
                                      role: 'button'});
        toggle_stdout.click(function() {
            toggle_stdout.toggleClass('active');
            stdout.toggle(200);
        });

        var toggle_failure = $('<a>', {text: 'Failure', class: 'btn btn-danger spacer',
                                       role: 'button'});
        toggle_failure.click(function() {
            toggle_failure.toggleClass('active');
            failure.toggle(200);
        });

        var toggle_error = $('<a>', {text: 'Error', class: 'btn btn-warning spacer',
                                     role: 'button'});
        toggle_error.click(function() {
            toggle_error.toggleClass('active');
            error.toggle(200);
        });

        test_controls.append(toggle_stdout);
        test_controls.append(toggle_failure);
        test_controls.append(toggle_error);

        test_stctr.append(test_status);
        test_stctr.append(test_controls);
        td.append(test_stctr);
        td.append(clear);
        td.append(stdout);
        stdout.append(stdout_pre);
        td.append(failure);
        failure.append(failure_pre);
        td.append(error);
        error.append(error_pre);
        tr.append(td);
        tbody.append(tr);
    }
});
