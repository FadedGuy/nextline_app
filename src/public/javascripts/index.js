const responseLabel = document.getElementById('responseLabel');
const username = document.getElementById('username');

// Main handler for button click
function handleButtonClick(action, mod=0){
    responseLabel.textContent = "";
    switch(action){
        case 'briefInformation':
            briefInformation();
            break;
        case 'allInformation':
            allInformation(mod);
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

async function allInformationDisplay(res){
    // Verifications for optional fields
    const sharedWith = res.visibility !== 'Shared' ? 
                        '' : `<p> Shared with: ${res.userId} </p>`;
    const responsible = res.responsible === null ? 
                    '' : `<p> Responsible id: ${res.responsible} </p>`;
    const tagNames = res.tagNames === undefined ? 
                        '' : `<p> Tags: ${res.tagNames} </p>`;
    const file = res.file === null ? 
                 '' : `<p> File: ${res.file}</p>`;
       
    let comments = '';
    if(res.comments){
        comments = 'Comments: <ul>';
        res.comments.split('\n').forEach(val => {
            comments += `<li> ${val} </li>`
        })
        comments += '</ul>';
    }

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <i>ID: ${res.id}</i>
        <p><b> Title: ${res.title} </b></p>
        <p> Description: ${res.description} </p>
        <p> Visibility: ${res.visibility} </p>
        <p> Due Date: ${Date(res.dueDate)} </p>
        <p> Owner id: ${res.createdBy} </p>
        ${sharedWith}
        ${responsible}
        ${tagNames}
        ${comments}
        ${file}

    `;
    cardsContainer.appendChild(card);

    console.log(res);
}

async function allInformationForm(id, res){
    document.getElementById('idEdit').value = id;
    document.getElementById('titleEdit').value = res.title || "";
    document.getElementById('descriptionEdit').value = res.description || "";
    document.getElementById('completionStatusEdit').value = res.completionStatus || "";
    document.getElementById('dueDateEdit').value = res.dueDate.split('T')[0] || "1970-01-01";
    document.getElementById('visibilityEdit').value = res.visibility || "";
    document.getElementById('sharedWithEdit').value = res.sharedWith || "";
    document.getElementById('commentsEdit').value = res.comments || "";
    document.getElementById('createdByEdit').value = res.createdBy || "";
    document.getElementById('responsibleEdit').value = res.responsible || "";
    document.getElementById('tagsEdit').value = res.tags || "";
    document.getElementById('fileEdit').value = res.file || "";
}

async function allInformation(mod){
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

    if(mod === 0){
        allInformationDisplay(mergedSharedWith);
    }   
    else{
        allInformationForm(hwId, mergedSharedWith);
    }
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