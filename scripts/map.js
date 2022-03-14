    //areainfobox
    $(document).ready(mapInfo());
    function mapInfo() {
    let aInfoBox = document.createElement("DIV");
    aInfoBox.setAttribute("id", "areaInfoBox");
    document.getElementById("svgColumn").append(aInfoBox);

    var allRegions = $(".region");
    
    function hoverMap() {
        allRegions.mouseenter( function(ev) {
        //väri
        var targetId = ev.target.id;
        allRegions.removeClass("lines");
        $(this).addClass("lines");
        mouseLMap();  
            if ($(".region.on").length == 0) {
                countDeaths(targetId, allData);
        }
        });
    }
        
    function mouseLMap() {
    allRegions.mouseleave( function(ev) {
         allRegions.removeClass("lines");
        if (!allRegions.hasClass("on")) {
            $("#areaInfoBox").empty();
        }
    });
    }
        
    allRegions.on("click", function(ev) {
        countDeaths(ev.target.id, allData);
        if ($(this).hasClass("on")) {
            allRegions.removeClass("fila0 fila1 fila2 fila3 fila4");
            $(this).removeClass("on");
            hoverMap();
            }
        else {
        allRegions.removeClass("on fila1 fila2 fila3 fila4");
        $(this).addClass("on");
        }
        mouseLMap();
    });
        
    //kaikki kuolemat alueella
     function countDeaths(targetId, allData) {
    let deathsCount = 0;
    let deathsCountAll = 0;
     $.each(allData.rates, function(index, a) {
                if (a.alue == "Koko maa" && a.tyyppi == "Kuolleisuus / 100 000 asukasta") {
                    deathsCountAll += parseInt(a.lukum);
                }
              else if (a.alue == targetId && a.tyyppi == "Kuolleisuus / 100 000 asukasta") {
                  deathsCount += parseInt(a.lukum);
                  
                  
                  let li0 = "<li>maakunta: " + targetId + "</li>";
                  let li1 = "<li>vuodet: 2009-2019 </li>";
                  let li2 = "<li>kuolemia yhteensä / 100 000 asukasta: " + deathsCount + "</li>";
                  let li3 = "<li>Koko maa: " + deathsCountAll + "</li>";
                  let li4 = "";
                  
                  let countEmpty = 0;
                  if(a.lukum == "") {
                      countEmpty++;
                      li4 = "<li>" + countEmpty + " vuoden tilastoja ei löytynyt.</li>";
                  }
                  
                   let list = "<ul> " + li0 + li1 + li2 + li3 + li4 + "</ul>";
                    $("#areaInfoBox").html($(list));   
            }
          });   
    }
        
    mapInfo.hoverMap = hoverMap;
    mapInfo.mouseLMap = mouseLMap;
    mapInfo.countDeaths = countDeaths;
    };