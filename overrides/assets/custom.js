document.querySelectorAll(".nav-toggle")
.forEach(function(btn){

    btn.onclick=function(){

        this.parentElement.classList.toggle("open");

    }

});
