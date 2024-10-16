
let dataJson;
let renderTemplate = '';
let filtersTemplate = [''];

const container = document.querySelector('.container');
let filterHolder;

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

    let counter = 0
    data.forEach(element => {
        let filters = element.languages;
        
        filters.forEach(filter => {
            filtersTemplate[counter] += `<button>${filter}</button>`
        });
        // alert(counter)
        // alert(filtersTemplate[counter])

        auxTemplate += `<article class="item" >
                            <div class="i-image" >
                                <img src=${element.logo} >
                            </div>
                            <div class="i-body" >
                                <section class="title-holder">
                                <p class="domain" >
                                    <span class="tag-holder" >
                                    <span>NEW!</span>
                                    <span class="featured" >FEAUTURED</span>
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
                                    <button>Frontend</button>
                                    <button>Senior</button>
                                    <button>HTML</button>
                                    <button>CSS</button>
                                    <button>JavaScript</button>
                                </section>
                            </div>
                        </article>`;
        counter ++;
    });
    container.innerHTML = auxTemplate;
    filtersRenderer()

}


let filtersRenderer = () =>{
    filterHolder = document.querySelectorAll('.filter-holder');
    let auxCounter = 0

    filterHolder.forEach(fill => {
        fill.innerHTML = filtersTemplate[auxCounter];
        // alert(auxCounter)
        auxCounter ++;
    });
}
