const responseLabel = document.getElementById('responseLabel');
const username = document.getElementById('username');

// Main handler for button click
function handleButtonClick(action){
    responseLabel.textContent = "";
    switch(action){
        case 'briefInformation':
            briefInformation();
            break;
        case 'allInformation':
            allInformation();
            break;
        case 'deleteHw':
            deleteHw();
            break;
        default: 
            console.error("Unknown action: ", action);
            break;
    }
}

async function getInformation(uri){
    try{
        const response = await fetch(uri);
        const data = await response.json();
        // console.log(data);
        return data;
    } catch(err){
        console.log(err);
        return undefined;
    }
}

async function deleteInformation(uri){
    try{
        const response = await fetch(uri, {method: 'DELETE'}); 
        const data = await response;
        // console.log(data);
        return data;
    } catch(err){
        console.log(err);
        return undefined;
    }
}

async function briefInformation(){
    const res = await getInformation(`/getBriefInformation?username=${username.value}`);
    if(res === undefined){
        responseLabel.textContent = `Error processing query`;
        return;
    }

    responseLabel.textContent = `Successful request with ${res.length} elements`;

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    let sharedWith = '';

    // Create a card for each element
    res.forEach(hw => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <i>ID: ${hw.id}</i>
            <p><b> Title: ${hw.title} </b></p>
            <p> Description: ${hw.description} </p>
            <p> Visibility: ${hw.visibility} </p>
        `;

        cardsContainer.appendChild(card);
    })
    console.log(JSON.stringify(res));
}

async function allInformation(){
    const hwId = document.getElementById('hwId').value;
    if(hwId === ''){
        responseLabel.textContent = "No id provided!"
        return;
    }
    
    const res = await getInformation(`/getAllInformation?id=${hwId}`)
    if(res === undefined){
        responseLabel.textContent = `Error processing query`;
        return;
    }

    responseLabel.textContent = `Successful request with hwId ${hwId}`;

    // Reduce queries if visibility is shared, join userId
    let mergedSharedWith = res.reduce((acc, obj) => {
        const existing = acc.find(item => item.id === obj.id);
        if(existing){
            existing.userId.push(obj.userId);
        } 
        else{
            obj.userId = [obj.userId];
            acc.push(obj);
        }
        return acc;
    }, []);
    mergedSharedWith = mergedSharedWith[0];

    // Verifications for optional fields
    const sharedWith = mergedSharedWith.visibility !== 'Shared' ? 
                        '' : `<p> Shared with: ${mergedSharedWith.userId} </p>`;
    const responsible = mergedSharedWith.responsible === null ? 
                    '' : `<p> Responsible id: ${mergedSharedWith.responsible} </p>`;
    const tagNames = mergedSharedWith.tagNames === undefined ? 
                        '' : `<p> Tags: ${mergedSharedWith.tagNames} </p>`;
    const file = mergedSharedWith.file === null ? 
                 '' : `<p> File: ${mergedSharedWith.file}</p>`;
       
    let comments = '';
    if(mergedSharedWith.comments){
        comments = 'Comments: <ul>';
        mergedSharedWith.comments.split('\n').forEach(val => {
            comments += `<li> ${val} </li>`
        })
        comments += '</ul>';
    }

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <i>ID: ${mergedSharedWith.id}</i>
        <p><b> Title: ${mergedSharedWith.title} </b></p>
        <p> Description: ${mergedSharedWith.description} </p>
        <p> Visibility: ${mergedSharedWith.visibility} </p>
        <p> Due Date: ${Date(mergedSharedWith.dueDate)} </p>
        <p> Owner id: ${mergedSharedWith.createdBy} </p>
        ${sharedWith}
        ${responsible}
        ${tagNames}
        ${comments}
        ${file}

    `;
    cardsContainer.appendChild(card);

    console.log(mergedSharedWith);
}

async function deleteHw(){
    console.log("Hi there butch");
    const hwId = document.getElementById('hwId').value;
    if(hwId === ''){
        responseLabel.textContent = "No id provided!"
        return;
    }

    const res = await deleteInformation(`/deleteHw?id=${hwId}`);
    if(res === undefined){
        responseLabel.textContent = `Error processing query`;
        return;
    }

    responseLabel.textContent = `Successful deletion of homework with hwId ${hwId}`;
}