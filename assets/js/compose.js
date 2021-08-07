

// ---------------    OVERLAY ----------------------------

document.getElementById('close-btn-cnt').addEventListener("click", hideOverlay);
document.getElementById('show-overlay-btn').addEventListener("click", () => {
    console.log("initiating...");
    showOverlay();
});

function hideOverlay(){ 
    const ele = document.getElementById('overlay-cnt');
    ele.classList.add('hide-overlay');
    ele.classList.remove('show-overlay');
}
function showOverlay(){ 
    const ele = document.getElementById('overlay-cnt');
    console.log("inside fn.");
    ele.classList.remove('hide-overlay');
    ele.classList.add('show-overlay');
}


// ------------------- SEARCH ENGINE FOR POST ------------------------

$("body").not($("#search-engine-cnt")).click(function(){
    document.getElementById('result-cnt').style.display = "none";
});

function search_engine(){

    fetch('../assets/users_data/pseudo_placeAPI.json')
    .then(data => data.json())
    .then(data => {

        $("#search_input").keyup(function(){

            document.getElementById('result-cnt').style.display = "block";
            const val = $("#search_input").val().toUpperCase();
            var re = `(${val})`;
            let result =  data.filter(word => word.location.match(re) );
            
            result  = result.slice(0,5);
            let lis = '';
            result.forEach(element => {
                lis += "<button type=\"button\" onclick=\"set_lat_lng(this.innerHTML)\" >" + element.location + '<sub>' + element.lat + '</sub>-<sub>' + element.lng + '</sub>' + '</button><hr>';
            });
            document.getElementById('geo-data').innerHTML = lis;
        });
    })

}




// -------------- SET LATITUDE AND LONGITUDE ------------------- 


function set_lat_lng(txt){

    const arr = txt.split('<sub>').join(",").split('</sub>').join(',').split(',');
    document.getElementById('search_input').value = arr[0];
    document.getElementById('latitude').value = arr[1];
    document.getElementById('longitude').value = arr[3];

}



// -------------------- TO ADD EXTRA INPUT FIELDS -------------

// incomplete

let count = 0;
function add_additional_input_fields(){
    if(count<5){
    let head_input = document.createElement("input");
    let body_input = document.createElement("input")
    head_input.setAttribute("placeholder", "give it a heading");
    body_input.setAttribute("placeholder", "enter text here ... ");   
    head_input.setAttribute("type", "text");
    body_input.setAttribute("type", "text");
    head_input.setAttribute("name", "heading");
    body_input.setAttribute("name", "text");
    head_input.setAttribute("required", "true");
    body_input.setAttribute("required", "true");
    document.getElementById("additional_container").appendChild(head_input);
    document.getElementById("additional_container").appendChild(document.createElement("br"));
    document.getElementById("additional_container").appendChild(body_input);
    document.getElementById("additional_container").appendChild(document.createElement("br"));
    count++;
    }
    else document.getElementById("add_button").setAttribute('disabled');
}

