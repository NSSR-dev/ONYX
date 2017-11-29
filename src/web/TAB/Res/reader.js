div = ''
sidepanelId = ''

function main(){
    if(div != "sidePanel"){
    sidepanelId = div;
    }
    var topic = location.hash;
    if(location.hash == ''){
        return;
    }
    var reader = document.getElementById('reader');
    reader.style.WebkitAnimation = "movereaderDown 1s 1"; // Code for Chrome, Safari and Opera
    reader.style.animation = "movereaderDown 1s 1";
    reader.src='http://syxnet.tech';
    setTimeout(function(){ 
        document.getElementsByClassName('menu-root').className = 'menu-root-none';
        cat = document.getElementById('cat-title');
        cat.innerHTML= sidepanelId;
        cat.style.display = "block";
        cat.style.animation = "sidepanelIn 1s 1";
        cat.style.WebkitAnimation = "sidepanelIn 1s 1";
        ret = document.getElementById('reader-return');
        ret.style.display = "block";
        ret.style.animation = "sidepanelIn 1s 1";
        ret.style.WebkitAnimation = "sidepanelIn 1s 1";
        document.getElementById(sidepanelId).setAttribute("id","sidePanel");
        doc = document.getElementById('sidePanel');
        doc.style.animation = "sidepanelIn 1s 1";
        doc.style.WebkitAnimation = "sidepanelIn 1s 1";
    },500);
    setTimeout(function(){ 
        reader.style.marginTop = "10px";
        document.getElementById('closebutton').style.display = "block";
        document.getElementById('cat-sub').innerHTML='//Documentation/' + topic;
    },1000);
}

function closeReader(){
    document.getElementsByClassName('menu-root').className -= 'menu-root-none';
    location.hash = '';
    document.getElementById('closebutton').style.display = "none";
    cat = document.getElementById('cat-title');
    cat.style.animation = "sidepanelOut 2s 1";
    cat.style.WebkitAnimation = "sidepanelOut 2s 1";
    ret = document.getElementById('reader-return');
    ret.style.animation = "sidepanelOut 2s 1";
    ret.style.WebkitAnimation = "sidepanelOut 2s 1";
    doc = document.getElementById('sidePanel');
    doc.style.animation = "sidepanelOut 2s 1";
    doc.style.WebkitAnimation = "sidepanelOut 2s 1";
    doc.setAttribute("id",sidepanelId);
    setTimeout(function(){ 
        cat.style.display = "none";
        ret.style.display = "none";
        reader = document.getElementById('reader');
        reader.style.WebkitAnimation = "movereaderUp 2s 1"; // Code for Chrome, Safari and Opera
        reader.style.animation = "movereaderUp 2s 1";
        document.getElementById('cat-sub').innerHTML='//Documentation';
        reader.style.marginTop = "-200%";
    },1000);
}

function start(){
    location.hash = '';
    var test = document.getElementById("content");
    function whatClicked(evt) {
        div = evt.target.parentNode.parentNode.parentNode.parentNode.id;
    }
    test.addEventListener("click", whatClicked, false);
}