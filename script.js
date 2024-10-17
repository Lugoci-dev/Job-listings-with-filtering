
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
            throw new Error('Error in the request ' + response.statusText);
        }
        return response.json()
    })
    .then( data =>{
        dataJson = data
        tplteRenderer(dataJson)
    })
    .catch(error => {
        alert('ERROR!' + error)
})


let tplteRenderer = (data)=>{
    let auxTemplate = '';
    let filterAuxTemplate = ['']

    let index = 0
    data.forEach(element => {
        filtersItems[index] = filtersCollect(element)
        filterAuxTemplate[index] = filterTemplateGenerator(filtersItems[index]);

        auxTemplate += `
            <article class="item" >
                <div class="i-image" >
                    <img src=${element.logo} alt="logo" >
                </div>
                <div class="i-body" >
                    <section class="title-holder">
                    <p class="domain" translate="no" >${element.company}
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
    const Langfilters = element.languages;
    const ToolFilters = element.tools;
    let listFill = [''];
    let auxIndex = 0;
    Langfilters.forEach(filter => {
        listFill[auxIndex] = `${filter}`;
        auxIndex ++;
    });
    ToolFilters.forEach(filter => {
        listFill[auxIndex] = `${filter}`;
        auxIndex ++;
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
    validTagFilter(tagButton.innerText);
}

let tagListRendering=()=>{
    let auxTemplate = '';
    
    if(TagList.length != 0){
        filterSet.style.display = 'flex'
        TagList.forEach(tag => {
            auxTemplate += `
            <section>
                <span>${tag}</span>
                <button onclick="dequeueTag(this)" name="${tag}" translate="no" >x</button>
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

        if( compareTagList(objectiveTagList, tagList) == true ){
            dataList.push(object);
        }
    });
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

let validTagFilter = (tagName)=>{
    if(TagList.length != 0){
        const index = TagList.indexOf(tagName);
        if(index < 0){
            TagList.push(tagName);
            tagListRendering();
        }else{
            TagList.splice(index,1);
            TagList.push(tagName);
            tagListRendering();
        }
    }else{
        TagList.push(tagName)
        tagListRendering();
    }
}

let dequeueTag = (tag)=> {
    const index = TagList.indexOf(`${tag.name}`);
    TagList.splice(index, 1);
    tagListRendering();
}

let clearTagList= ()=>{
    TagList = [];
    tplteRenderer(dataJson);
    tagListRendering();
}
