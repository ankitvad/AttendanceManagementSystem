$(document).ready(function() {
   
  $( '#startmodal' ).modal( 'toggle' );
   
    console.log( "ready!" );

    if (localStorage.masterList != undefined){
      console.log(localStorage.masterList);

    }
    else{
      console.log("No MasterList in memory");
    }
    

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("FileAPI supported!");
            } 
            else {
              alert('The File APIs are not fully supported in this browser.');
              }

            window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            // DON'T use "var indexedDB = ..." if you're not in a function.
            // Moreover, you may need references to some window.IDB* objects:
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


$("#Step2").hide();
$("#Step3").hide();
$("#Step4").hide();
});

//Event Handlers
$("#prepdata").click(function(){
  if (localStorage.masterList != undefined){
      console.log(localStorage.masterList);
      dataPrepForDB();

    }
    else{
      console.log("No MasterList in memory");
    }

  });

 $('#btnclosemodal').click(function(){
  $( '#startmodal' ).modal( 'hide' );
 });

$('#dataredo').click(function(){
  localStorage.clear();
  location.reload();

 });

 $('#btnenter').click(function(){
  var barcodeentered = $("#barcodeinput").val();
        console.log(barcodeentered);
        
         scanMatch(barcodeentered);
 });

//Upload button
 $('#files').change(function(event){
  localStorage.clear();

  handleFileSelect(event);
  displayTable(tablearea1);
 });

//Clear Memory Button
$("#clearmem").click(function(){
  localStorage.clear();
});

$("#displayTable2").click(function(){
  $("#Step2").show();
  displayTable(tablearea1);
   $('body,html').animate({ scrollTop: $('#Step2').height()}, $('#Step2').height());
});

$("#displayTable3").click(function(){
  displayTable(tablearea2);
});

$("#dataconfirm").click(function(){
  displayTable(tablearea2);
  $("#Step3").show();
  var height3=$('#Step3').height();
  console.log(height3)
  $('body,html').animate({ scrollTop:  $('#Step2').height() + 60 + 730 }, $('#Step3').height());
});

$("#attendancecomplete").click(function(){
  $("#Step4").show();
  var height4=$('#Step4').height();
  console.log(height4)
  $('body,html').animate({ scrollTop:  $('#Step2').height() + 100 + $('#Step3').height() + 100 + 200+ height4}, $('#Step3').height());
});

$("#barcodeinput").keypress(function(){
  var present = 0;
   var total = 0;
    if (event.which == 13) {
        event.preventDefault();
        var barcodeentered = $("#barcodeinput").val();
        console.log(barcodeentered);
        
         scanMatch(barcodeentered);

         
    }
});


$("#exportData").click(function(){
  var csv = $("#tablearea2").table2CSV({delivery:'value'});
      window.location.href = 'data:text/csv;charset=UTF-8,'
                            + encodeURIComponent(csv);
});

//Upload button
 $('#files').change(function(){
  localStorage.clear();
  handleFileSelect();
  console.log("Invoked");
  displayTable(tablearea1);
});
 
  

function scanMatch(barcodenumber){

var cadetRoster = JSON.parse(localStorage.masterList);
$.each(cadetRoster, function(i,val){
  if(val[2] == barcodenumber){
    val[3] ="P";
    localStorage.present++;
    updateProgress((localStorage.present/localStorage.total)*100);
  }
  
});

localStorage.masterList = JSON.stringify(cadetRoster);
clearTable(tablearea2);
displayTable(tablearea2);
}

function updateProgress(percentage){
  
    if(percentage > 100) percentage = 100;
    $('#attendanceprog').css('width', percentage+'%');
    $('#attendanceprog').html(percentage+'%');
}



function clearTable(tablearea){
 $(tablearea).empty(); 
}



function databaseStuff(){
  var request = window.indexedDB.open("MyTestDatabase", 3);

      request.onerror = function(event) {
        alert("Database error: " + event.target.errorCode);
      };
      request.onsuccess = function(event) {
        db = request.result;
      };
}


function displayTable(displayarea){
console.log("display table invoked!");
var cadetRoster = JSON.parse(localStorage.masterList);
console.log(cadetRoster);

$.each(cadetRoster, function(i,val){
  var output='<tr>\r\n';
  var counter = 0;
  output +=  "<td id='Last_Name'>"+val[0]+"</td>"+"<td id='First_Name'>"+val[1]+"</td>"+"<td id='Barcode'>"+val[2]+"</td>"+"<td id='Attendance' Attendance="+val[3]+">"+val[3]+"</td>\r\n";
  
   output +=  "</tr>\r\n";
  console.log(output);





$(displayarea).append(output);
});
//$("#contents1").append(output);

}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    // read the file contents
    printTable(file);

    // post the results
    $('#list').append(output);
  }

  function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
      var csv = event.target.result;
      var data = $.csv.toArrays(csv);
      var html = '';

      var keycounter =0;
      //Create the array that will be loaded into localStorage
      var infoArray = [];
      for(var row in data) {
        html += '<tr>\r\n';
        var tempArray = [];
        //var counter = 0;

        var datakey = ["Last Name", "First Name", "Barcode", "Attendance"];
        for(var item in data[row]) {
          html += '<td>' + data[row][item] + '</td>\r\n';
          //var inputval = datakey[counter]+":"+data[row][item];
          //counter++;
          var inputval = data[row][item];
          tempArray.push(inputval);
          console.log(inputval);
        }
        infoArray.push(tempArray);
        console.log("Pushed into temparray");
        console.log(tempArray);
        console.log("What's in infoarray now");
        console.log(infoArray);
        html += '</tr>\r\n';
      }
      $('#contents').html(html);
      console.log("after outputting HTML");

      console.log("WHAT IS IN THE ARRAY??!");
      console.log(infoArray);
      console.log("Remove dat first line");
      var total = infoArray.length-1;
      console.log(total);
      localStorage.present = 0;
      localStorage.total = total-1;
      



     
      localStorage.masterList = JSON.stringify(infoArray);
      console.log(localStorage.masterList);
      $('#Step2').show();
      displayTable(tablearea1);


        $('body,html').animate({ scrollTop: 750}, $('#Step2').height());
      
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
  }

