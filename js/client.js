function guid(){
    var S4 = function S4(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function send(fname, ary){
    var retval=[];
    for(var i=0; i<ary.length; i++ ){
        retval.push(ary[i][fname]());
    }
    return retval;
}

var Gist = new function(){

    this.persist = function(key, gist){
      localStorage.setItem(key, JSON.stringify({
          title: gist.title,
          categories: send("toLowerCase", gist.categories.split(/\s+,\s+/)),
          content: gist.content,
          created_at: new Date()
      })); 
      return localStorage.getItem(key);
    };

    this.search_by_category = function(category){
        var results = [];
        var key;
        for(var i=0; i< localStorage.length; i++){
            key = localStorage.key(i);
            if(key=="name"){continue;}
            i = localStorage.getItem(key);
            if ((JSON.parse(i)).categories.indexOf(category.toLowerCase()) != -1){
                results.push(i);
            }
        }
        return results;
    };

    this.display = function(key){
        item = JSON.parse(localStorage.getItem(key));
        return "<li class='gist' data-key='"+key+"'>"+item.title+"<span class='date'> "
                           +item.created_at.toLocaleString().replace(/\s+GMT.*/, "").replace(/[TZ]/, " ")+"</span></li>";
    }

    this.setExample = function(){
        if(!localStorage.getItem("example")){
        this.persist("example",
                {title: "Ejemplo",
                 categories: "examen, progra4",
                 content: "Aquí _hay_ **markdown** y \n\t@notes.each{|n| puts n}\n `código`"
                });
        }
    }
}


$(function(){
   $("#display").hide();
   Gist.setExample();
   converter = new Showdown.converter();

   if(!Modernizr.localstorage) {
    alert("Este browser no soporta html5, favor probar en otro");
   }
   if(localStorage.length > 0){
    var item;
    var key; 
    for(var i=0; i< localStorage.length; i++){
        key = localStorage.key(i);
        if(key=="name"){
            $("#name").text("Gists de "+localStorage.getItem(key));
            continue;
        }
        $("#gists").append(Gist.display(key));
    }
   }
   
   $(".gist").live('click', function(e){
    tgt = $(e.target);
    if(!tgt.is("li")){
        tgt = tgt.parent();
    }
    var gist = JSON.parse(localStorage.getItem(tgt.data("key")));
    $("#edition").hide();
    $("#display").html(converter.makeHtml(gist.content)).show();
    $('pre code', $("#display")).each(function(i, e) {hljs.highlightBlock(e)});    
   });

   $("#edition").submit(function(e){
    e.preventDefault();
    var key = guid();
    Gist.persist(key, {title: $("[name='title']").val(), 
                                  categories:  $("[name='categories']").val(),
                                  content:  $("[name='content']").val()});
    $("#gists").append(Gist.display(key));
   });

   $("#add").click(function(e){
    e.preventDefault();
    $("#edition").show();
   });
});
