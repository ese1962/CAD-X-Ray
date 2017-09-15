//Author: Esben Stig Ehrenskjold
//Date: 15-09-2017
//Version: 0.1
//Modifyed: 
//License: MIT
var xRay = {
    rootFolder: "images",
    auto: false,
    imgArray: [],
    imgTitleArray: [],
    init: function () {
        this.viewBuilder();
        this.controlBuilder();
        this.control();
        //init control
        //check the first radio by default and set style
        var objElement = document.getElementById("front");
        objElement = objElement.children[2];
        addClass(objElement, 'checked');
        objElement.children[0].children[0].setAttribute("checked", "checked");
        //disable the secund radio by default and set style
        var objElement = document.getElementById("front");
        objElement = objElement.children[3];
        addClass(objElement, 'disabled');
        objElement.children[0].children[0].setAttribute("disabled", "disabled");
        //check the secund radio by default and set style
        var objElement = document.getElementById("back");
        objElement = objElement.children[3];
        addClass(objElement, 'checked');
        objElement.children[0].children[0].setAttribute("checked", "checked");
        //disable the first radio by default and set style
        var objElement = document.getElementById("back");
        objElement = objElement.children[2];
        addClass(objElement, 'disabled');
        objElement.children[0].children[0].setAttribute("disabled", "disabled");
        var objXRay = this;
        //track mouse movement in body
        document.addEventListener('mousemove', objXRay.refreshClip);
    },
    refreshClip: function (e) {
        var w = 0;
        var h = 100; //Width of clip view
        var divLeft = document.getElementById('imgBack').getBoundingClientRect();
        var x = e.pageX - divLeft.left // Mouse position in clip element minus the offset of the element
        var y = 0;
        if (typeof (window.innerWidth) == 'number') {
            w = window.innerWidth; //all modern browsers
        }
        else {
            w = document.body.clientWidth; //IE 8
        };
        document.getElementById('imgBack').style.clip = "rect(" + y + "px" + "," + (x + h) + "px" + "," + (y + w) + "px" + "," + x + "px" + ")";
    },
    changeImgFront: function (frontimg) {
        document.getElementById('imgFront').src = this.rootFolder + "/" + frontimg;
    },
    changeImgBack: function (backimg) {
        document.getElementById('imgBack').src = this.rootFolder + "/" + backimg;
    },
    viewBuilder: function () {
        if (this.imgArray.length >= 2) {
            var imgFrontSource = this.imgArray[0];
            var imgBackSource = this.imgArray[1];
            if (this.imgTitleArray.length >= 2) {
                var imgFrontTitle = this.imgTitleArray[0];
                var imgBackTitle = this.imgTitleArray[1];
            }
            else {
                var imgFrontTitle = this.imgArray[0];
                var imgBackTitle = this.imgArray[1];
            }
            var strHtml = '<img id="imgBack" src="' + this.rootFolder + "/" + imgBackSource + '" class="img-responsive text-center" alt="' + imgBackTitle + '" border="0" />';
            strHtml += '<img id="imgFront" src="' + this.rootFolder + "/" + imgFrontSource + '" class="img-responsive text-center" alt="' + imgFrontTitle + '" border="0" />';
            document.getElementById('xRay-view').innerHTML = strHtml;
        }
        else {
            document.getElementById('xRay-view').innerHTML = "<div>Please fill the image array with images from your images folder (minmum two images) and try again.</div>";
        }
    },
    controlBuilder: function () {
        var cbHelperArray = [];
        var objXRay = this;
        var strListHtml = "";
        for (i = 0; i < this.imgArray.length; i++) {
            if (typeof objXRay.imgTitleArray[i] !== "undefined") {
                var imgTitle = this.imgTitleArray[i];
            }
            else {
                var imgTitle = this.imgArray[i];
            }
            cbHelperArray.push({ imgsource: objXRay.imgArray[i], imgtitle: imgTitle, count: i }); //create json array
        }

        if (this.imgArray.length >= 2) {
            var strHtml = '<div id="front" class="well well-lg text-left">';
            strHtml += '<h3>Front Image:</h3><br>';
            for (i = 0; i < cbHelperArray.length; i++) {
                strListHtml += cbListHelperFront(cbHelperArray[i]);
            }
            strHtml += strListHtml;
            strListHtml = "";
            strHtml += '</div>';
            strHtml += '<div  id="back" class="well well-lg text-left">';
            strHtml += '<h3>Clip Image:</h3><br>';
            for (i = 0; i < cbHelperArray.length; i++) {
                strListHtml += cbListHelperBack(cbHelperArray[i]);
            }
            strHtml += strListHtml;
            strHtml += '</div>';
            strListHtml = "";
            document.getElementById('xRay-control').innerHTML = strHtml;
        }
        else {
            document.getElementById('xRay-control').innerHTML = "<div>Please fill the image arrays with images from your images folder (minmum two images) and try again.</div>";
        };
    },
    control: function () {
        var objXRay = this;
        var tagFrontList = [];
        var tagBackList = [];
        var tagsFront = document.getElementsByName("frontradio");
        var tagsBack = document.getElementsByName("backradio");
        //Dump front elements into Array
        while (tagFrontList.length != tagsFront.length) {
            tagFrontList.push(tagsFront[tagFrontList.length])
        };
        //Dump back elements into Array
        while (tagBackList.length != tagsBack.length) {
            tagBackList.push(tagsBack[tagBackList.length])
        };
        //add eventlistner to all front elements
        tagFrontList.forEach(function (item) {
            item.addEventListener("click", function (event) {
                var clickedIndex = tagFrontList.indexOf(event.target || event.srcElement); //set clicked index
                resetFrontRadioButtons(clickedIndex, objXRay);
            });
        });
        //add eventlistner to all back elements
        tagBackList.forEach(function (item) {
            item.addEventListener("click", function (event) {
                var clickedIndex = tagBackList.indexOf(event.target || event.srcElement); //set clicked index
                resetBackRadioButtons(clickedIndex, objXRay);
            });
        });

        function resetFrontRadioButtons(index, obj) { //update front controle
            for (i = 0; i < tagsFront.length; i++) {
                if (i !== index) {
                    tagsFront[i].removeAttribute("checked");
                    tagsBack[i].removeAttribute("disabled");
                    removeClass(tagsBack[i].parentElement.parentElement, 'checked');
                    removeClass(tagsBack[i].parentElement.parentElement, 'disabled');
                }
                else {
                    addClass(tagsFront[i].parentElement.parentElement, 'checked');
                    addClass(tagsBack[i].parentElement.parentElement, 'disabled');
                    tagsBack[i].setAttribute("disabled", "disabled");
                    obj.changeImgFront(tagsFront[i].value);
                }
            }
        }

        function resetBackRadioButtons(index, obj) { //update back controle
            for (i = 0; i < tagsBack.length; i++) {
                if (i !== index) {
                    tagsBack[i].removeAttribute("checked");
                    tagsFront[i].removeAttribute("disabled");
                    removeClass(tagsBack[i].parentElement.parentElement, 'checked');
                    removeClass(tagsFront[i].parentElement.parentElement, 'disabled');
                }
                else {
                    addClass(tagsBack[i].parentElement.parentElement, 'checked');
                    addClass(tagsFront[i].parentElement.parentElement, 'disabled');
                    tagsFront[i].setAttribute("disabled", "disabled");
                    obj.changeImgBack(tagsBack[i].value);
                }
            }
        }
    }
};
//helper functions
function cbListHelperFront(item) {
    strHtml = '<div class="radio container' + item.count + '">';
    strHtml += '<label><input class="input' + item.count + '" type="radio" name="frontradio" value="' + item.imgsource + '">' + item.imgtitle + '</label>';
    strHtml += '</div>';
    return strHtml;
}

function cbListHelperBack(item) {
    strHtml = '<div class="radio container' + item.count + '">';
    strHtml += '<label><input class="input' + item.count + '" type="radio" name="backradio" value="' + item.imgsource + '">' + item.imgtitle + '</label>';
    strHtml += '</div>';
    return strHtml;
}

function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className)
    else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className = el.className.replace(reg, ' ')
    }
}
// End -->