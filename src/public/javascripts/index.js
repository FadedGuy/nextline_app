const responseLabel = document.getElementById('responseLabel');
const username = document.getElementById('username');

// Main handler for button click
function handleButtonClick(action){
    responseLabel.textContent = "";
    switch(action){
        case 'briefInformation':
            briefInformation()
            break;
        case 'allInformation':
            allInformation()
            break;
        
        default: 
            console.error("Unknown action: ", action);
            break;
    }
}

async function fetchBriefInformation(username){
    try{
        const response = await fetch(`/getBriefInformation?username=${username.value}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(err){
        console.log(err);
        return undefined;
    }
}

function briefInformation(){
    console.log("brief information!");
    const res = fetchBriefInformation(username);
    if(res === undefined){
        responseLabel.textContent = "Error processing query";
        return;
    }

    responseLabel.textContent = res;
    console.log(res);
}

function allInformation(){
    const hwId = document.getElementById('hwId').value;
    
    if(hwId === ''){
        responseLabel.textContent = "No id provided!"
        return;
    }
    
    console.log(hwId);
}