   //kaikki data
     var allData;
    //nämä filtteröintiä varten
     var allTypes = [];
     var allAreas = [];
     var allYears = [];

     //filtteröity kategorioihin
     var types;
     var areas;
     var years;
     
     
     $(document).ready(loadAll);
    function loadAll() {
    $.ajax({
        url: "mortality.json",
        type: 'get',
        dataType: "json",
        cache: false,
        success: function(data) {
           console.log("load success");
        },
        error: function(jqXHR, textStatus, errorThrow){
            alert(jqXHR['responseText']);
        }
    }).done(function (data) {
            storeAllData(data);
            $("#loader").hide();
            $("#selections").css("display", "inline-block");
            mapInfo.hoverMap();
            mapInfo.mouseLMap();
    });
    
    
     
    //datan lajittelua
     function storeAllData(data) {
         allData = data;
         
         $.each(data.rates, function(index, info) {
                  allTypes.push(info.tyyppi);
                  allAreas.push(info.alue);
                  allYears.push(info.vuosi);
                });
         filterAllData();
         
     }
     
     //filtteröi valintamahdollisuuksiin
     function filterAllData() {
         types = allTypes.filter((v, i, a) => a.indexOf(v) == i);
         areas = allAreas.filter((v, i, a) => a.indexOf(v) == i);
         years = allYears.filter((v, i, a) => a.indexOf(v) == i);
         createComparison.createSelects();
     }
    }
