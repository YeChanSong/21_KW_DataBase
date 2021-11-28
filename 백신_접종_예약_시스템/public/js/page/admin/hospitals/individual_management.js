$(document).ready(function() {
    /* 병원 목록 DataTables 옵션 설정 */
    var hospitalsTable = $('#hospitalsTable').DataTable({
        dom: // searching: true를 유지하면서 검색창은 안보이게 하기 위함 (검색창 대신 구/동 필터 표시)
            "<'row'<'col-sm-12 col-md-6'l><'#location_filter.col-sm-12 col-md-6 input-group input-group-sm'>>" +
            "<'row'<'col-sm-12'tr>>" + 
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>", 

        columns: [
            {
                data: "hospital_name",
                width: "45%"
            },
            { 
                data: "hospital_location",
                width: "55%"
            },
            { 
                data: "location_name",
                visible: false
            },
            { 
                data: "sublocation_name",
                visible: false
            },
            { 
                data: "hospital_id",
                visible: false
            }
        ],

        serverSide: true,
        ajax: "data-tables-source",
        
        ordering: false,

        pageLength: 10,
        lengthMenu: [ 5, 10, 25, 50, 100 ],

        scrollY: "600px",
        scrollCollapse: true,

        language: {
            decimal : "",
            emptyTable : "병원이 없습니다.",
            info : "_START_ - _END_ (총 _TOTAL_ 곳)",
            infoEmpty : "0곳",
            infoFiltered : "(전체 _MAX_ 곳 중 검색결과)",
            infoPostFix : "",
            thousands : ",",
            lengthMenu : "_MENU_ 곳씩 보기",
            loadingRecords : "로딩중...",
            processing : "처리중...",
            search : "검색 : ",
            zeroRecords : "검색된 병원이 없습니다.",
            paginate : {
                first : "첫 페이지",
                last : "마지막 페이지",
                next : "다음",
                previous : "이전"
            },
            aria : {
                sortAscending : " :  오름차순 정렬",
                sortDescending : " :  내림차순 정렬"
            }
        }
    });

    document.getElementById("location_filter").innerHTML = 
    `
    <select class="custom-select" id ="guSelect">
        <option value="">전체 구</option>
    </select>
    <select class="custom-select" id ="dongSelect">
        <option value="">전체 동</option>
    </select>
    `;

    /* 구, 동 리스트를 받아와서 선택한 구, 동에 속한 병원만 필터링 하는 기능 추가*/
    axios({
        method: 'get',
        url: '/admin/location-data'
    })
    .then(function(response) {
        let location_data = response.data;
        let guSelectEl = document.getElementById("guSelect");
        let dongSelectEl = document.getElementById("dongSelect");

        function filterHospitalsByLocation() {
            hospitalsTable.column(2).search(guSelectEl.value);
            hospitalsTable.column(3).search(dongSelectEl.value);
            hospitalsTable.draw(); // 서버에 필터링된 테이블 데이터 요청하는 시점
        }

        for (const location_name of Object.keys(location_data)) {
            let optionEl = document.createElement("option");
            optionEl.setAttribute("value", location_name);
            optionEl.textContent = location_name;

            guSelectEl.append(optionEl);
        }

        guSelectEl.addEventListener('change', (event) => {
            dongSelectEl.replaceChildren(dongSelectEl.firstElementChild);

            if (event.target.value) {
                for (const sublocation_name of location_data[event.target.value]) {
                    let optionEl = document.createElement("option");
                    optionEl.setAttribute("value", sublocation_name);
                    optionEl.textContent = sublocation_name;

                    dongSelectEl.append(optionEl);
                }
            }

            filterHospitalsByLocation();
        });

        dongSelectEl.addEventListener('change', filterHospitalsByLocation);
    });

    /* 백신 보유량 테이블 DataTables 옵션 설정 */
    var vaccinesTable = $('#vaccinesTable').DataTable({
        columns: [
            {
                data: "vaccine_name"
            },
            { 
                data: "vaccine_manufacturer"
            },
            { 
                data: "vaccine_quantity",
                render: function(data, type) {
                    if (type === 'display') {
                        let el = '<input type="number" class="vaccine-quantity form-control form-control-sm" min="0" value="' + data + '">';
                        return el;
                    }

                    return data;
                }
            },
            {
                data: "vaccine_id",
                visible: false
            }
        ],
        
        searching: false,
        ordering: false,
        info: false,
        paging: false,

        language: {
            decimal : "",
            emptyTable : "해당 병원의 백신 보유량이 없습니다.", 
            thousands : ",",
        }
    });

    /* 백신 보유량 수정값 저장 */
    document.getElementById("saveVaccineQuantity").addEventListener("click", (event) => {
        let vaccine_quantity_tableData = vaccinesTable.rows().data();
        let vaccine_quantity_input = document.getElementsByClassName('vaccine-quantity');

        let put_data = [];
        for (let i = 0; i < vaccine_quantity_tableData.length; ++i) {
            put_data.push({
                vaccine_id: vaccine_quantity_tableData[i].vaccine_id,
                vaccine_quantity: vaccine_quantity_input[i].value
            });
        }

        axios({
            method: 'put',
            url: event.target.getAttribute("data-hospitalId") + '/vaccine-quantities',
            data: put_data
        })
        .then((response) => {
            alert(response.data.message);
        })
        .catch((err) => {
            alert(err.message);
        });
    });

    /* 접종 예약 테이블 DataTables 옵션 설정 */
    var reservationsTable = $('#reservationsTable').DataTable({
        columns: [
            {
                data: "reservation_date",
                render: function(data, type) {
                    if (type === 'display') {
                        return new Date(data).toLocaleString();
                    }

                    return data;
                }
            },
            { 
                data: "vaccine_name"
            },
            {
                data: "inoculation_number"
            },
            {
                data: "user_name"
            },
            {
                data: "age"
            }
        ],
        
        searching: false,
        ordering: false,

        language: {
            decimal : "",
            emptyTable : "해당 병원의 접종 예약이 없습니다.",
            info : "_START_ - _END_ (총 _TOTAL_ 건)",
            infoEmpty : "0건",
            infoFiltered : "(전체 _MAX_ 건 중 검색결과)",
            infoPostFix : "",
            thousands : ",",
            lengthMenu : "_MENU_ 건씩 보기",
            loadingRecords : "로딩중...",
            processing : "처리중...",
            search : "검색 : ",
            zeroRecords : "해당 병원의 접종 예약이 없습니다.",
            paginate : {
                first : "첫 페이지",
                last : "마지막 페이지",
                next : "다음",
                previous : "이전"
            },
            aria : {
                sortAscending : " :  오름차순 정렬",
                sortDescending : " :  내림차순 정렬"
            }
        }
    });

    /* 병원 목록 테이블의 각 행 클릭 이벤트 처리*/
    $('#hospitalsTable tbody').on('click', 'tr', function () {
        let selectedRowData = hospitalsTable.row(this).data();

        /* 클릭한 행 색깔 변경 */
        hospitalsTable.$('tr.table-primary').removeClass('table-primary');
        $(this).addClass('table-primary');

        /* 백신 보유량 테이블과 예약 테이블 카드 제목에 병원 이름 표시 */
        document.getElementById("vaccineCardHeader").textContent = "백신 보유량 관리 - [" + selectedRowData.hospital_name + "]";
        document.getElementById("reservationCardHeader").textContent = "예약 정보 - [" + selectedRowData.hospital_name + "]";

        /* 클릭한 행에 해당하는 병원의 백신 보유량 테이블과 예약 테이블 채우기 */
        document.getElementById("saveVaccineQuantity").setAttribute("data-hospitalId", selectedRowData.hospital_id);
        document.getElementById("saveVaccineQuantity").disabled = false;
        vaccinesTable.ajax.url(selectedRowData.hospital_id + '/vaccine-quantities').load();

        reservationsTable.ajax.url(selectedRowData.hospital_id + '/vaccine-reservations').load();
    });
    
});
