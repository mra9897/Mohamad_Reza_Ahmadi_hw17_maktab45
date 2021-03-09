const employees = [];
let selectedEmployee;
let employeeOperation;


$(function () {
    // persian date picker
    let datePickerConfig = {
        format: 'YYYY/MM/DD',
        autoClose: true,
        calendar: {
            persian: {
                locale: 'en'
            }
        }
    }
    $('#startDate').persianDatepicker({
        ...datePickerConfig,
        altField: '.startDate'
    });
    $('#endDate').persianDatepicker({
        ...datePickerConfig,
        altField: '.endDate'
    });
    $('.persian-date-picker').persianDatepicker(datePickerConfig);

    // persian date converter
    persianDate.toLocale('en');
    $('.register_date').each((i,obj)=>{
        let register_date = $(obj).data('date');
        $(obj).text(georgianToJalali(register_date));
    });

    // query variables and normal variables
    const urlParams = new URLSearchParams(window.location.search);
    const uri = window.location.href.split('/');
    const resultAction = urlParams.get('d');
    const type = urlParams.get('type');
    const startDateValue = urlParams.get('startDate');
    const endDateValue = urlParams.get('endDate');
    const hasAdmin = $('#company_has_admin').data('admin');
    let formType;
    let companyId = "";

    // make alert
    if(resultAction !== null){
        if (resultAction === "done")
            toastIt("bg-success", "operation successfully complete");
        else
            toastIt("bg-danger", "failed to complete operation");
    }

    // if searched by date
    if(startDateValue !== null && endDateValue !== null){
        let searchedStart = new persianDate(parseInt(startDateValue)).format('L');
        $('#startDate').val(searchedStart);
        $('.startDate').val(startDateValue);
        let searchedEnd = new persianDate(parseInt(endDateValue)).format('L');
        $('.endDate').val(endDateValue);
        $('#endDate').val(searchedEnd);
    }

    // config update or add page
    if (type === "add") {
        formType = "create";
        $("#buttons").html('' +
            '<button class="btn btn-light" id="submit">\n' +
            '                                <i class="fa fa-check"></i>\n' +
            '                                Save\n' +
            '                            </button>' +
            '');
    }
    else {
        formType = "update";
        companyId = uri[uri.length - 1];
        $("#buttons").html('' +
            '<button id="submit" class="btn btn-light">\n' +
            '                                <i class="fa fa-edit"></i>\n' +
            '                                Update\n' +
            '                            </button>\n' +
            '                            <button id="delete" class="btn btn-danger">\n' +
            '                                <i class="fa fa-trash"></i>\n' +
            '                                Delete\n' +
            '                            </button>' +
            '');
    }

    // set listeners
    $('#edit').on('click', () => $('#name').attr("disabled", false).toggleClass("hidden-input form-control"));
    $('#submit').on('click', ()=>{
        let data = {
            name: $('#name').val(),
            province: $('#province').val(),
            city: $('#city').val(),
            register_code: $('#register_code').val(),
            register_date: jalaliToGregorian($('#register_date').val()),
            phone: $('#phone').val()
        };
        let url = `http://localhost:5002/company/${formType}/${companyId}`
        $.ajax({
            url,
            method: companyId === "" ? "POST" : "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: result => {
                if(result.result) {
                    toastIt("bg-success", "operation successfully complete");
                    if(companyId === "") $('input').val('');
                }
                else
                    toastIt("bg-danger", "failed to complete operation");
            },
            error: err => {
                console.log("err", err);
            }
        })
    });
    $('#delete').on('click', () => {
        if (confirm("are you really sure about this horrible action?\nyou can't travel in time to get it back!"))
            $.ajax({
                url: "http://localhost:5002/company/delete/" + companyId,
                type: "DELETE",
                success: result => {
                    if (result.result)
                        window.location.href = "/company/all?d=done";
                    else
                        window.location.href = "/company/all?d=failed";
                },
                error: err => {
                    console.log("ERR", err);
                }
            });
    });
    $('.id-card').on('click', function(){
        employeeOperation = 'update';
        let isAdmin = $('#is_admin');
        let id = $(this).data('id');
        let employee = employees.find(v=>v._id === id);
        if(!employee) {
            $.ajax({
                url: `http://localhost:5002/employee/single/${id}`,
                method: "GET",
                async: false,
                success: emp => {
                    employee = emp[0];
                    employees.push(emp[0]);
                },
                error: err => {
                    console.log(err);
                }
            });
        }
        selectedEmployee = employee;
        if(!hasAdmin || hasAdmin === selectedEmployee._id) adminCheck(false)
        else adminCheck(true);
        $('#first_name').val(employee.first_name);
        $('#last_name').val(employee.last_name);
        $('#national_code').val(employee.national_code);
        $('#gender').val(employee.gender);
        isAdmin.val(String(employee.is_admin));
        let birthDate = new Date(employee.birth_date.split('T')[0])
        let bd = georgianToJalali(`${birthDate.getFullYear()}-${birthDate.getMonth()}-${birthDate.getDate()}`);
        $('#birth_date').val(bd);

        $('.employee-modal').modal('show');
    });
    $('#addEmployee').on('click', ()=>{
        if(hasAdmin) adminCheck(true)
        else adminCheck(false);
        companyId = uri[uri.length - 1];
        $('.modal input').val('');
        $('.modal').modal('show');
        employeeOperation = 'add';
    });
    $('#employeeDelete').on('click', function (){
        if(confirm("are you sure about this employee?")){
            $.ajax({
                url: `http://localhost:5002/employee/delete/${selectedEmployee._id}`,
                method: "DELETE",
                success: r => {
                    alert("employee successfully deleted");
                    window.location.reload();
                },
                error: err => console.log(err)
            });
        }
    });
    $('#employeeSubmit').on('click', ()=>{
        let updatedEmployee = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            national_code: $('#national_code').val(),
            gender: $('#gender').val(),
            birth_date: jalaliToGregorian($('#birth_date').val()),
            is_admin: $('#is_admin').val(),
            companyId
        };
        let config = employeeOperation === 'add'
            ?
                {url: 'http://localhost:5002/employee/create', method: "POST"}
            :
                {url: `http://localhost:5002/employee/update/${selectedEmployee._id}`, method: "PUT"};
        $.ajax({
            url: config.url,
            method: config.method,
            data: JSON.stringify(updatedEmployee),
            contentType: "application/json",
            success: r=>{
                if(r.ok) {
                    toastIt("bg-success", "Operation successfully completed.");
                    $('.modal').modal('hide');
                    setTimeout(()=>window.location.reload(), 2000);
                }
                else {
                    toastIt("bg-danger", "Failed to complete your operation");
                    console.log(r);
                }
            },
            error: e=>{
                console.log(e);
            }
        });
    });
});

const toastIt = (bg, text) => {
    $(".toast")
        .removeClass("bg-danger")
        .removeClass("bg-success")
        .addClass(bg)
        .toast("show");
    $(".toast-body").text(text);
}
const georgianToJalali = gDate => {
    gDate = gDate.split('-');
    let geo_date = new Date(parseInt(gDate[0]),parseInt(gDate[1]),parseInt(gDate[2]));
    return new persianDate(geo_date).format('L');
}
const jalaliToGregorian = jDate => {
    jDate = jDate.split('/').map(v=>v = parseInt(v));
    return new persianDate([jDate[0],jDate[1],jDate[2]]).toCalendar('gregorian').format('L');
}
const adminCheck = show => {
    if(show){
        $('#is_admin').
        html('' +
            '<option value="false">False</option>' +
            '');
        $('#has_admin_true').removeClass('d-none');
    }
    else {
        $('#is_admin').
        html('' +
            '<option value="true">True</option>' +
            '<option value="false">False</option>' +
            '');
        $('#has_admin_true').addClass('d-none');
    }

}