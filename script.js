
let dataJson;

let renderTemplate = '';
let filtersItems = [''];
let listFiltering = [''];
let TagList = [];

// references to Dom
const container = document.querySelector('.container');
const filterSet = document.querySelector('.filter-set');
const filterContainer = document.querySelector('.f-container');
let FilterHolder;
let items;


fetch('./data.json')
    .then(response => {
        if(!response.ok){
            throw new Error('Error con la solicitud' + response.statusText);
        }
        return response.json()
    })
    .then( data =>{
        dataJson = data
        // alert(dataJson[1].id)
        tplteRenderer(dataJson)
    })
    .catch(error => {
        alert('Errror' + error)
})


let tplteRenderer = (data)=>{
    let auxTemplate = '';
    let filterAuxTemplate = ['']

    let index = 0
    data.forEach(element => {
        filtersItems[index] = filtersCollect(element)
        filterAuxTemplate[index] = filterTemplateGenerator(filtersItems[index]);
        // let filters = element.languages;
        // let listFill = [''];
        // let otherIndex = 0;
        // filters.forEach(filter => {
        //     listFill[otherIndex] = `${filter}`;
            
        //     otherIndex ++;
        // });


        // filtersItems[index] = listFill;


        // alert(listFill)
        // alert(filtersItems[index])
        // alert(filterAuxTemplate[index])

        auxTemplate += `
            <article class="item" >
                <div class="i-image" >
                    <img src=${element.logo} >
                </div>
                <div class="i-body" >
                    <section class="title-holder">
                    <p class="domain" >${element.company}
                        <span class="tag-holder">
                            <span>NEW!</span>
                            <span>FEAUTURED</span>
                        </span>
                    </p>
                    <p class="title" >${element.position}</p>
                    <p class="usues" >
                        <span>${element.postedAt}</span>.
                        <span>${element.contract}</span>.
                        <span>${element.location}</span>
                    </p>
                    </section>

                    <div class="separtor" > <hr> </div>

                    <section class="filter-holder" >
                        <button onclick="filterListController(this)" >${element.role}</button>
                        <button onclick="filterListController(this)" >${element.level}</button>
                    </section>
                </div>
            </article>`;
        index ++;
    });
    //General rendering
    container.innerHTML = auxTemplate;

    //Define references for tags
    items = document.querySelectorAll('.item');
    let newCartPlace = document.querySelectorAll('.tag-holder span:first-child');
    let featuredCartPlace = document.querySelectorAll('.tag-holder span:last-child');
    refreshTags(newCartPlace, featuredCartPlace, data);
    
    //Render of filters in item
    filtersRenderer(filterAuxTemplate)
}


let filtersRenderer = (filterAuxTemplate) =>{
    FilterHolder = document.querySelectorAll('.filter-holder');
    let auxCounter = 0

    FilterHolder.forEach(fill => {
        fill.insertAdjacentHTML('beforeend', `${filterAuxTemplate[auxCounter]}`);
        auxCounter ++;
    });
}

let refreshTags = ( newsList, featuredList, data)=> {
    let auxIndex = 0;
    data.forEach(element => {
        if(element.new){
            newsList[auxIndex].className = 'new';
        }
        if(element.featured){
            featuredList[auxIndex].className = 'featured';
            items[auxIndex].style.borderLeft = '8px solid var(--Desaturated-Dark-Cyan)'
        }
        auxIndex ++;
    });
}

let filtersCollect = (element) =>{
    let filters = element.languages;
    let listFill = [''];
    let otherIndex = 0;
    filters.forEach(filter => {
        listFill[otherIndex] = `${filter}`;
        
        otherIndex ++;
    });
    return listFill;
}
let filterTemplateGenerator = (elementList)=>{
    let auxTemplate = ''
    elementList.forEach(element => {
        auxTemplate += `
        <button onclick="filterListController(this)" >${element}</button>
        `
    });
    return auxTemplate;
}

let filterListController = (tagButton)=> {
    //todo recibir el tag y analizar si puede annadirse o debe cambiarse
    TagList.push(`${tagButton.innerText}`)
    //Todo anters de annadir el contenido anterior
    // alert(tagButton.innerText)
    
    tagListRendering();
}

let tagListRendering=()=>{
    let auxTemplate = '';
    
    if(TagList.length != 0){
        filterSet.style.display = 'flex'
        TagList.forEach(tag => {
            auxTemplate += `
            <section>
                <span>${tag}</span>
                <button onclick="dequeueTag(this)" type="${tag}" >x</button>
            </section>`
        });
        filterContainer.innerHTML = auxTemplate;
        filterData(TagList);
    }else{
        tplteRenderer(dataJson);
        filterSet.style.display = 'none'
    }
}

let filterData = (tagList)=>{
    let dataList = [];

    dataJson.forEach(object => {
        let objectiveTagList = searchTagsByObject(object);
        // alert(objectiveTagList);

        //todo: Comparar si el objeto cumple con el filtrado (tagList) y en funcion de esto annadirlo o no a la DataList
        // alert(compareTagList(objectiveTagList, tagList))
        if( compareTagList(objectiveTagList, tagList) == true ){
            dataList.push(object);
            // alert(object)
        }
    });
    //todo: LLamar al metodo de renderizado con los datos filtrados tplteRenderer(dataList)
    tplteRenderer(dataList);
}

let searchTagsByObject = (object)=> {
    let objetiveList = [`${object.role}`,`${object.level}`];

    let auxCounter = 2;
    object.languages.forEach(language => {
        objetiveList[auxCounter] = language;
        auxCounter ++;
    });
    object.tools.forEach(tool => {
        objetiveList[auxCounter] = tool;
        auxCounter ++;
    });
    return objetiveList;
    
}

let compareTagList = (objectiveList, tagList) =>{
    let canPush = false;
    tagList.forEach(tag => {
        const evenNumbers = objectiveList.filter(objectiveTag => tag === objectiveTag );
        if(evenNumbers.length == 0){
            canPush = false;
            return false;
        }else{
            canPush = true
        }
    });
    return canPush;
}






let dequeueTag = (tag)=> {
    const index = TagList.indexOf(`${tag.type}`);
    TagList.splice(index, 1);
    tagListRendering();
}


let clearTagList= ()=>{
    TagList = [];
    tplteRenderer(dataJson);
    tagListRendering();
}
