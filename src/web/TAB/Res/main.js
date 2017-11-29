
var Start_showPage;
var Start_camera;
var Start_time;


function load() {
    Start_showPage = setTimeout(showPage, 3000);
}
function showPage() {
	document.getElementById("loading").style.display = "none";
	document.getElementById("Loading_Image").style.display = "none";
	var elems = document.getElementsByClassName('row');
	for (var i=0;i<elems.length;i+=1){
		elems[i].style.display = 'block';
	}
}