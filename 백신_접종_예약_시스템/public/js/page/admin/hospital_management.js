$(document).ready(function() {
    /* 병원 목록 테이블 DataTable 옵션 설정 */
    var hospitalsTable = $('#hospitalsTable').DataTable({
        dom: 
            "<'row'<'col-sm-12'tr>>" + 
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

        columns: [
            {
                data: "hospital_name"
            },
            { 
                data: "hospital_location"
            },
            { 
                data: "location_name",
                visible: false
            },
            { 
                data: "sublocation_name",
                visible: false
            }
        ],

        serverSide: true,
        ajax: '/admin/hospital-management/hospitals-data-tables-source',
        
        ordering: false,

        lengthChange: false,
        pageLength: 5,

        language: {
            decimal : "",
            emptyTable : "병원이 없습니다.",
            info : "_START_ - _END_ (총 _TOTAL_ 곳)",
            infoEmpty : "0개 항목",
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

    /* 병원 목록 테이블에 행 선택 효과 추가 */
    $('#hospitalsTable tbody').on('click', 'tr', function () {
        hospitalsTable.$('tr.table-primary').removeClass('table-primary');
        $(this).addClass('table-primary');
    } );

    /* 구, 동 리스트를 받아와서 선택한 구, 동에 속한 병원만 필터링 하는 기능 추가*/
    axios({
        method: 'get',
        url: '/admin/hospital-management/location-data'
    })
    .then(function(response) {
        let location_data = response.data;
        let guSelectEl = document.getElementById("guSelect");
        let dongSelectEl = document.getElementById("dongSelect");

        function filterHospitalsByLocation() {
            hospitalsTable.column(2).search(guSelectEl.value);
            hospitalsTable.column(3).search(dongSelectEl.value);
            hospitalsTable.draw();
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
});