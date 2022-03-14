$(document).ready(function() {
    
    let alueCheck;
    let tyyppiCheck;
    let vuosiCheck;
    let title = "";
    var oA;
    var oT;
    var oY;
    //värin poistamiseen
    var oAA = []; 
    
    $("#drawChartButton").on("click", function() {
        checkBool();
        getChartData();
     });
    
    //tarkista onko checkbox valittu
    function checkBool() {
        alueCheck = $("#alueCheck").is(":checked");
        tyyppiCheck = $("#tyyppiCheck").is(":checked");
        vuosiCheck = $("#vuosiCheck").is(":checked");
    }
    
    //valitut arvot
    function getSelectValues() {
        oA=$("#alueSelect :selected").val();
        oT=$("#tyyppiSelect :selected").val();
        oY=$("#vuosiSelect :selected").val();
    }

    
    function getChartData() {
        getSelectValues();
        var numbers = [];
        if (alueCheck == true && tyyppiCheck == true && vuosiCheck == false) {
             title = oA + " : " + oT;
            $.each(allData.rates, function(index, b) {
                if (b.alue == oA && b.tyyppi == oT) {
                    numbers.push(b.lukum);
                }
            });
            drawBarChart(years, numbers, title);
            fillMap(numbers);
        }
        else if (vuosiCheck == true && tyyppiCheck == true && alueCheck == false) {
             title = oT + " " + oY;
            $.each(allData.rates, function(index, b) {
                if (b.vuosi == oY && b.tyyppi == oT) {
                    numbers.push(parseInt(b.lukum));
                    
                }
            });
            drawBarChart(areas, numbers, title);
            fillMap(numbers);
        }
        else if (alueCheck == true && vuosiCheck == true && tyyppiCheck == false) {
             title = oA + " " + oY;
            $.each(allData.rates, function(index, b) {
                if (b.vuosi == oY && b.alue == oA) {
                    numbers.push(b.lukum);
                }
            });
            drawBarChart(types, numbers, title);
            fillMap(numbers);
        }
        else {
            alert("Kuvaajan piirtäminen epäonnistui - valitse kaksi arvoa!");
        }
    }
  
    //pylväsdiagrammi
    function drawBarChart(labels, numbers, title) {
        
    var canvas = document.createElement("canvas");
    canvas.id = "barChart";
    canvas.width = 400;
    canvas.height = 350;
    document.getElementById("chartContainer").appendChild(canvas);
        
    var ctx = canvas.getContext("2d");
    var chart = new Chart(ctx, {
        type: "bar",
        data: {
        labels: labels,
        datasets: [{
            label: "lukumäärä",
            data: numbers,
            backgroundColor: "#0000ff" 
        }]},
         options: {
             
              title: {
                display: true,
                text: title
            },
             responsive: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                ticks: {
                        display: false
                    }
                }]
            }
        }
    });
    }
    
    var allRegions = $(".region");
    
    //väritä alueet
    function fillMap(numbers) {
        let numbersSum = numbers.reduce((a, b) => a + b, 0);
        getSelectValues(); 
        checkBool();

        //jos valitaan tietty maakunta, asetetaan sille luokka "on"
        if(alueCheck == true) {

             $("#"+oA).removeClass("fila0 fila1 fila2 fila3 fila4");
            $("#"+oA).addClass("on");
            oAA.push(oA);
        }
        //jos vuosi ja tyyppi, väritetään maat suhteuttuna toisiinsa
        else if (vuosiCheck == true && tyyppiCheck == true) {
            let areasfill = areas;
            allRegions.removeClass("on fila0 fila1 fila2 fila3 fila4");
            for (var i = 0; i < areasfill.length; i++) {
                let percent = Math.round((numbers[i] / numbers[0]) * 1000) / 10;
                console.log(areasfill[i] + " " + percent);
                if (Number.isNaN(percent) || percent == 0) {
                     $("#"+areasfill[i]).addClass("fila0");
                }
                else if (percent > 0 && percent < 5) {
                     $("#"+areasfill[i]).addClass("fila1");    
                }
                else if (percent >= 5 && percent < 10) {
                     $("#"+areasfill[i]).addClass("fila2");
                }
                else if (percent >= 10 && percent < 20) {
                     $("#"+areasfill[i]).addClass("fila3");
                }
                else {
                    $("#"+areas[i]).addClass("fila4");
                }
            }  
             allRegions.mouseenter( function(ev) {
                var targetId = ev.target.id;
                allRegions.removeClass("lines");
                $(this).addClass("lines");

                showAreaNumber(targetId);
                 mapInfo.mouseLMap();
            });
        }
    }
    
          function showAreaNumber(targetId) {
              let oTlukum;
               $.each(allData.rates, function(index, r) { 
                    if (r.alue == targetId && r.tyyppi == oT && r.vuosi == oY) {
                    oTlukum = r.lukum;
                }
                });
              
                  let li0 = "<li>maakunta: " + targetId + "</li>";
                  let li1 = "<li>vuosi: " + oY + "</li>";
                  let li2 = "<li>" + oT + ": " + oTlukum + "</li>";
                 if (oTlukum == null) {
                    li2 = "<li>" + oT + ": ei tietoa</li>";
               }
                  
                   let list = "<ul> " + li0 + li1 + li2 + "</ul>";
                    $("#areaInfoBox").html($(list));  
          }

        
        allRegions.on("click", function(ev) {
                    $(allRegions).removeClass("fila0");
                   allRegions.unbind("mouseenter mouseleave");
                    mapInfo.hoverMap();
                    mapInfo.mouseLMap();
               });
    
        $("#emptyChartButton").on("click",function() {
                $("#barChart").remove();
                let lastId = oAA.slice(-1).pop();
                $("#"+lastId).removeClass("on");
                oAA.pop();
                $(allRegions).removeClass("fila0 fila1 fila2 fila3 fila4");
        })
    
});


