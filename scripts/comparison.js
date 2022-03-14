 $(document).ready(createComparison);
function createComparison() {
 //luo optionit
     function createSelects() {
         var optionsA = "";
         var optionsT = "";
         var optionsY = "";
         
         for (var i = 0; areas.length > i; i++) {
             let option = areas[i];
              optionsA += '<option value= "' + option + '">' + option + '</option>';
         }
         
         for (var i = 0; types.length > i; i++) {
             let option = types[i];
              optionsT += '<option value= "' + option + '">' + option + '</option>';
         }
         
          for (var i = 0; years.length > i; i++) {
             let option = years[i];
              optionsY += '<option value= "' + option + '">' + option + '</option>';
         }
         
         $("#alueSelect").html(optionsA);
         $("#tyyppiSelect").html(optionsT);
         $("#vuosiSelect").html(optionsY);
    }
    
    createComparison.createSelects = createSelects;
    
   
     //tulosta valittu data
     $("#printSelectedButton").on("click", function() {
         
         let oA=$("#alueSelect :selected").val();
         let oT=$("#tyyppiSelect :selected").val();
         let oY=$("#vuosiSelect :selected").val();
         let oP;
         
         let alue = document.createElement("LI");
         let tyyppi = document.createElement("LI");
         let vuosi = document.createElement("LI");
         let lukum = document.createElement("LI");
         let osuus = document.createElement("LI");
         alue.innerHTML ="alue: " + oA;
         tyyppi.innerHTML ="tyyppi: " + oT;
         vuosi.innerHTML ="vuosi: " + oY;
         
         let lukumPara;
         
         //etsi data valituilla hakutermeillä
         $.each(allData.rates, function(index, d) {
         
         if (d.alue == oA && d.tyyppi == oT && d.vuosi == oY) {
             if (d.lukum == null) {
                 lukum.innerHTML = "lukumäärä: ei tietoa";
                 osuus.innerHTML = "osuus: ei tietoa";
             }
             else {
                lukumPara = parseInt(d.lukum);
                lukum.innerHTML = "lukumäärä: " + d.lukum;
                 getkokomaaLukum();
             }
         }
        });
         
         //osuuden laskemiseen koko maan lukumäärä
         function getkokomaaLukum() {
          $.each(allData.rates, function(index, k) {
              if (k.alue == "Koko maa" &&  k.tyyppi == oT && k.vuosi == oY) {
                 if (k.lukum == "") {
                     osuus.innerHTML = "osuus: ei tietoa";
                 }
                 else {
                     let kokomaaLukum = parseInt(k.lukum);
                     calculatePercentage(kokomaaLukum, lukumPara);
                 }
            }
          });
        }
         
         //laske osuus ja luo lista
         function calculatePercentage(all, one) {
             let percentage = Math.round((one / all) * 1000) / 10;
             osuus.innerHTML = "osuus: " + percentage + "%";
         }
         
          let cLength = $("#dataContainer div").length;
          let dataId = "dBox" + cLength.toString();
          var dBox = document.createElement("DIV");
          dBox.setAttribute("id", dataId);
         dBox.setAttribute("class", "dataBox");
         
         let list = document.createElement("UL");
         list.append(alue, tyyppi, vuosi, lukum, osuus);
         
         let rm = document.createElement("BUTTON");
         rm.innerHTML = "X";
         rm.onclick = function(){rm.parentNode.remove()};
         
         dBox.append(rm, list);
         $("#dataContainer").append($(dBox));
        }); //tulosta data loppuu
    
        //tyhjennä vertailu
        $("#emptyButton").on("click", function(){
            $("#dataContainer").empty();
        });
    };
    